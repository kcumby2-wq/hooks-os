# STL Growth Plan · Adoption Map

**Source document:** external CRM/Automation growth plan received for Sky's The Limit WR (Margin Hooks)
**Adopted into hooks-os:** 2026-07-25
**Contract owner:** TOJ (Trail of Joy Player Management Group, LLC)

**Note on origin:** the source plan named a third-party operator for the roster revenue share (10%). Per operating direction, **that arrangement is now TOJ's.** All partnership terms, tracking, and revenue-share calculations feed TOJ commercial layer via `skills/roster-revenue-share/`. The plan is treated as strategic input to strengthen hooks-os · authorship is not what matters · execution is.

This document maps every recommendation in the source plan to a specific hooks-os artifact, so nothing gets lost between the plan sitting on a shelf and the operating brain actually running it.

---

## 1 · What was already in hooks-os

| Growth Plan concept | Existing hooks-os skill / doc |
|---|---|
| Segmented outreach voice | `skills/margin-voice/` + `skills/parent-comms/` (needed segmentation frame — added in `client-segmentation/`) |
| Coach-to-college advocacy | `skills/cbh-advocacy/` |
| Cohort structure | `skills/cohort-design/` |
| Events + clinics | `skills/event-campaign-design/` |
| Content production coordination | `skills/subject-media-coordination/` |
| Content-cadence rhythm | `skills/engagement-monitoring/` (adjacent to `account-health-agent/` · they are siblings, not overlaps) |
| Free content gate model | `skills/gated-content-platform/` |
| Athlete brand-side workflow | `skills/athlete-brand-pipeline/` |
| Evaluation transcript workflow | `skills/prospect-edge-workflow/` |
| B2B trainer productization | `skills/trainer-blueprint/` |
| Cold outreach discipline | `skills/cold-outreach/` |
| Margin persona reference | `skills/role-model/` |

**Everything above already existed.** The plan validated the strategic direction. What it added was tactical operational depth.

---

## 2 · What the plan added · new skills shipped 2026-07-25

**12 new skills · one workflow · one adoption doc:**

### CRM foundation (5 skills)
| Skill | Purpose |
|---|---|
| `skills/client-segmentation/` | The three-segment frame (Youth/HS · College-Bound · Alumni) that every other skill reads against |
| `skills/lead-capture-automation/` | Every inbound tagged + routed automatically · ad-specific landing pages · form-first-then-calendar pattern |
| `skills/session-booking-no-show/` | Confirmation cadence + no-show recovery + post-consult 3-way branch |
| `skills/onboarding-sequence/` | Welcome → intake → first session → first recap · per-segment parallel tracks |
| `skills/package-renewal-tracking/` | 30/14/7 reminder cadence + missed-payment recovery + churned-client win-back |

### Agent layer (3 skills)
| Skill | Purpose |
|---|---|
| `skills/post-session-recap-agent/` | **Highest-leverage retention lever** — auto-recap to athlete + parent within 4-6h of every session |
| `skills/account-health-agent/` | Signal-based drop-off detection · surfaces at-risk accounts to Margin before they churn |
| `skills/sales-qualification-agent/` | Inbound DM → segment classification → booked consult (or escalate to Margin) |

### Marketing discipline (3 skills)
| Skill | Purpose |
|---|---|
| `skills/outcomes-based-communication/` | Feature-vs-outcome frame · applies everywhere copy is generated |
| `skills/release-room-friday/` | Weekly athlete-story content series · one production cycle → multi-platform distribution |
| `skills/athlete-referral-program/` | Client-to-client referral flow with alumni weighting + real-moment triggers |

### Commercial layer (1 skill)
| Skill | Purpose |
|---|---|
| `skills/roster-revenue-share/` | TOJ 10% revenue share on Margin's roster referrals · auto-tracked · zero manual logging |

### Workflow
| File | Purpose |
|---|---|
| `workflows/lead-to-client-flow.md` | The full 8-step lead-to-client flow with per-step skill references + visualized diagram |

---

## 3 · Existing skills · light upgrades called for (not yet shipped)

The following existing skills should get a v1.1 pass in a future iteration to reference the new skills and honor the segmentation frame:

- **`skills/parent-comms/`** — add segmentation reference · add explicit handshake to `post-session-recap-agent/`
- **`skills/engagement-monitoring/`** — clarify sibling relationship to `account-health-agent/` (content-side rhythm vs client-side rhythm)
- **`skills/subject-media-coordination/`** — add `release-room-friday/` production pipeline reference
- **`skills/cold-outreach/`** — add reference to social auto-replies pattern (covered inside `sales-qualification-agent/` but adjacent)

**Not urgent · queue for post-August calibration pass.**

---

## 4 · Three-phase adoption sequencing

Per the source plan's "Next Steps," sequencing matters. This isn't meant to launch all at once.

### Phase 01 · Foundation (pre-August walkthrough)
**Ship first · these are prerequisites for everything else:**
- `client-segmentation/` — frame every other skill reads against
- `lead-capture-automation/` — infrastructure for tagged intake
- `session-booking-no-show/` — protects consult attendance
- `onboarding-sequence/` — protects the first two weeks of every client
- `package-renewal-tracking/` — protects revenue on autopilot
- `post-session-recap-agent/` — **the highest-leverage retention lever · ship first · immediate visible win for every existing client from week one**

### Phase 02 · Intelligence layer (August-October)
**After the foundation captures cleaner data, layer intelligence on top:**
- `sales-qualification-agent/` — compounds on the lead flow the Phase 1 automations are already capturing
- `account-health-agent/` — needs 30+ days of clean engagement data to calibrate thresholds
- `outcomes-based-communication/` — applied as voice-drift check on every generated output from Phase 1

### Phase 03 · Social & content (October-December)
**Timed to launch alongside a real content calendar, not as an isolated technical feature:**
- `release-room-friday/` — weekly production cycle begins
- `athlete-referral-program/` — real-moment triggers become the growth engine
- Social auto-reply pattern (via `sales-qualification-agent/` extended to comments) — expanded surface coverage

### Ongoing · commercial layer
- `roster-revenue-share/` — active from Phase 1 · statement auto-generated monthly

---

## 5 · What the plan does NOT cover (gaps hooks-os still holds independently)

The source plan focuses on CRM · Integrations · Marketing. It does not address:

- **Coaching methodology** — held in `skills/margin-voice/` + `skills/role-model/` + `skills/cbh-advocacy/`
- **In-person session design** — Margin's coaching IP · not codified in this operating brain
- **The 4D spatial-intelligence teaching frame** — brand positioning · held on the site + STL platform build plan
- **Cohort curriculum** — held in `skills/cohort-design/` (which references but does not codify the actual six-week sequence)
- **Advocacy calls to college programs** — held in `skills/cbh-advocacy/`
- **B2B trainer licensing** — held in `skills/trainer-blueprint/`
- **Content moat protection** (CBH-only live coaching) — held on the site + brand positioning docs

hooks-os continues to be the authority on the strategic and coaching-IP layers. The growth plan provides the tactical growth-operations layer.

---

## 6 · Success signal · has the adoption held?

**Six weeks post-launch (target · September 2026), review:**
- 100% of active clients receiving recaps within 6h of every session
- ≥ 85% first-package renewal rate
- ≥ 40% no-show recovery within 7 days
- ≥ 25% new-signed-client rate from referrals within 12 months
- Zero disputed roster-revenue-share classifications
- Weekly Release Room Friday shipping without missing a Friday

**If any signal misses, calibrate the responsible skill via `feedback/feedback-log.md` and Kyron's monthly review.**

---

*The plan sat on a shelf. hooks-os makes it run. Twelve new skills · one workflow · one adoption doc · one commercial layer · one operating brain that now knows what to do on every inbound, every session, every renewal, every social touch, and every roster referral.*
