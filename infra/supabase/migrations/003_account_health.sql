-- ============================================================================
-- hooks-os · Migration 003 · Account-health agent
-- Applied 2026-07-25 (scaffold)
--
-- Powers skills/account-health-agent/ — signal-based drop-off detection.
-- Daily 09:00 CT scan reads signals across attendance, recap engagement,
-- comms responsiveness, and payment health · flags concerns · queues
-- interventions.
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

create type signal_type as enum (
  -- attendance
  'no_show_streak',           -- 2+ no-shows in a row
  'attendance_gap',           -- no session in X days (X per segment)
  'session_frequency_drop',   -- monthly cadence dropping vs baseline

  -- recap engagement
  'recap_open_streak_missed', -- last N recaps unopened
  'recap_click_drop',         -- clicks trending down

  -- comms
  'comm_unresponsive',        -- outbound messages unanswered for X days
  'comm_negative_sentiment',  -- reply flagged negative by agent

  -- payment
  'payment_failed',
  'renewal_approaching_silent',   -- inside 30-day window · no positive engagement
  'renewal_missed',

  -- content
  'stopped_engaging_content'  -- no likes/comments on STL posts (if tracked)
);

create type flag_severity as enum (
  'watch',      -- log but no intervention yet
  'yellow',     -- soft intervention (agent-drafted touch)
  'orange',    -- coach-personal intervention needed
  'red'         -- Margin-personal intervention · likely churn imminent
);

create type flag_status as enum (
  'open',
  'intervention_queued',
  'intervention_sent',
  'resolved',
  'churned',   -- account did churn · flag closed for learning
  'false_positive'
);

create type intervention_type as enum (
  'agent_soft_touch',    -- automated warm check-in
  'coach_personal_msg',  -- coach drafts + sends
  'margin_personal_msg', -- Margin drafts + sends
  'coach_phone_call',
  'margin_phone_call'
);

-- ============================================================================
-- SIGNALS · raw observations feeding the flag calculator
-- ============================================================================

create table signals (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,

  signal_type signal_type not null,

  -- signal payload · shape varies by type
  payload jsonb not null default '{}'::jsonb,

  -- e.g. { "days_since_last_session": 21, "baseline_days": 7 }
  -- e.g. { "recaps_missed": 3, "last_open_at": "2026-06-01" }
  -- e.g. { "amount_cents": 45000, "stripe_error": "card_declined" }

  observed_at timestamptz not null default now(),
  scan_run_id uuid,   -- links to the daily scan that produced this signal

  created_at timestamptz not null default now()
);

create index signals_client_idx on signals (client_id);
create index signals_type_idx on signals (signal_type);
create index signals_observed_idx on signals (observed_at desc);

comment on table signals is 'Raw drop-off observations · daily scan writes these · flags derived from them';

-- ============================================================================
-- FLAGS · derived from signals · one per active concern per client
-- ============================================================================

create table flags (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,

  primary_signal_type signal_type not null,   -- the dominant signal
  contributing_signal_ids uuid[] default '{}',

  severity flag_severity not null,
  status flag_status not null default 'open',

  -- agent-generated rationale (why this severity)
  rationale text,

  opened_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolution_note text,

  -- outcome tracking (for calibrating the model)
  did_churn boolean,
  churn_confirmed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index flags_client_idx on flags (client_id);
create index flags_status_idx on flags (status);
create index flags_severity_idx on flags (severity);
create index flags_open_idx on flags (opened_at desc) where status = 'open';

-- one open flag per (client · signal_type) at a time · new signals update existing flag
create unique index flags_client_type_open_uniq
  on flags (client_id, primary_signal_type)
  where status in ('open', 'intervention_queued', 'intervention_sent');

comment on table flags is 'Active concerns · one open flag per client per signal_type · intervention queue reads this';

-- ============================================================================
-- INTERVENTIONS · what got done about the flag
-- ============================================================================

create table interventions (
  id uuid primary key default gen_random_uuid(),
  flag_id uuid not null references flags(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,

  intervention_type intervention_type not null,

  -- content
  message_body text,
  drafted_by text default 'agent',   -- agent · Margin · Kyron · coach name
  approved_by text,
  approved_at timestamptz,

  -- delivery
  ghl_message_id text,
  scheduled_send_at timestamptz,
  sent_at timestamptz,

  -- response tracking
  response_received_at timestamptz,
  response_text text,
  response_sentiment text,   -- positive · neutral · negative · escalation

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index interventions_flag_idx on interventions (flag_id);
create index interventions_client_idx on interventions (client_id);
create index interventions_pending_idx on interventions (scheduled_send_at) where sent_at is null;

comment on table interventions is 'Every intervention taken on a flagged client · resolution reads response_sentiment';

-- ============================================================================
-- SCAN RUNS · one row per daily agent execution
-- ============================================================================

create table scan_runs (
  id uuid primary key default gen_random_uuid(),
  scan_type text not null,   -- account_health · engagement_monitoring · renewal_check

  started_at timestamptz not null default now(),
  completed_at timestamptz,

  clients_scanned int,
  signals_created int,
  flags_opened int,
  flags_escalated int,
  flags_resolved int,

  error_count int not null default 0,
  errors jsonb,

  created_at timestamptz not null default now()
);

create index scan_runs_type_idx on scan_runs (scan_type);
create index scan_runs_started_idx on scan_runs (started_at desc);

-- ============================================================================
-- RLS
-- ============================================================================

alter table signals enable row level security;
alter table flags enable row level security;
alter table interventions enable row level security;
alter table scan_runs enable row level security;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

create trigger flags_updated_at before update on flags for each row execute function set_updated_at();
create trigger interventions_updated_at before update on interventions for each row execute function set_updated_at();
