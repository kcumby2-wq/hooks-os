# Client Segmentation — Three Distinct Motions

> **⬢ Operating altitude:** `P` · foundational segmentation frame every other skill routes against
> **⬢ Trusted-agent spec (7Q):** shadow-pending · calibrated against Margin's actual client roster during August walkthrough
> **⬢ Operational lead:** Margin (sets calibration) · Kyron (enforces routing) · every automation and comms flow reads from this frame

**Purpose:** Every inbound lead, every message, every automation, every content beat routes off one of three client segments. Treating all three the same underperforms for all three. This is the segmentation contract every other skill honors.

**Why this is the first skill loaded:** it is context the whole operating brain consults before drafting a single line of copy or firing a single automation.

---

## The three segments

### Segment A · Youth / HS
- **Who they are:** middle school and high school WRs building fundamentals and recruiting film
- **Primary buyer:** parent, with athlete input
- **What drives the decision:** visible skill gains · safety · coachability
- **Decision cycle:** relatively fast (weeks) once trust is established
- **Comms register:** parent-first · educational · results-forward · never over-hype the child

### Segment B · College-Bound
- **Who they are:** juniors/seniors chasing offers · transfer-portal WRs refining a specific weakness
- **Primary buyer:** athlete · parent co-signs
- **What drives the decision:** recruiting-ready film + a measurable, specific edge
- **Decision cycle:** timed to the recruiting calendar (offer window · portal window · signing period)
- **Comms register:** athlete-first · direct · technically specific · outcome-tied to recruiting result

### Segment C · Alumni / Pro-Track
- **Who they are:** former clients now at college/NFL level maintaining the relationship
- **Primary buyer:** athlete (or agent)
- **What drives the decision:** trust built over years — not a new sales pitch
- **Decision cycle:** off-season maintenance + skill refinement · not transactional
- **Comms register:** peer-to-peer · low volume · direct-to-Margin

---

## Routing rules

**Every inbound lead gets tagged at first touch:**
- Website intake form: explicit segment picker (Youth · HS · College-Bound · Alumni)
- Instagram DM: sales-qualification agent classifies from the message + profile
- X comment / reply: classified from context or defers to `sales-qualification-agent/`
- Referral / roster: pre-tagged at intake as "roster-referral" (feeds `roster-revenue-share/`)

**Once tagged, the segment tag drives everything downstream:**
- Which nurture track (`lead-capture-automation/`)
- Which onboarding sequence (`onboarding-sequence/`)
- Which review/referral trigger (`athlete-referral-program/`)
- Which content spotlight the athlete is eligible for (`release-room-friday/`)
- Which lifecycle messages fire (`parent-comms/` for Youth/HS parents · direct-to-athlete for College-Bound · direct-to-Margin for Alumni)
- Which advocacy cadence applies (`cbh-advocacy/` weighted heavier for College-Bound + Alumni)

**Segment tags never merge downstream.** A parent nurture email never lands in an Alumni's inbox. A cold-outreach cadence never fires on a Roster-referral lead.

---

## Anti-patterns

- Single generic "new-lead" nurture sequence that treats all three the same — **fails all three simultaneously**
- Sending Youth/HS content (drill packs, parent education) to a signed NFL alum
- Sending peer-to-peer Margin-direct language to a first-time parent inquiry
- Assuming an Alumni referral wants a formal sales flow — they want a text from Margin

---

## Success signal

- 100% of inbound leads tagged at first touch (auto or human review within 24h)
- 0 messages fire cross-segment (audited monthly)
- Segment-level renewal + conversion tracked separately in the pipeline

---

## Cross-skill integration

- **`lead-capture-automation/`** — reads segment tag to route the intake into correct nurture
- **`sales-qualification-agent/`** — classifies the segment before booking a consult
- **`onboarding-sequence/`** — different message set per segment
- **`parent-comms/`** — Youth/HS parent-facing flow only
- **`athlete-referral-program/`** — weighting favors Alumni network
- **`roster-revenue-share/`** — every roster-referral gets a distinct tag
- **`release-room-friday/`** — spotlight rotation respects segment mix
- **`margin-voice/`** — register shifts per audience (parent · athlete · peer)

---

*The segmentation is the frame. Everything else is a specific play run through the frame.*
