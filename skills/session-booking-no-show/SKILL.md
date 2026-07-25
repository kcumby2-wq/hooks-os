# Session Booking & No-Show Recovery

> **⬢ Operating altitude:** `T` · direct CRM automation
> **⬢ Trusted-agent spec (7Q):** shadow-pending
> **⬢ Operational lead:** Kyron (build) · runs autonomously post-launch

**Purpose:** A booked session that doesn't happen shouldn't quietly fall out of the pipeline. Reminders keep bookings alive. Recovery sequences bring no-shows back.

**Return:** consults that would otherwise ghost get recovered. Direct billable revenue that's currently leaking.

---

## Confirmation & reminder cadence

**Consult booked → auto-fires:**
- **Immediately:** confirmation message (SMS + email) with date, time, Zoom or in-person location, what to bring
- **T-48h:** first reminder (SMS)
- **T-24h:** second reminder + "reply Y to confirm" prompt
- **T-2h:** final reminder with join link
- **T-0:** session starts

**Training session booked (recurring client) → auto-fires:**
- Same cadence but shorter · T-24h + T-2h only
- Adjusts for the athlete's stated preference (some parents prefer text · some prefer email · captured in `parent-comms/` intake)

---

## No-show recovery sequence

**Session marked "no-show" in CRM → auto-fires:**
- **T+30min:** short "did we miss you?" text · warm, non-judgmental
- **T+24h:** email with rebooking link and one-line context ("understand life happens · here's how to grab a new slot")
- **T+72h:** follow-up if no rebook · escalates to Margin OR Kyron for personal touch
- **T+7d:** final soft prompt · then closes out of active pipeline into long-run re-engagement

**Never:** guilt-trip · charge fees on first no-show · imply the athlete lost priority

**Always:** assume a real reason · make rebooking one tap

---

## Post-consult branching

**Consult attended → three-way branch based on outcome:**
1. **Signed package:** trigger `onboarding-sequence/`
2. **Attended but undecided:** trigger "still deciding" nurture (light-touch · 3-touch across 21 days · timed off the season)
3. **Attended and no fit:** tag closed-out · route to long-run nurture for future re-engagement

The branch is set by Margin (or the sales-qualification-agent) tagging the outcome in the CRM immediately post-consult.

---

## Anti-patterns

- One universal "you missed us" message with no rebook link
- Auto-charging or penalizing for a first no-show (kills goodwill)
- Sending recovery messages to Alumni/Pro-Track (they get a text from Margin directly)
- Reminders that don't include the actual join link or address (adds friction the athlete has to solve)

---

## Success signal

- ≥ 95% consult attendance rate after full reminder cadence lives
- ≥ 40% of no-shows rebook within 7 days
- Zero recovery messages sent to Alumni (per segment gating)

---

## Cross-skill integration

- **`lead-capture-automation/`** — hands off booked leads into this skill
- **`onboarding-sequence/`** — takes over when a consult results in signed package
- **`client-segmentation/`** — determines message register + which segments skip auto-recovery
- **`sales-qualification-agent/`** — books the initial consult that this sequence protects
- **`parent-comms/`** — the register for parent-facing reminders (Youth/HS)

---

*Booked doesn't equal attended. Attended doesn't equal client. Every step in between needs a safety net.*
