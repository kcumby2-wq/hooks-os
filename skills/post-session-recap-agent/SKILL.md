# Post-Session Recap Agent — The Highest-Leverage Retention Lever

> **⬢ Operating altitude:** `P → E` · agent-driven automation with retention as the essence
> **⬢ Trusted-agent spec (7Q):** shadow-pending · calibrated against Margin's first 20 recap drafts
> **⬢ Operational lead:** Kyron (prompt engineering + build) · Margin (voice approval on template + spot-check reviews) · agent runs autonomously post-calibration

**Purpose:** After every training session, an auto-generated recap goes to the athlete AND the parent within 4-6 hours. The recap captures what was worked on, what the athlete did well, what to focus on before next session, and — implicitly — that Coach is paying attention. This is the single highest-leverage change in the plan for retention.

**Return per Growth Plan:** *"A parent who sees documented progress every week is a far easier renewal than one asked to take it on faith."*

**Why this deserves its own skill (not folded into `parent-comms/` or `engagement-monitoring/`):** the recap is where the training relationship is *proven* to the parent, session by session. Everything else in the operating brain either supports this moment or extends what it created.

---

## Input · however session notes come in

Session notes may come in from three formats:
1. **Voice memo** from Margin post-session (transcribed via existing pipeline)
2. **Written shorthand** in a shared doc or CRM note field
3. **Film reference** — Margin logs a clip timestamp + one-line context

**The agent normalizes all three inputs into the same recap output pipeline.** A recap is never delayed because the note format was different.

---

## Output · what the recap contains

**Structured template (four sections · always in this order):**

1. **Today's focus** — one or two sentences · what technique or concept was worked on
2. **What [athlete] did well** — specific · references a real rep or moment · never generic
3. **What to work on before next session** — one specific thing · not a list · actionable at home or field
4. **Coach's note** — one line · direct from Margin's voice · optional but powerful

**Voice register per `margin-voice/`:**
- Direct · specific · never generic
- Honest-before-encouraging (per Margin's voice discipline)
- No hype vocabulary · no exclamation stacks
- No promises about outcomes

**Length:** short. 100-180 words total. This is not a report — it's a conversation.

---

## Delivery · the family, not just the booker

**Recap ships to:**
- The athlete (SMS + email preferred)
- The parent (SMS + email · per intake preference)
- **Never just to whoever booked the appointment** — this is the change that turns training into a family experience rather than a one-person memory

**Timing:** 4-6 hours post-session. Same day. Not the next morning. Momentum matters.

**Per `client-segmentation/`:**
- **Youth/HS:** parent-first framing · one line addressed to parent · rest to athlete
- **College-Bound:** athlete-first · parent CC'd if intake requested it · technical detail higher
- **Alumni/Pro-Track:** no automated recap · Margin texts personally (or not at all — peer-to-peer default)

---

## The agent's calibration protocol

**First 20 recaps (August walkthrough):**
- Agent drafts each recap
- Margin reviews EVERY one before send
- Feedback loop into agent prompt · verbatim voice corrections logged to `feedback/feedback-log.md`

**Recap 20-100:**
- Agent drafts · Kyron spot-reviews (10-20% sample)
- Margin reviews only flagged ones
- Zero-correction streak of 5 unlocks full auto-send

**Recap 100+:**
- Full auto-send with weekly voice audit
- Any voice-drift flag pauses auto-send and reverts to review-required

---

## Anti-patterns

- Generic template output ("Great session today! Keep up the hard work!") — this is the voice-drift Margin exists to prevent
- Recap arrives 24h+ post-session (loses momentum · feels like admin, not coaching)
- Recap goes only to booker (misses the retention lever · parent renews on documented progress)
- Long-form reports (this is a conversation, not a report card)
- Recap that never references a specific rep or moment (proves the coach wasn't paying attention)
- Auto-send during calibration phase (destroys the calibration signal)

---

## Success signal

- 100% of sessions produce a recap within 6 hours
- Recap open rate ≥ 85% (parents + athletes combined)
- Recap-tied renewal rate ≥ 90% (versus baseline before this skill existed)
- Zero voice-drift corrections logged in the 4 weeks preceding auto-send unlock
- Weekly `feedback/feedback-log.md` review shows recap-related corrections trending to zero

---

## Cross-skill integration

- **`onboarding-sequence/`** — first recap after first session · the retention arc starts here
- **`margin-voice/`** — voice guardrail every recap is evaluated against
- **`parent-comms/`** — parent-facing register for Youth/HS recaps
- **`client-segmentation/`** — determines send list + voice register
- **`account-health-agent/`** — reads recap-send cadence to detect drop-off (e.g., 2+ weeks without a session = flag)
- **`package-renewal-tracking/`** — recap history feeds the "here's what this block produced" content in renewal messages
- **`engagement-monitoring/`** — recap-open rate is one of the primary engagement signals tracked

---

*The recap is the difference between renewed and re-sold. Every session gets one. Every family gets to see the work.*
