# Skill → Runtime Map

Every skill in `../skills/` runs on one or more concrete runtimes. This document is the map.

**Legend:**
- **SB** = Supabase (schema + Edge Function)
- **GHL** = GoHighLevel (workflow + webhook)
- **STR** = Stripe (payment)
- **AI** = Anthropic Claude API (agent-layer generation)
- **HUM** = Human-only · not automated

---

## Core operational skills (from Growth Plan absorption)

| Skill | Runtimes | Where it fires | Notes |
|---|---|---|---|
| `client-segmentation/` | SB + GHL | intake form field · GHL contact tag · Supabase `leads.segment` column | The frame every other runtime reads |
| `lead-capture-automation/` | SB + GHL | GHL forms + IG webhook · Supabase `leads` insert | Segment tag set at row creation |
| `session-booking-no-show/` | GHL + SB | GHL calendar + workflow · Supabase `consults` state transitions | Reminder cadence per skill spec |
| `onboarding-sequence/` | GHL + SB | GHL workflow · Supabase `clients` insert | Per-segment parallel tracks |
| `package-renewal-tracking/` | SB + STR + GHL | Stripe webhook · Supabase `packages.expiration` · GHL renewal workflow | 30/14/7 driven by Supabase cron |
| `post-session-recap-agent/` | AI + SB + GHL | Supabase Edge Function `recap-agent/` | **Highest-leverage · ships first** |
| `account-health-agent/` | AI + SB | Supabase Edge Function `health-agent/` · daily cron | Reads all engagement + attendance signals |
| `sales-qualification-agent/` | AI + GHL + SB | Supabase Edge Function `qual-agent/` · triggered by GHL webhook | Handles inbound DM classification |
| `outcomes-based-communication/` | AI (guardrail) | Voice-drift check on every AI-generated output | Runs inside every agent Edge Function |
| `release-room-friday/` | HUM + GHL + SB | Manual production + GHL scheduling + Supabase `content_briefs` table | Weekly cycle · consistency is the compounding |
| `athlete-referral-program/` | SB + GHL + HUM | Supabase `referrals` table · unique referral links · trigger via real-moment human recognition | Trigger patterns · not fixed schedule |
| `roster-revenue-share/` | SB + STR | Supabase `revenue_share_ledger` · Stripe webhook feeds calculation | Auto-computed on every collected payment |

---

## Legacy skills (with v1.1 handshakes)

| Skill | Runtimes | Where it fires | Notes |
|---|---|---|---|
| `margin-voice/` | AI (guardrail) | Voice check on every AI-generated output | Sibling to outcomes-based-communication |
| `parent-comms/` | AI + GHL | Register applied to every parent-facing generated message | Runs INSIDE lifecycle sequences |
| `engagement-monitoring/` | SB + AI | Weekly Monday review · reads content-side data from Supabase | Sibling to account-health-agent |
| `subject-media-coordination/` | HUM + SB | Content briefs stored in Supabase `content_briefs` table · human production | Orchestrates Release Room Friday cycle |
| `cold-outreach/` | GHL + AI + HUM | GHL outbound workflows · agent drafts · human approval | OUTBOUND only · sibling to sales-qualification-agent |
| `cbh-advocacy/` | HUM | Margin's direct calls · logged manually in Supabase `advocacy_log` | The call itself cannot be automated |
| `cohort-design/` | HUM + GHL | Cohort structure lives in curriculum docs · GHL manages enrollment | Six-week arc per cohort spec |
| `event-campaign-design/` | HUM + GHL | Event flow lives in campaign docs · GHL manages registration | Eventbrite-adjacent |
| `gated-content-platform/` | HUM + custom app | Study.com-style content gate is a separate app tier | Not in this infra scope |
| `athlete-brand-pipeline/` | HUM + SB | Per-athlete pipeline data in Supabase `athletes` + `athlete_brand_touchpoints` | Weekly roster pulse |
| `prospect-edge-workflow/` | HUM + SB | Transcript generation is manual · state tracked in Supabase | Grading is Margin's craft |
| `trainer-blueprint/` | HUM + GHL | Blueprint sales flow uses GHL for intake + comms | Kyron interviews every candidate |
| `role-model/` | (reference only) | Persona reference for every agent prompt | No runtime · voice guidance |

---

## Cross-cutting runtimes

### Voice-drift check (`outcomes-based-communication/` + `margin-voice/`)

**Runs inside every AI Edge Function** as a post-generation guardrail:
1. Generate output
2. Run drift check (does it lead with outcome · does it match Margin voice · does it use banned language)
3. If pass → return output
4. If fail → regenerate with corrective prompt, up to 3 retries
5. If still fail after 3 → escalate to human review queue

### Segment routing

**Every generated output reads `leads.segment` or `clients.segment` from Supabase** before drafting. The register (parent-first vs athlete-first vs Margin-direct) is set by segment tag at write time.

### Revenue-share ledger

**Every Stripe payment webhook fires:**
1. Insert row in `packages.payment_events`
2. Look up client's `source_tag`
3. If `source_tag IN ('roster-referral', 'alumni-network', 'direct-margin-intro')` → insert row in `revenue_share_ledger` with 10% of collected amount
4. Monthly cron generates statement

---

## What runs when · daily cron schedule

| Cron | Skill | Runtime |
|---|---|---|
| 09:00 CT daily | `account-health-agent/` scan | Supabase Edge Function `health-agent/` |
| 06:00 CT daily | `package-renewal-tracking/` expiration alert scan | Supabase Edge Function (renewal-check) |
| 08:00 CT Monday | `engagement-monitoring/` weekly review compile | Supabase Edge Function (weekly-review) |
| 07:00 CT 1st of month | `roster-revenue-share/` monthly statement | Supabase Edge Function (revenue-share-statement) |

---

## Environment variables required

**Supabase Edge Functions read from Vault:**
- `ANTHROPIC_API_KEY` — for all agent-layer generation
- `GHL_API_KEY` + `GHL_LOCATION_ID` — for CRM writeback + workflow triggers
- `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` — for payment processing + webhook verification

**GHL environment:**
- Custom fields matching `infra/ghl/field-mapping.md`
- Webhook URLs pointing to Supabase Edge Function endpoints

---

*Every skill maps to concrete runtime. Every runtime has an env-var + config spec. The operating brain runs when the runtimes run.*
