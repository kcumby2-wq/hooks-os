# Account-Health Agent — Catch Drop-Off Before It Becomes Churn

> **⬢ Operating altitude:** `P` · internal-facing agent · feeds Margin's outreach priorities
> **⬢ Trusted-agent spec (7Q):** shadow-pending
> **⬢ Operational lead:** Kyron (build + calibration) · Margin (outreach on flagged accounts) · agent runs autonomously

**Purpose:** A trending-down client gets a personal outreach before they're gone — not after. This agent watches every active client's engagement signals and surfaces at-risk accounts to Margin's dashboard so the intervention lands while there's still a relationship to save.

**Return:** fewer clients lost quietly. Retention conversations happen while there's momentum to shift, not after the client has already checked out.

**Distinguished from `engagement-monitoring/`:** `engagement-monitoring/` is the content-cadence rhythm (are we posting, are we reaching, are we producing). This is the client-cadence rhythm (is a specific client engaging, attending, renewing).

---

## The four signals watched

| Signal | Green | Yellow | Red |
|---|---|---|---|
| **Session attendance** | ≥ 90% of scheduled | 70-89% | < 70% or 2+ consecutive no-shows |
| **Recap open rate** (rolling 4 sessions) | ≥ 80% | 50-79% | < 50% or last 2 unopened |
| **Response time to Margin/system messages** | < 24h | 24-72h | > 72h or no response last 2 messages |
| **Days since last session** | Within stated cadence | +50% over stated cadence | 2x+ over stated cadence |

**Composite score:** any single Red OR two consecutive Yellows across signals = **flag for outreach**.

---

## What happens when an account flags

**Green:** no action · logged internally.

**Yellow (any single signal):**
- Internal note visible on Kyron's dashboard
- No client-facing action yet · continue monitoring

**Yellow x 2 signals OR Red x 1:**
- **Flag surfaces to Margin** with a one-line context: *"Alex missed last 2 sessions · last recap unopened · last active 18 days ago."*
- Margin's call: personal text, personal call, or delegate outreach
- Flag stays open until Margin marks resolved (in-app tap: "outreached · monitoring")

**Red x 2 signals OR Red x 1 + no response 7 days:**
- Escalates from flag to **priority intervention**
- Kyron drafts personal outreach for Margin's approval within 24h
- If no intervention within 7 days, agent auto-fires a light-touch "everything okay?" check-in (Youth/HS parent only · College-Bound + Alumni stay Margin-only)

---

## The intervention pattern

**When Margin does reach out to a flagged account, the pattern is:**
1. **Personal · not templated.** A voice text, a call, a direct DM.
2. **No pitch.** Not "renew now" · not "we have a new package."
3. **One specific reference.** Something from the recap history — a rep, a moment, a technique — that only Margin would remember.
4. **One open question.** "How's the season going for [athlete]?" · "What's been the biggest thing on your plate?"

The intervention is a relationship touch — not a save motion. The save happens because the relationship is real.

---

## What the agent never does

- **Auto-fires a save-motion message to the client.** All interventions go through Margin (or Kyron with Margin's sign-off).
- **Cries wolf.** Yellow signals are internal-only. Only high-confidence Red patterns escalate to a flag.
- **Flags an Alumni/Pro-Track client on the same thresholds.** Alumni cadence is by nature irregular. Different signals apply (see below).

---

## Segment-tuned thresholds

**Youth/HS:**
- Standard thresholds above
- Parent open rate is the primary retention signal
- Missed sessions = strong Red signal (parents book · parents pay · parents notice)

**College-Bound:**
- Session cadence tuned to season (in-season vs off-season)
- Recruiting-window inactivity (e.g., no film reviewed in 30 days during signing window) = auto-Red
- Recap engagement matters less · athlete direct-messages more

**Alumni/Pro-Track:**
- No automated cadence thresholds
- Signal instead: **months without any contact** · Margin's discretionary review
- Flag reads: "Marvin: 4 months no contact · off-season starts in 3 weeks — text?"
- The alert is a memory jog for Margin, not a machine-driven save motion

---

## Dashboard view

**Kyron's control view:**
- All active clients · one row each
- Color-coded (Green · Yellow · Red)
- Sortable by last-signal-change · by segment · by days-in-yellow-or-red
- Click into row: signal history · recap open rates · session history · last message received
- One-tap: "flag for Margin" · "mark resolved" · "escalate"

**Margin's control view:**
- ONLY the flags · not the full roster
- Ordered by priority
- Includes the one-line context and Kyron's draft outreach if applicable
- Tap: "sent" · "spoke to them" · "need to follow up later"

---

## Anti-patterns

- Sending an auto-generated "we miss you" message to a client the agent thinks is disengaging (breaks trust · reads robotic)
- Same thresholds across Youth/HS + College-Bound + Alumni (misfires on all three)
- Flagging Alumni on session-attendance metrics (their cadence is different by nature)
- Yellow-noise fatigue for Margin (only Red-tier patterns surface · Yellow is Kyron's context)
- Flagging without a one-line human-readable context (Margin doesn't want to read the whole signal history to decide)

---

## Success signal

- ≥ 60% of flagged accounts recover to Green within 30 days of Margin's intervention
- Zero auto-messages fired to flagged accounts without human approval
- Margin's dashboard shows < 10 open flags at any time (system is a signal, not a firehose)
- Churn-rate delta measurable pre- and post-launch (target: 30-50% churn reduction on Youth/HS + College-Bound)

---

## Cross-skill integration

- **`post-session-recap-agent/`** — recap open/attendance data feeds the signals
- **`package-renewal-tracking/`** — flagged accounts get renewal-message priority attention
- **`session-booking-no-show/`** — no-shows are one of the primary Red signals
- **`engagement-monitoring/`** — sibling skill · content-side rhythm vs client-side rhythm
- **`parent-comms/`** — outreach voice for Youth/HS parent-facing interventions
- **`margin-voice/`** — voice register for direct-to-athlete interventions
- **`client-segmentation/`** — determines which threshold set applies

---

*A client who leaves quietly did not decide to leave. They drifted. This agent is the safety net that catches the drift while there's still a hand to catch it with.*
