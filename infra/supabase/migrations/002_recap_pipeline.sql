-- ============================================================================
-- hooks-os · Migration 002 · Post-session recap pipeline
-- Applied 2026-07-25 (scaffold)
--
-- Powers skills/post-session-recap-agent/ — the highest-leverage retention lever.
-- Session note (voice or text) → Claude generates recap → deliver to athlete +
-- parent within 4-6h → track opens/clicks → feed engagement + account-health.
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

create type recap_status as enum (
  'pending_note',     -- session done · coach hasn't submitted note yet
  'draft',            -- agent generated · awaiting voice-drift check
  'voice_check_failed', -- failed 3x drift retries · in human queue
  'ready_to_send',    -- passed all checks · queued for delivery
  'sent',             -- delivered via GHL
  'skipped'           -- coach opted out · rare
);

create type recap_recipient as enum (
  'athlete_only',
  'parent_only',
  'athlete_and_parent'
);

create type recap_event_type as enum (
  'delivered',
  'opened',
  'link_clicked',
  'replied',
  'bounced'
);

-- ============================================================================
-- SESSION NOTES · what the coach captured after the session
-- ============================================================================

create table session_notes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references sessions(id) on delete cascade,

  -- source (coach can submit voice memo transcript OR direct text)
  note_source text not null default 'text',   -- text · voice_transcript · voice_audio_url
  raw_note text not null,   -- the coach's actual words
  transcript_confidence numeric,   -- 0.0-1.0 if transcribed

  -- structured elements (agent extracts these to shape the recap)
  wins jsonb default '[]'::jsonb,       -- ["hands mid-route", "second stack held pace"]
  focus_areas jsonb default '[]'::jsonb, -- ["hip drop on comeback", "eyes off DB early"]
  drills_next jsonb default '[]'::jsonb, -- planned drills for next session
  film_timestamps jsonb default '[]'::jsonb, -- ["03:14 - stack rep 3", "05:22 - comeback rep 2"]

  submitted_by text,   -- coach identifier · Margin default
  submitted_at timestamptz not null default now(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index session_notes_session_idx on session_notes (session_id);
create index session_notes_submitted_idx on session_notes (submitted_at desc);

comment on table session_notes is 'Coach-captured notes · input to post-session-recap-agent/';

-- ============================================================================
-- RECAPS · agent-generated athlete-facing summary
-- ============================================================================

create table recaps (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  session_note_id uuid references session_notes(id) on delete set null,
  client_id uuid not null references clients(id) on delete cascade,

  status recap_status not null default 'pending_note',
  recipient recap_recipient not null,   -- set per segment (Youth/HS → parent, College-Bound → both, Alumni → athlete)

  -- generation metadata
  generation_attempts int not null default 0,
  voice_check_attempts int not null default 0,
  voice_drift_failures jsonb,   -- log of which checks failed on each attempt

  -- the actual content
  subject_line text,
  body_athlete text,   -- version if athlete gets separate message
  body_parent text,    -- version if parent gets separate message
  body_combined text,  -- single message if both go to same target

  -- CTA (drives the "click to see film timestamps" or "book next session" action)
  primary_cta_url text,
  primary_cta_label text,

  -- delivery
  ghl_message_id text,   -- returned by GHL when sent
  scheduled_send_at timestamptz,
  sent_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index recaps_session_idx on recaps (session_id);
create index recaps_client_idx on recaps (client_id);
create index recaps_status_idx on recaps (status);
create index recaps_pending_idx on recaps (created_at) where status in ('pending_note', 'draft', 'ready_to_send');

comment on table recaps is 'Agent-generated post-session recaps · target: delivery within 4-6h of session';

-- ============================================================================
-- RECAP EVENTS · track opens, clicks, replies for engagement signals
-- ============================================================================

create table recap_events (
  id uuid primary key default gen_random_uuid(),
  recap_id uuid not null references recaps(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,

  event_type recap_event_type not null,
  occurred_at timestamptz not null default now(),

  -- context for the event
  link_url text,          -- for link_clicked events
  reply_text text,        -- for replied events
  bounce_reason text,     -- for bounced events

  user_agent text,
  ip_country text,

  created_at timestamptz not null default now()
);

create index recap_events_recap_idx on recap_events (recap_id);
create index recap_events_client_idx on recap_events (client_id);
create index recap_events_type_idx on recap_events (event_type);
create index recap_events_occurred_idx on recap_events (occurred_at desc);

comment on table recap_events is 'Engagement telemetry from recap delivery · feeds account-health-agent/ + engagement-monitoring/';

-- ============================================================================
-- RLS
-- ============================================================================

alter table session_notes enable row level security;
alter table recaps enable row level security;
alter table recap_events enable row level security;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

create trigger session_notes_updated_at before update on session_notes for each row execute function set_updated_at();
create trigger recaps_updated_at before update on recaps for each row execute function set_updated_at();

-- ============================================================================
-- CONVENIENCE VIEWS · reporting-ready
-- ============================================================================

create view recap_delivery_stats as
select
  c.id as client_id,
  c.segment,
  count(distinct r.id) as recaps_sent,
  count(distinct case when re.event_type = 'opened' then re.id end) as opens,
  count(distinct case when re.event_type = 'link_clicked' then re.id end) as clicks,
  count(distinct case when re.event_type = 'replied' then re.id end) as replies,
  max(r.sent_at) as last_recap_sent_at,
  max(case when re.event_type = 'opened' then re.occurred_at end) as last_open_at
from clients c
left join recaps r on r.client_id = c.id and r.status = 'sent'
left join recap_events re on re.recap_id = r.id
where c.is_active = true
group by c.id, c.segment;

comment on view recap_delivery_stats is 'Per-client recap engagement rollup · read by account-health-agent/';
