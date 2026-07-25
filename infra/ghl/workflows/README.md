# GHL Workflow Specs

**Purpose:** the workflows Kyron builds in GHL's UI. Specs live in this repo · builds live in GHL. When a workflow spec changes here, the corresponding GHL build must be updated in the same session.

**Convention:** every workflow name is prefixed `hooks-` in GHL so they cluster.

---

## Workflow index

| # | Workflow name (GHL) | Trigger | Purpose | Skill |
|---|---|---|---|---|
| 01 | `hooks-inbound-triage` | Any inbound message | Fires qual-agent webhook · agent classifies + drafts reply | `sales-qualification-agent/` |
| 02 | `hooks-consult-confirm-cadence` | Appointment booked on `hooks-consult-15min` | 24h + 2h reminder cadence | `session-booking-no-show/` |
| 03 | `hooks-consult-noshow-recovery` | Consult marked no-show | 15min + next-day + 3-day recovery touches | `session-booking-no-show/` |
| 04 | `hooks-onboarding-youth-hs` | Package signed AND segment=youth_hs | 7-day onboarding sequence · parent-first | `onboarding-sequence/` |
| 05 | `hooks-onboarding-college-bound` | Package signed AND segment=college_bound | 7-day onboarding · athlete + parent | `onboarding-sequence/` |
| 06 | `hooks-onboarding-alumni-pro` | Package signed AND segment=alumni_pro | 7-day onboarding · athlete direct | `onboarding-sequence/` |
| 07 | `hooks-session-reminder` | Training session scheduled | 48h + 24h + 2h reminders | `session-booking-no-show/` |
| 08 | `hooks-session-noshow-recovery` | Session marked no-show | Same-day + 24h + 72h recovery | `session-booking-no-show/` |
| 09 | `hooks-post-session-note-prompt` | Session marked completed | Ping Margin to submit session note within 2h | `post-session-recap-agent/` (upstream) |
| 10 | `hooks-recap-delivery` | `recaps.status = 'ready_to_send'` | Deliver recap · email + SMS per segment | `post-session-recap-agent/` |
| 11 | `hooks-renewal-30d` | Package expires_at in 30 days | Renewal touch #1 · outcome-framed | `package-renewal-tracking/` |
| 12 | `hooks-renewal-14d` | Package expires_at in 14 days | Renewal touch #2 · social proof + CTA | `package-renewal-tracking/` |
| 13 | `hooks-renewal-7d` | Package expires_at in 7 days | Renewal touch #3 · direct ask · Margin voice | `package-renewal-tracking/` |
| 14 | `hooks-payment-failed-recovery` | Stripe payment_failed event | 3-touch recovery + card update link | `package-renewal-tracking/` |
| 15 | `hooks-health-intervention-agent` | `hooks:health:yellow` tag added | Send agent-drafted soft touch | `account-health-agent/` |
| 16 | `hooks-health-intervention-coach` | `hooks:health:orange` tag added | Route to coach draft queue in GHL inbox | `account-health-agent/` |
| 17 | `hooks-health-intervention-margin` | `hooks:health:red` tag added | Alert Margin via SMS · queue in Margin's action list | `account-health-agent/` |
| 18 | `hooks-referral-thankyou` | Referral converts (`referrals.status = 'converted'`) | Thank the referring client + trigger reward fulfillment | `athlete-referral-program/` |
| 19 | `hooks-release-room-friday-publish` | Content brief marked scheduled for a Friday | Cross-platform publish sequence (IG · TikTok · email) | `release-room-friday/` + `subject-media-coordination/` |
| 20 | `hooks-follower-welcome` | New IG/FB follower (via GHL webhook) | Manual-review-first light touch · never instant | `cold-outreach/` |

---

## Per-workflow spec

Each workflow gets its own file in this directory: `01-hooks-inbound-triage.md`, `02-hooks-consult-confirm-cadence.md`, etc. Each spec includes:

1. **Trigger** — exact GHL trigger config
2. **Filters** — GHL "if/then" conditions
3. **Steps** — every action in order (wait · webhook · send message · tag · etc.)
4. **Message copy** — the actual text of every SMS/email in the flow (parameterized with `{{ contact.hooks_athlete_first_name }}` style tokens)
5. **Exit conditions** — what removes a contact from the workflow
6. **Success signal** — what "working" looks like

---

## Import/export format

GHL workflows can be exported as JSON snapshots. When a workflow is built or updated, export it via GHL UI → save as `workflows/<##>-<name>.json` in this directory. That way the actual configuration is versioned alongside the spec.

**Do not check in workflow JSON that contains:**
- Actual phone numbers or email addresses in message previews (redact to `{{ redacted }}`)
- API keys of any kind (GHL, Anthropic, Stripe, Slack)
- Location IDs (if considered sensitive · Kyron's call)

---

## Build sequence (matches STL-Growth-Plan-Adoption.md phases)

**Phase 01 · Foundation (pre-August):**
- 01, 02, 03 (inbound triage · consult confirm/noshow)
- 04, 05, 06 (onboarding × 3 segments)
- 07, 08, 09, 10 (session lifecycle → recap)
- 11, 12, 13, 14 (renewal cadence + payment recovery)

**Phase 02 · Intelligence (Aug-Oct):**
- 15, 16, 17 (health-agent interventions × 3 severities)

**Phase 03 · Social + content (Oct-Dec):**
- 18 (referral thank-you loop)
- 19 (Release Room Friday publish)
- 20 (follower welcome · once volume warrants)

---

*Specs are the source of truth for the design. GHL is the source of truth for the running build. Both must move together.*
