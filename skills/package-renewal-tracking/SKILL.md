# Package Renewal Tracking — 30/14/7 + Missed-Payment Recovery

> **⬢ Operating altitude:** `T → P` · billing-adjacent automation layer on top of the CRM
> **⬢ Trusted-agent spec (7Q):** shadow-pending · Will builds the payment integration same pattern as Modern Football
> **⬢ Operational lead:** Will (payment processor + CRM integration) · Kyron (renewal-reminder copy) · Margin (churned-client sequence approval)

**Purpose:** A package renewal that falls through the cracks is not a client choosing to leave — it's friction. This skill removes the friction. Every renewal window gets tracked. Every missed payment gets recovered. Every churned client gets one focused win-back.

**Return:** recovered revenue that Margin doesn't have to notice, chase, or invoice manually. Packages stop lapsing because a date fell through the cracks.

---

## Package & session-block expiration tracking

**Internal-facing alert layer:**
- Every active package has a computed expiration date OR remaining-session count
- Internal alert to Kyron + Margin fires at 30 days out
- Second alert fires at 14 days · third at 7 days
- Dashboard view shows every client in the renewal window · sorted by urgency
- Aging report flags any renewal past due with no action taken

**These alerts are internal.** Client-facing renewal reminders are separate (below).

---

## Client-facing renewal reminders · 30/14/7 cadence

**Cadence:**
- **T-30 days:** "Package coming up · here's how to keep training uninterrupted" · outcome-forward · one CTA
- **T-14 days:** reminder + specific plan for next block · references what was worked on this cycle
- **T-7 days:** final reminder + easy renewal link · offers to speak with Margin if any hesitation

**Voice register:** per `client-segmentation/`, three parallel tracks:
- **Youth/HS parent:** clear, no-pressure, references measurable progress from `post-session-recap-agent/` log
- **College-Bound athlete:** direct, technical, references recruiting delta
- **Alumni/Pro-Track:** never sent — Margin texts them personally · this skill fires an internal notification only

**Anti-pattern:** every renewal message a version of "your package expires soon." That reads as a bill, not a conversation. Every message ties renewal to a specific outcome from the current block.

---

## Payment confirmation

**Successful renewal charge → auto-fires:**
- Immediate confirmation SMS + email
- Receipt with next block start date and session count
- Handshake back to `onboarding-sequence/` if this is a first-time signup, or to `account-health-agent/` "reset counter" for existing clients

---

## Missed-payment recovery

**Failed or late payment → auto-fires:**
- **T+1h:** short "card didn't go through · quick fix here" (link to update payment method)
- **T+24h:** follow-up if not resolved · friendly · no fees mentioned
- **T+72h:** escalates to Kyron for personal outreach
- **T+7d:** if still unresolved · escalates to Margin

**Never fires:**
- Automated fee-adding language
- Suspension-of-service threats
- Anything that reads punitive

**Always:**
- Assumes technical friction · not intent to leave
- Makes the fix one tap

---

## Churned client sequence

**When a client confirms non-renewal (explicit "no" OR 30 days past expiration with no re-engagement):**

**Fires a dedicated win-back distinct from cold-lead re-engagement:**
- **T+7d:** short check-in from Margin (personal-feel · not marketing-copy)
- **T+30d:** "here's what your athlete could work on this off-season" · one specific technical thread
- **T+60d:** "we're opening a new cohort · thought of you" (if timing lines up)
- **T+90d:** one final light-touch · then closes out of active pipeline

**Voice:** never desperate · never "we miss you" · treats the relationship as adult · leaves the door open without leaning on it.

---

## What this integrates with

- **Payment processor:** Stripe (or equivalent · Will's call) tied directly into CRM · Modern Football pattern
- **CRM pipeline:** renewal-window status visible per client · missed-payment queue visible in one place
- **Automated reports:** `post-session-recap-agent/` log feeds the "here's what we worked on this cycle" content in the renewal message

---

## Anti-patterns

- Manually tracking renewals in a spreadsheet Margin checks weekly
- Same renewal message copy at 30 / 14 / 7 days
- Fee-added or service-suspended messaging on missed payments
- Cold-lead re-engagement sequence firing on a churned client (they need a different sequence)
- Alumni getting an automated renewal reminder (they get Margin's text · never a robot)

---

## Success signal

- ≥ 85% renewal rate on active clients past first block
- ≥ 60% missed-payment recovery within 7 days
- 0 automated renewal reminders sent to Alumni/Pro-Track
- Churned-client win-back conversion tracked separately from cold-lead conversion

---

## Cross-skill integration

- **`onboarding-sequence/`** — payment confirmation handshake when first package signs
- **`post-session-recap-agent/`** — log feeds the "here's what this block produced" content in renewal reminders
- **`account-health-agent/`** — early drop-off signal reaches Margin before the 30-day renewal window opens
- **`parent-comms/`** — voice register for Youth/HS parent-facing renewal messages
- **`client-segmentation/`** — determines which parallel track fires
- **`margin-voice/`** — voice register for direct-to-athlete renewal messages
- **`athlete-referral-program/`** — churned-client sequence can offer a "come back through a friend" pathway

---

*Renewals are not new revenue Margin has to go find. They are revenue that already exists — and either gets kept or gets dropped based on whether the system caught the window in time.*
