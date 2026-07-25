# Lead-to-Client Automation Flow

**Source:** codified from the Sky's The Limit WR Growth Plan · adopted into hooks-os operating brain 2026-07-25
**Owner:** Kyron (build + orchestration) · runs autonomously post-launch
**Runs on:** CRM + payment integration + agent stack

Every automation and agent skill under `skills/` connected as one flow. This is the visualization every lead follows from first form fill to renewed client. If a step below doesn't reference a specific skill file, that's a gap — the operating brain should be able to point at a skill for every step.

---

## The 8-step flow

### 1 · Lead Nurture
**Trigger:** form submission · no consult booked

Someone submits their info on the website or an ad landing page but hasn't booked a consult yet.

- Handled by: `lead-capture-automation/` + `client-segmentation/`
- Segment tag set at intake · routes into segment-specific nurture
- Long-run nurture timed to recruiting calendar (light in-season · active off-season / spring evals / summer)

---

### 2 · Session Reminders & Notifications
**Trigger:** consult booked

Any lead who books a consult, from the nurture sequence or a direct booking, triggers the reminder + confirmation sequence ahead of it.

- Handled by: `session-booking-no-show/`
- Cadence: T-48h · T-24h · T-2h reminders
- Confirmation with join link + what-to-bring

---

### 2a · No-Show Reminders (branch)
**Trigger:** appointment marked no-show

If they don't show for the consult, this triggers the no-show recovery sequence to get them rebooked.

- Handled by: `session-booking-no-show/` (no-show recovery block)
- Cadence: T+30min · T+24h · T+72h · T+7d
- Never guilt-trip · never fee-add on first no-show

---

### 3 · Post-Consult Branching
**Trigger:** appointment attended

Three-way branch based on outcome:
1. **Signed package** → tagged `Client` · advances to step 4
2. **Attended but undecided** → "still deciding" nurture (light-touch 3-touch across 21 days · season-timed)
3. **Attended and no fit** → tagged closed-out · route to long-run nurture

- Handled by: `session-booking-no-show/` post-consult branch logic
- Outcome tagged by Margin OR `sales-qualification-agent/` at consult end

---

### 4 · Client Lifecycle Move
**Trigger:** Client tag added

The Client tag moves the record into the Client Lifecycle pipeline and marks the deal Won.

- Handled by: `lead-capture-automation/` handshake to `onboarding-sequence/`
- CRM pipeline stage updated · dashboards refresh

---

### 5 · Onboarding Sequence
**Trigger:** moved to Client Lifecycle pipeline

Entering the Client Lifecycle pipeline triggers the onboarding message sequence.

- Handled by: `onboarding-sequence/`
- Four milestones: Welcome (T+0) · Intake (T+24h) · First session scheduled (T+72h) · First recap sent
- Per-segment parallel tracks (Youth/HS parent · College-Bound athlete · Alumni skip auto-sequence)
- Handshake to `post-session-recap-agent/` at first-session-completed

---

### 6 · Active Client Sequence
**Trigger:** onboarding sequence completed

Once onboarding is complete, the ongoing sequence takes over: session recaps · check-ins · review/referral asks · running the length of the package or season.

- Handled by:
  - `post-session-recap-agent/` — recap after every session
  - `account-health-agent/` — watches signals · flags drop-off risk
  - `athlete-referral-program/` — fires at real trigger moments (win · offer · signing day)
  - `engagement-monitoring/` — content + touchpoint cadence
- Voice register per `margin-voice/` + `outcomes-based-communication/` on every generated message

---

### 7 · Package Renewal
**Trigger:** renewal point within 30 days

As a renewal point approaches, this fires the 30/14/7-day renewal reminder cadence automatically.

- Handled by: `package-renewal-tracking/`
- Client-facing reminders at T-30d · T-14d · T-7d
- Internal alerts to Kyron + Margin at same cadence
- Voice per segment · outcome-forward (never "your package expires")

---

### 7a · Missed Payment (branch)
**Trigger:** payment failed or missed

If the payment fails or is missed, this triggers the recovery sequence instead of Margin having to notice and follow up himself.

- Handled by: `package-renewal-tracking/` (missed-payment recovery block)
- Cadence: T+1h · T+24h · T+72h (escalates to Kyron) · T+7d (escalates to Margin)
- Never fee-added · never punitive

---

### 8 · Churned Client Sequence (branch)
**Trigger:** non-renewal confirmed

If the renewal isn't recovered, this fires a dedicated win-back sequence distinct from the general re-engagement flow — because it targets a lapsed account, not a cold lead.

- Handled by: `package-renewal-tracking/` (churned-client win-back block)
- Cadence: T+7d · T+30d · T+60d · T+90d
- Voice: never desperate · treats the relationship as adult · leaves the door open without leaning on it
- Alumni skip this flow (Margin's personal call · not automation)

---

## The full flow · visualized

```
[form submission]
      ↓
[LEAD NURTURE] ── segment tag ──► [nurture per segment]
      ↓
[consult booked]
      ↓
[SESSION REMINDERS] ────── [NO-SHOW RECOVERY]
      ↓
[appointment attended]
      ↓
      ├── signed package ──► [CLIENT LIFECYCLE MOVE]
      │                          ↓
      │                    [ONBOARDING SEQUENCE]
      │                          ↓
      │                    [ACTIVE CLIENT]
      │                    · recaps
      │                    · account-health monitoring
      │                    · referral triggers
      │                          ↓
      │                    [renewal window ─30d]
      │                          ↓
      │                    [RENEWAL REMINDERS] ────── [MISSED PAYMENT RECOVERY]
      │                          ↓                             ↓
      │                    ┌─────┴─────┐             [CHURNED CLIENT WIN-BACK]
      │                    ↓           ↓                       ↓
      │              [renewed]    [churned]              [long-run re-engagement]
      │
      ├── still deciding ──► [3-touch nurture · season-timed]
      │
      └── no fit ──► [long-run nurture / closed]
```

---

## Data + tracking

**Every step writes back to the CRM:**
- Stage transitions timestamped
- Message opens · clicks · replies captured
- Recap delivery + open rate logged per client
- Renewal window status visible per client
- Missed-payment queue visible in one place
- Segment-level metrics tracked separately (Youth/HS · College-Bound · Alumni)

**Dashboards:**
- Kyron: full pipeline + all flagged accounts (`account-health-agent/`) + missed-payment queue + revenue-share statement (`roster-revenue-share/`)
- Margin: priority interventions only + weekly renewal-window preview + monthly revenue-share summary

---

## Related skills · direct references

- `client-segmentation/` — the frame every step reads against
- `lead-capture-automation/` — step 1
- `session-booking-no-show/` — steps 2 · 2a · 3
- `sales-qualification-agent/` — social/DM inbounds routing into step 1
- `onboarding-sequence/` — step 5
- `post-session-recap-agent/` — step 6 primary
- `account-health-agent/` — step 6 monitoring
- `athlete-referral-program/` — step 6 growth motion
- `engagement-monitoring/` — step 6 content-side rhythm
- `package-renewal-tracking/` — steps 7 · 7a · 8
- `outcomes-based-communication/` — voice guardrail every generated message honors
- `margin-voice/` — voice register every generated message honors
- `parent-comms/` — Youth/HS parent-facing register
- `roster-revenue-share/` — commercial layer running underneath the flow

---

*The flow is not a diagram to admire. It is the operating brain's roadmap. Every step has a specific skill file. Every trigger fires the next step. Nothing depends on Margin remembering.*
