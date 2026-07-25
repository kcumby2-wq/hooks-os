# hooks-os Infrastructure

**Purpose:** the concrete runtime layer that makes the skill specs in `../skills/` actually run. Skills define WHAT the operating brain does. Infra defines WHERE and HOW it runs.

**Status:** v1.0 · scaffolded 2026-07-25 · matches STL Growth Plan absorption + v1.1 skill cross-references
**Owner:** Kyron (build + orchestration) · Will (billing integration) · Margin (approval + voice authority on generated content)

---

## Runtime allocation

Every skill in `../skills/` runs on one or more of the following runtimes. This document is the map.

### Supabase (source of truth · this repo)

**Owns:**
- Every lead, client, session, package, payment record
- Every recap sent + open/click event
- Every account-health signal + flag
- Every referral source tag
- Every revenue-share ledger entry
- Every message queued or sent (mirrored from GHL for our own audit)

**Why Supabase:** the operating brain owns the data. GHL is one delivery surface. Stripe is one payment processor. Instagram is one social surface. If any of them changes tomorrow, the data survives because it lives here.

**Location:** `infra/supabase/`

### GoHighLevel (GHL) · CRM + comms delivery

**Owns:**
- Contact records (mirrored to Supabase on webhook)
- SMS + email sending (per lifecycle sequences)
- Booking calendar
- Follower-triggered webhooks (IG contact creation)

**Why GHL:** the plan says GHL. Same infrastructure Will's building for Modern Football. Familiar territory. Deep SMS + email delivery integration.

**Location:** `infra/ghl/` (config specs · webhook payload specs · workflow-import JSON — the GHL builds themselves live in GHL's UI, not in this repo)

### Stripe (or equivalent) · payments

**Owns:**
- Package charge processing
- Renewal auto-billing
- Missed-payment retry cadence
- Webhooks that Supabase listens to for revenue-share calculation

**Why:** Modern Football pattern. Will builds it once, both repos use it.

### Anthropic Claude API · agent layer

**Owns:**
- `post-session-recap-agent/` recap generation
- `sales-qualification-agent/` inbound classification + response drafting
- `account-health-agent/` signal analysis + intervention drafting

**Location:** `infra/supabase/functions/` (Edge Functions calling Claude API from server-side)

---

## Skill → Runtime mapping

The full skill-to-runtime allocation table lives in `infra/skill-runtime-map.md`. Every skill in the operating brain maps to one or more concrete runtimes here.

---

## Directory structure

```
infra/
├── README.md                     — this file
├── skill-runtime-map.md          — which skill runs where
├── supabase/
│   ├── migrations/               — SQL migrations (numbered · applied in order)
│   │   ├── 001_core_schema.sql   — leads · clients · sessions · packages
│   │   ├── 002_recap_pipeline.sql — session_notes · recaps · recap_events
│   │   ├── 003_account_health.sql — signals · flags · interventions
│   │   ├── 004_revenue_share.sql — source tags · revenue_share_ledger
│   │   └── 005_engagement.sql    — social + content engagement events
│   └── functions/                — Edge Functions (TS · deployed to Supabase)
│       ├── recap-agent/          — post-session-recap-agent runtime
│       ├── qual-agent/           — sales-qualification-agent runtime
│       ├── health-agent/         — account-health-agent runtime
│       └── stripe-webhook/       — payment webhook → CRM state transitions
└── ghl/
    ├── workflows/                — GHL workflow specs (JSON export format)
    ├── webhooks.md               — inbound webhook contracts (GHL → Supabase)
    └── field-mapping.md          — GHL custom fields ↔ Supabase columns
```

---

## Build sequencing (matches `STL-Growth-Plan-Adoption.md`)

### Phase 01 · Foundation (pre-August)
- `001_core_schema.sql` · `002_recap_pipeline.sql` · `004_revenue_share.sql`
- Stripe webhook Edge Function
- GHL workflows for: intake · session booking · session reminders · no-show recovery · onboarding sequence · renewal 30/14/7
- Recap agent Edge Function (highest-leverage retention lever · ships week one)

### Phase 02 · Intelligence layer (Aug-Oct)
- `003_account_health.sql`
- Sales-qualification-agent Edge Function
- Account-health-agent Edge Function
- Outcomes-based-communication voice-drift check integrated into every agent call

### Phase 03 · Social & content (Oct-Dec)
- `005_engagement.sql`
- Release Room Friday production pipeline (via GHL scheduling + Supabase content-brief table)
- Social auto-reply pattern extended (sales-qualification-agent → comment surfaces)

---

## What this repo does NOT contain

- GHL account credentials (env vars only · never checked in)
- Stripe secrets (env vars only)
- Anthropic API keys (env vars only)
- Actual GHL workflow builds (they live in GHL's UI · this repo ships the SPECS the workflows are built from)
- Actual PII (client names, phone numbers, email addresses) — the migrations create the SCHEMA · the data flows through Supabase itself, not through this repo

---

*Skills tell the operating brain WHAT to do. Infra tells the operating brain WHERE and HOW to run.*
