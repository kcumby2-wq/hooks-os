-- ============================================================================
-- hooks-os · Migration 005 · Engagement + content
-- Applied 2026-07-25 (scaffold)
--
-- Powers skills/engagement-monitoring/ + skills/release-room-friday/ +
-- skills/subject-media-coordination/.  Tracks content briefs (input to the
-- Release Room production cycle) and engagement events (social + content
-- output feeding weekly rollup).
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

create type content_platform as enum (
  'instagram',
  'tiktok',
  'youtube',
  'youtube_shorts',
  'twitter',
  'linkedin',
  'stl_email',
  'stl_website',
  'cbh_email',
  'cbh_website'
);

create type content_series as enum (
  'release_room_friday',
  'athlete_story',
  'training_clip',
  'field_notes',
  'coach_advocacy',
  'trainer_blueprint_content',
  'stl_membership_content',
  'general'
);

create type content_brief_status as enum (
  'draft',
  'approved',
  'in_production',
  'ready_for_review',
  'scheduled',
  'published',
  'cancelled'
);

create type engagement_event_type as enum (
  'view',
  'like',
  'comment',
  'save',
  'share',
  'follow',
  'unfollow',
  'link_click',
  'story_reply',
  'dm_from_content'   -- DM referencing this content · high-signal
);

-- ============================================================================
-- CONTENT BRIEFS · Release Room Friday + all series
-- ============================================================================

create table content_briefs (
  id uuid primary key default gen_random_uuid(),

  series content_series not null,
  title text not null,

  -- athlete or subject
  featured_client_id uuid references clients(id) on delete set null,
  featured_athlete_name text,   -- if not a client (alumni, guest, etc.)

  -- narrative
  hook text,                    -- opening seconds · what stops the scroll
  arc text,                     -- middle · what unfolds
  payoff text,                  -- closing · what the viewer walks away with
  outcome_language text,        -- the outcome the story demonstrates (feeds outcomes-based-communication/)

  -- production
  film_source text,             -- where raw footage lives
  film_timestamps jsonb,        -- ["03:14 - stack rep 3", ...]
  planned_platforms content_platform[] default '{}',
  primary_cta_label text,
  primary_cta_url text,

  -- pipeline state
  status content_brief_status not null default 'draft',
  target_publish_date date,
  actual_publish_date date,

  -- ownership
  drafted_by text,   -- typically subject-media-coordination
  approved_by text,
  approved_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index content_briefs_series_idx on content_briefs (series);
create index content_briefs_status_idx on content_briefs (status);
create index content_briefs_publish_idx on content_briefs (target_publish_date);
create index content_briefs_client_idx on content_briefs (featured_client_id);

comment on table content_briefs is 'Every planned + published content piece · Release Room Friday reads target_publish_date';

-- ============================================================================
-- CONTENT ASSETS · the actual published pieces (one brief → many assets)
-- ============================================================================

create table content_assets (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references content_briefs(id) on delete cascade,

  platform content_platform not null,
  external_id text,             -- IG post id · TikTok video id · etc.
  external_url text,

  published_at timestamptz,

  -- caption/copy (agent-generated per platform)
  caption text,
  hashtags text[],

  -- engagement snapshot (updated periodically)
  view_count int default 0,
  like_count int default 0,
  comment_count int default 0,
  save_count int default 0,
  share_count int default 0,
  snapshot_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index content_assets_brief_idx on content_assets (brief_id);
create index content_assets_platform_idx on content_assets (platform);
create index content_assets_published_idx on content_assets (published_at desc);

comment on table content_assets is 'Platform-specific instances of a brief · one brief → many assets across platforms';

-- ============================================================================
-- ENGAGEMENT EVENTS · granular actions per asset
-- ============================================================================

create table engagement_events (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references content_assets(id) on delete cascade,

  event_type engagement_event_type not null,

  -- who (only set if identifiable · e.g. logged-in follower)
  external_actor_id text,       -- platform-native user id
  actor_handle text,
  client_id uuid references clients(id) on delete set null,   -- linked if we can match

  -- context
  metadata jsonb default '{}'::jsonb,   -- comment text · reply text · referrer · etc.
  occurred_at timestamptz not null default now(),

  created_at timestamptz not null default now()
);

create index engagement_events_asset_idx on engagement_events (asset_id);
create index engagement_events_type_idx on engagement_events (event_type);
create index engagement_events_client_idx on engagement_events (client_id) where client_id is not null;
create index engagement_events_occurred_idx on engagement_events (occurred_at desc);

comment on table engagement_events is 'Granular content engagement · rolled up for weekly Monday review · feeds account-health-agent/ when actor matches a client';

-- ============================================================================
-- ADVOCACY LOG · cbh-advocacy tracking (Margin's coach calls)
-- ============================================================================

create table advocacy_log (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,

  -- what advocacy action was taken
  action_type text not null,   -- coach_call · text_intro · film_send · in_person_intro · school_visit
  coach_recipient text,        -- who Margin called
  school text,                 -- their school
  occurred_at timestamptz not null default now(),

  -- outcome
  outcome_note text,
  led_to_offer boolean,
  led_to_visit boolean,
  led_to_commit boolean,

  logged_by text default 'margin',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index advocacy_log_client_idx on advocacy_log (client_id);
create index advocacy_log_occurred_idx on advocacy_log (occurred_at desc);

comment on table advocacy_log is 'skills/cbh-advocacy/ · Margin logs every coach-to-college advocacy touch · human-only entry';

-- ============================================================================
-- REFERRALS · athlete-referral-program tracking
-- ============================================================================

create type referral_status as enum (
  'link_generated',
  'link_clicked',
  'form_submitted',
  'consult_booked',
  'consult_attended',
  'converted',
  'expired'
);

create table referrals (
  id uuid primary key default gen_random_uuid(),

  referring_client_id uuid not null references clients(id) on delete restrict,
  referral_code text not null unique,

  -- resulting lead if link converts
  resulting_lead_id uuid references leads(id) on delete set null,

  status referral_status not null default 'link_generated',

  -- reward tracking
  reward_type text,             -- session_credit · gear · cash_credit · other
  reward_amount_cents int,
  reward_delivered_at timestamptz,

  -- alumni weighting (referrals from alumni-tier clients weight higher · per athlete-referral-program/)
  is_alumni_referral boolean not null default false,

  first_click_at timestamptz,
  converted_at timestamptz,
  expires_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index referrals_referring_client_idx on referrals (referring_client_id);
create index referrals_code_idx on referrals (referral_code);
create index referrals_status_idx on referrals (status);
create index referrals_lead_idx on referrals (resulting_lead_id);

comment on table referrals is 'skills/athlete-referral-program/ · one row per unique referral link';

-- ============================================================================
-- WEEKLY ENGAGEMENT SNAPSHOTS · Monday review output
-- ============================================================================

create table engagement_weekly_snapshots (
  id uuid primary key default gen_random_uuid(),

  week_start date not null unique,

  -- content-side rollup (engagement-monitoring/)
  briefs_published int not null default 0,
  release_room_shipped boolean not null default false,
  total_views int not null default 0,
  total_engagement int not null default 0,   -- likes + comments + saves + shares
  top_asset_id uuid references content_assets(id),

  -- inbound-signal rollup
  new_dms_from_content int not null default 0,
  new_followers int not null default 0,
  new_leads_attributed int not null default 0,

  summary_narrative text,   -- agent-generated one-paragraph roll-up

  created_at timestamptz not null default now()
);

create index engagement_weekly_snapshots_week_idx on engagement_weekly_snapshots (week_start desc);

comment on table engagement_weekly_snapshots is 'Monday weekly review output · one row per week · powers the review Slack/email';

-- ============================================================================
-- RLS
-- ============================================================================

alter table content_briefs enable row level security;
alter table content_assets enable row level security;
alter table engagement_events enable row level security;
alter table advocacy_log enable row level security;
alter table referrals enable row level security;
alter table engagement_weekly_snapshots enable row level security;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

create trigger content_briefs_updated_at before update on content_briefs for each row execute function set_updated_at();
create trigger content_assets_updated_at before update on content_assets for each row execute function set_updated_at();
create trigger advocacy_log_updated_at before update on advocacy_log for each row execute function set_updated_at();
create trigger referrals_updated_at before update on referrals for each row execute function set_updated_at();
