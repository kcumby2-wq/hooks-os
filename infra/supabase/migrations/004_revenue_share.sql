-- ============================================================================
-- hooks-os · Migration 004 · Revenue share ledger
-- Applied 2026-07-25 (scaffold)
--
-- Powers skills/roster-revenue-share/ — the 10% TOJ arrangement on every
-- roster-attributed client's collected revenue. Every Stripe payment webhook
-- writes here when source_tag qualifies. Monthly cron generates statement.
--
-- Per operating direction: revenue share flows to TOJ.
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

create type payment_event_type as enum (
  'succeeded',
  'refunded',
  'partial_refunded',
  'chargeback',
  'failed'
);

create type ledger_entry_type as enum (
  'accrual',       -- +10% credited to TOJ from a succeeded payment
  'reversal',      -- refund/chargeback claws it back
  'adjustment',    -- manual correction (must have note)
  'payout'         -- actual transfer to TOJ · closes accrued balance
);

create type ledger_status as enum (
  'accrued',       -- credited · not yet paid out
  'included_in_statement',
  'paid_out',
  'reversed'
);

-- ============================================================================
-- PAYMENT EVENTS · Stripe webhook writes here
-- ============================================================================

create table payment_events (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete set null,
  package_id uuid references packages(id) on delete set null,

  event_type payment_event_type not null,

  -- Stripe context
  stripe_event_id text not null unique,   -- idempotency key
  stripe_payment_intent_id text,
  stripe_charge_id text,
  stripe_refund_id text,

  -- money
  amount_cents int not null,          -- positive for succeeded · negative for refund
  currency text not null default 'usd',

  -- attribution (denormalized for statement queries)
  source_tag_at_time source_tag,      -- snapshot of client source at payment time
  is_roster_referral_at_time boolean, -- snapshot

  occurred_at timestamptz not null,   -- Stripe's event timestamp
  processed_at timestamptz not null default now(),

  raw_stripe_payload jsonb,

  created_at timestamptz not null default now()
);

create index payment_events_client_idx on payment_events (client_id);
create index payment_events_type_idx on payment_events (event_type);
create index payment_events_occurred_idx on payment_events (occurred_at desc);
create index payment_events_stripe_evt_idx on payment_events (stripe_event_id);

comment on table payment_events is 'Every Stripe payment event · source of truth for revenue-share calculation';

-- ============================================================================
-- REVENUE SHARE LEDGER · 10% TOJ accruals + payouts
-- ============================================================================

create table revenue_share_ledger (
  id uuid primary key default gen_random_uuid(),

  -- what triggered this entry
  payment_event_id uuid references payment_events(id) on delete restrict,
  client_id uuid references clients(id) on delete set null,

  entry_type ledger_entry_type not null,

  -- money
  share_rate numeric not null default 0.10,   -- 10% · configurable if terms change
  gross_amount_cents int not null,             -- the payment this share is calculated from
  share_amount_cents int not null,             -- gross * share_rate

  -- accounting state
  status ledger_status not null default 'accrued',

  -- statement + payout linkage
  statement_id uuid,       -- fk to statements table
  payout_reference text,   -- external transfer reference when paid out
  paid_out_at timestamptz,

  -- audit
  note text,   -- required on adjustments
  created_by text default 'system',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index revenue_share_client_idx on revenue_share_ledger (client_id);
create index revenue_share_payment_idx on revenue_share_ledger (payment_event_id);
create index revenue_share_status_idx on revenue_share_ledger (status);
create index revenue_share_statement_idx on revenue_share_ledger (statement_id);

comment on table revenue_share_ledger is 'TOJ 10% roster-revenue-share ledger · every accrual + payout · never delete rows · reversals only';

-- ============================================================================
-- STATEMENTS · monthly rollup for TOJ
-- ============================================================================

create table revenue_share_statements (
  id uuid primary key default gen_random_uuid(),

  period_start date not null,
  period_end date not null,

  gross_qualified_revenue_cents int not null,   -- total roster-attributed revenue in period
  total_share_cents int not null,               -- 10% of gross
  reversals_cents int not null default 0,      -- refunds/chargebacks in period
  adjustments_cents int not null default 0,
  net_owed_cents int not null,                  -- share - reversals + adjustments

  client_count int not null,                    -- unique roster clients contributing
  entry_count int not null,                     -- ledger entries included

  status text not null default 'draft',   -- draft · issued · paid
  issued_at timestamptz,
  paid_at timestamptz,
  payout_reference text,

  breakdown_pdf_url text,   -- generated statement doc (if produced)
  breakdown_json jsonb,     -- machine-readable version of the statement

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (period_start, period_end)
);

create index revenue_share_statements_period_idx on revenue_share_statements (period_start desc);
create index revenue_share_statements_status_idx on revenue_share_statements (status);

alter table revenue_share_ledger
  add constraint revenue_share_ledger_statement_fk
  foreign key (statement_id) references revenue_share_statements(id) on delete set null;

comment on table revenue_share_statements is 'Monthly TOJ revenue-share statements · one per period · driven by scheduled function';

-- ============================================================================
-- HELPER · calculate accrual for a payment event
-- ============================================================================

create or replace function calculate_revenue_share(
  p_payment_event_id uuid
) returns uuid
language plpgsql
as $$
declare
  v_event payment_events%rowtype;
  v_share_amount int;
  v_ledger_id uuid;
begin
  select * into v_event from payment_events where id = p_payment_event_id;
  if not found then
    raise exception 'payment event not found: %', p_payment_event_id;
  end if;

  -- only qualifying source tags accrue
  if v_event.is_roster_referral_at_time is not true then
    return null;
  end if;

  v_share_amount := round(v_event.amount_cents * 0.10)::int;

  insert into revenue_share_ledger (
    payment_event_id, client_id,
    entry_type,
    share_rate, gross_amount_cents, share_amount_cents,
    status,
    note
  )
  values (
    p_payment_event_id, v_event.client_id,
    case when v_event.event_type = 'succeeded' then 'accrual'::ledger_entry_type
         when v_event.event_type in ('refunded', 'partial_refunded', 'chargeback') then 'reversal'::ledger_entry_type
         else 'adjustment'::ledger_entry_type
    end,
    0.10, v_event.amount_cents, v_share_amount,
    'accrued',
    'auto-generated from payment_event ' || v_event.stripe_event_id
  )
  returning id into v_ledger_id;

  return v_ledger_id;
end;
$$;

comment on function calculate_revenue_share is 'Fires from Stripe webhook Edge Function · idempotent by payment_event unique constraint upstream';

-- ============================================================================
-- RLS
-- ============================================================================

alter table payment_events enable row level security;
alter table revenue_share_ledger enable row level security;
alter table revenue_share_statements enable row level security;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

create trigger revenue_share_ledger_updated_at before update on revenue_share_ledger for each row execute function set_updated_at();
create trigger revenue_share_statements_updated_at before update on revenue_share_statements for each row execute function set_updated_at();
