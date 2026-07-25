# Onboarding Sequence — Welcome → First Session Milestone

> **⬢ Operating altitude:** `P` · structured client-onboarding path · runs from signed package through first session completed
> **⬢ Trusted-agent spec (7Q):** shadow-pending
> **⬢ Operational lead:** Kyron (build + prompt engineering) · Margin (voice calibration) · agent runs autonomously post-launch

**Purpose:** A new client's first two weeks with Sky's The Limit sets the tone for the whole relationship. The onboarding sequence takes them from "just signed" → "completed intake" → "first session done" → "first recap received" — with no friction and no dropped balls.

**Return:** higher completion rate on first sessions · higher renewal rate at end of first package · a first impression that reflects the training standard, not amateur admin.

---

## The four milestones

### 1 · Welcome (T+0 from signup)
- Immediate confirmation of package purchase (auto-fires from `package-renewal-tracking/` payment webhook)
- Personal-feel welcome message from Margin (drafted by agent · Margin approves once at setup · reused)
- Clear next-step: "Complete intake by [date] · we'll schedule your first session within 48h"

### 2 · Intake (T+0 → T+24h)
- Intake form link (short · not overwhelming)
- Fields: athlete goals · current level · injury history · film links · parent contact confirmation
- If athlete is minor: parent consent form + communication preferences (Youth/HS routes through `parent-comms/`)
- Onboarding assistant agent (see `sales-qualification-agent/` sibling pattern) walks them through conversationally rather than pointing at a static form nobody finishes

### 3 · First session scheduled (T+24h → T+72h)
- Calendar link sent post-intake completion
- Reminders per `session-booking-no-show/` cadence
- Confirmation email includes: what to bring · what to expect · what happens after

### 4 · First session completed → first recap sent (T+session-end + 4h)
- Triggers `post-session-recap-agent/` — the first recap sets the retention arc
- Additional touch: welcome-to-the-roster acknowledgment (personal from Margin · voice-approved)
- Marks client as "active" in pipeline

---

## What the sequence sounds like (voice register)

**Per `client-segmentation/`, three parallel tracks:**

**Youth/HS parent onboarding:**
- Warmth + clarity · educational
- "Here's what to expect from the first session"
- "Here's how we'll communicate with you week to week"
- "Here's what a 'good rep' looks like at your son's level"
- Voice register per `parent-comms/`

**College-Bound athlete onboarding:**
- Direct · technical · outcome-forward
- "Here's the plan for your first four weeks"
- "Here's how we'll track your recruiting delta"
- Voice register per `margin-voice/`

**Alumni/Pro-Track:**
- No formal sequence — a text from Margin · maybe a Slack message · brief and peer-to-peer
- Onboarding "sequence" is one message and a scheduled first session

---

## The recap moment is the retention lever

**Do not underweight the first recap.** Per the Growth Plan return table, the automated post-session recap is the **single highest-leverage change** for retention. The onboarding sequence exists to earn the moment where the first recap lands well.

If the first recap doesn't arrive within 4-6 hours of the first session ending, the whole onboarding sequence loses its punch. This is why `post-session-recap-agent/` is its own dedicated skill and this sequence handshakes to it precisely at "first-session-completed."

---

## Anti-patterns

- Static intake form emailed and hoped for (most families never finish)
- Waiting > 48h to schedule the first session after signup
- First recap arrives more than 24h after session (feels slow · breaks the momentum)
- Same onboarding message set for a middle-school parent and a College-Bound athlete
- Sending Alumni through a scripted welcome sequence (feels transactional in a relationship that isn't)

---

## Success signal

- ≥ 95% intake completion within 48h of signup
- ≥ 90% first-session scheduled within 72h of signup
- 100% of first sessions produce a recap within 6h
- 0 Alumni/Pro-Track routed through auto-sequence (all manual)

---

## Cross-skill integration

- **`client-segmentation/`** — determines which parallel track runs
- **`parent-comms/`** — voice register for Youth/HS parent-facing messages
- **`margin-voice/`** — voice register for athlete-facing messages
- **`session-booking-no-show/`** — schedules and protects the first session
- **`post-session-recap-agent/`** — takes over at first-session-completed milestone
- **`package-renewal-tracking/`** — payment webhook triggers the welcome message
- **`account-health-agent/`** — starts monitoring engagement from first-session-completed onward

---

*The onboarding sequence is the first two weeks. Get those right and retention gets the tailwind. Get them wrong and every downstream skill has to swim uphill.*
