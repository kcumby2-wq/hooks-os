-- ============================================================================
-- hooks-os · Migration 001 · Core schema
-- Applied 2026-07-25 (scaffold · Kyron reviews before applying to prod Supabase)
--
-- Covers the operating brain's core entities: leads → consults → clients →
-- sessions → packages. Segment tags flow through every table so routing per
-- client-segmentation/ works everywhere downstream.
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

create type client_segment as enum (
  'youth_hs',        -- Youth / HS · parent buyer
  'college_bound',   -- Juniors/seniors + transfer portal · athlete buyer w/ parent co-sign
  'alumni_pro',      -- Former clients now at college / NFL · athlete or agent buyer
  'unclassified'     -- Not yet tagged · escalates to sales-qualification-agent
);

create type source_tag as enum (
  'cold_inbound',        -- unattributed website / social
  'paid_ad',             -- ad-specific landing page
  'client_referral',     -- referred through athlete-referral-program (not roster)
  'roster_referral',     -- Margin's existing roster · triggers revenue share
  'alumni_network',      -- Alumni referring their network · triggers revenue share
  'direct_margin_intro', -- Margin personally introducing · triggers revenue share
  'unknown'
);

create type lead_stage as enum (
  'first_contact',
  'consult_booked',
  'consult_attended',
  'deciding',
  'active_client',
  'renewal',
  'churned',
  'closed_no_fit'
);

create type consult_outcome as enum (
  'signed_package',
  'attended_undecided',
  'attended_no_fit',
  'no_show'
);

create type package_status as enum (
  'active',
  'expiring_soon',   -- inside the 30-day renewal window
  'expired',
  'churned',
  'cancelled'
);

create type session_status as enum (
  'scheduled',
  'completed',
  'no_show',
  'cancelled_by_athlete',
  'cancelled_by_coach'
);

-- ============================================================================
-- LEADS · every inbound tagged and tracked
-- ============================================================================

create table leads (
  id uuid primary key default gen_random_uuid(),

  -- identity
  athlete_first_name text,
  athlete_last_name text,
  parent_first_name text,
  parent_last_name text,
  parent_email text,
  parent_phone text,
  athlete_email text,   -- for College-Bound + Alumni · null for minors
  athlete_phone text,   -- for College-Bound + Alumni · null for minors

  -- classification (per skills/client-segmentation/)
  segment client_segment not null default 'unclassified',
  source source_tag not null default 'unknown',
  source_detail text,   -- freeform · e.g. "Marvin's cousin" · "IG ad · release-drill campaign"

  -- athlete details
  athlete_position text,   -- WR default · other positions possible
  athlete_grad_year int,
  athlete_height_in int,
  athlete_weight_lb int,
  athlete_high_school text,
  athlete_film_url text,

  -- goal + context
  goal text,
  intake_notes text,

  -- pipeline
  stage lead_stage not null default 'first_contact',

  -- attribution (feeds athlete-referral-program/ + roster-revenue-share/)
  referring_client_id uuid,   -- set if source = client_referral
  is_roster_referral boolean generated always as (
    source in ('roster_referral', 'alumni_network', 'direct_margin_intro')
  ) stored,

  -- timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  first_consult_booked_at timestamptz,
  first_consult_attended_at timestamptz,
  converted_at timestamptz   -- when they became an active client
);

create index leads_segment_idx on leads (segment);
create index leads_stage_idx on leads (stage);
create index leads_source_idx on leads (source);
create index leads_created_idx on leads (created_at desc);
create index leads_roster_referral_idx on leads (is_roster_referral) where is_roster_referral = true;

comment on table leads is 'Every inbound inquiry · tagged at intake per skills/client-segmentation/ and skills/lead-capture-automation/';

-- ============================================================================
-- CONSULTS · discovery calls + no-show tracking
-- ============================================================================

create table consults (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,

  scheduled_at timestamptz not null,
  duration_min int not null default 15,
  meeting_type text default 'zoom',   -- zoom · phone · in-person
  meeting_url text,

  outcome consult_outcome,   -- null until consult ends
  outcome_notes text,

  reminders_sent int not null default 0,
  no_show_recovery_started_at timestamptz,
  rebooked_from_consult_id uuid references consults(id),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index consults_lead_idx on consults (lead_id);
create index consults_scheduled_idx on consults (scheduled_at);
create index consults_outcome_idx on consults (outcome);

comment on table consults is 'Discovery call bookings + no-show recovery tracking · skills/session-booking-no-show/';

-- ============================================================================
-- CLIENTS · leads who signed a package
-- ============================================================================

create table clients (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null unique references leads(id),

  -- redundant for query speed · matches leads at conversion
  segment client_segment not null,
  source source_tag not null,
  is_roster_referral boolean not null default false,

  -- lifecycle state
  onboarding_completed_at timestamptz,
  first_session_completed_at timestamptz,
  first_recap_sent_at timestamptz,

  -- current state
  is_active boolean not null default true,
  churned_at timestamptz,
  churn_reason text,

  -- timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clients_segment_idx on clients (segment);
create index clients_active_idx on clients (is_active) where is_active = true;
create index clients_roster_referral_idx on clients (is_roster_referral) where is_roster_referral = true;

comment on table clients is 'Leads who signed a package · active-client-facing skills key off this table';

-- ============================================================================
-- PACKAGES · what a client bought
-- ============================================================================

create type package_tier as enum (
  'stl_membership',
  'stl_cohort',
  'prospect_edge',
  'cbh_apex',
  'trainer_blueprint'
);

create table packages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete restrict,

  tier package_tier not null,
  price_cents int not null,
  sessions_included int,   -- null for platform tiers like membership
  sessions_used int not null default 0,

  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,

  status package_status not null default 'active',

  stripe_subscription_id text,
  stripe_payment_intent_id text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index packages_client_idx on packages (client_id);
create index packages_status_idx on packages (status);
create index packages_expiring_idx on packages (expires_at) where status = 'active';

comment on table packages is 'Client packages · skills/package-renewal-tracking/ reads expires_at for 30/14/7 cadence';

-- ============================================================================
-- SESSIONS · every training session
-- ============================================================================

create table sessions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete restrict,
  package_id uuid references packages(id) on delete set null,

  scheduled_at timestamptz not null,
  duration_min int not null default 60,
  location_type text default 'in_person',   -- in_person · zoom · film_review

  status session_status not null default 'scheduled',
  attended_at timestamptz,

  -- reminder tracking (per session-booking-no-show/)
  reminder_48h_sent_at timestamptz,
  reminder_24h_sent_at timestamptz,
  reminder_2h_sent_at timestamptz,

  -- no-show recovery
  no_show_recovery_started_at timestamptz,
  rebooked_from_session_id uuid references sessions(id),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index sessions_client_idx on sessions (client_id);
create index sessions_scheduled_idx on sessions (scheduled_at);
create index sessions_status_idx on sessions (status);

comment on table sessions is 'Every training session · consumed by post-session-recap-agent/ + account-health-agent/';

-- ============================================================================
-- ROW LEVEL SECURITY · service role only for now
-- Fine-grained policies added as auth model matures
-- ============================================================================

alter table leads enable row level security;
alter table consults enable row level security;
alter table clients enable row level security;
alter table packages enable row level security;
alter table sessions enable row level security;

-- Default deny · Edge Functions use service role key
-- Client-facing dashboards will need explicit read policies in a future migration

-- ============================================================================
-- TRIGGERS · updated_at auto-management
-- ============================================================================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_updated_at before update on leads for each row execute function set_updated_at();
create trigger consults_updated_at before update on consults for each row execute function set_updated_at();
create trigger clients_updated_at before update on clients for each row execute function set_updated_at();
create trigger packages_updated_at before update on packages for each row execute function set_updated_at();
create trigger sessions_updated_at before update on sessions for each row execute function set_updated_at();
