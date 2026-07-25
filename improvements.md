# Improvements Log

*The agent logs every rule change here with the feedback that drove it. Git history + this file = the audit trail of the brain getting smarter.*

---

## 2026-07-25 · Move #3 · Drafted TOJ-Margin master operating agreement

**Feedback verbatim:** *"Ok lets start with 1 then go to the 2nd one and last lets do the 3rd."* — Kyron (final move of the 3-move sequence)

**Move #3 complete.** The commercial layer of the operating brain now has a legal instrument. Draft v0.1 codifies the arrangement into a contract-shaped document ready for attorney review.

### Shipped

- **`contracts/toj-margin-master-operating-agreement.md`** — 13-section master agreement with 4 appendices covering: recitals · definitions · scope of services · 10% revenue share on Roster Referrals · IP ownership (TOJ owns methodology · Margin owns coaching craft + brand) · confidentiality · term/termination · audit + dispute resolution · non-compete boundary · reps/warranties · liability cap · general provisions · signature blocks · roster source tag reference · excluded categories · reference schema · change log · attorney-review checklist.
- **`contracts/toj-margin-master-operating-agreement.html`** — print/DocuSign-ready HTML render of the same agreement. Same content · signable formatting · print button · attorney-review checklist. Non-repudiation via the `.md` source (canonical) plus the `.html` render (executable).
- **`contracts/README.md`** — folder index + attorney-review workflow + explanation of why contracts live in the operating-brain repo (commercial terms and operational terms stay in sync).

### Key commercial terms codified

- **10% revenue share** on Collected Revenue from every Roster Referral (source: `roster_referral` · `alumni_network` · `direct_margin_intro`) · auto-calculated via `calculate_revenue_share()` · zero manual reconciliation
- **Grandfather clause:** pre-Effective-Date paying clients excluded unless they sign a new package after signing
- **Excluded:** Trainer Blueprint · sponsorships · book/course sales · one-off consults · pre-existing engagements
- **IP boundary:** TOJ owns Operating Brain methodology · Margin owns coaching craft + client relationships + brand
- **License-back:** on termination, TOJ delivers Margin-specific snapshot for continuity
- **Revenue-share tail cap:** post-termination obligations capped at `[REVIEW: 24 or 36]` months to prevent perpetual entanglement
- **XPAND supersession:** §12.5 expressly supersedes "any prior arrangement naming a different entity as revenue-share partner in connection with roster referrals"

### What's still `[REVIEW]`

Twelve bracketed items require attorney or joint-principal input before execution: governing-law state, payout cadence/method, initial term length, non-renewal window, termination-for-convenience notice, tail cap duration, confidentiality survival, non-compete scope, liability cap sizing, insurance minimums, notice addresses, audit interest rate. Attorney should also confirm the revenue-share structure doesn't inadvertently trigger franchise, securities, or MLM regulatory frameworks.

### What this closes

The 3-move sequence is complete:
- **Move #1:** v1.1 skill upgrades wiring existing skills to the 12 new Growth Plan skills ✓
- **Move #2:** GHL/Supabase infrastructure making every skill spec runnable ✓
- **Move #3:** Legal instrument formalizing the commercial arrangement ✓

The operating brain now has skills (WHAT), infrastructure (HOW), and contract (WHO OWNS WHAT + WHO GETS PAID WHAT) all in the same repo, cross-referencing each other. Any material change to a skill or infrastructure component that affects commercial terms must trigger a same-session contract amendment.

**Not shipped intentionally:** actual execution. Both principals + both attorneys must review the draft before signing. This is v0.1 · not a signed instrument.

---

## 2026-07-25 · Move #2 · Wired GHL/Supabase automation infrastructure

**Feedback verbatim:** *"Ok lets start with 1 then go to the 2nd one and last lets do the 3rd."* — Kyron (referring to the 3-move sequence)

**Move #2 complete.** Every skill spec now has a concrete runtime. `infra/` scaffolds the whole automation layer.

### Shipped

**`infra/README.md`** — top-level runtime allocation: Supabase (source of truth) · GHL (CRM/comms) · Stripe (payments) · Anthropic Claude (agent layer).

**`infra/skill-runtime-map.md`** — every skill mapped to concrete runtime with SB/GHL/STR/AI/HUM legend, daily cron schedule, and env vars required.

**Supabase migrations (5):**
- `001_core_schema.sql` — leads · consults · clients · packages · sessions (with segment + source_tag flowing through)
- `002_recap_pipeline.sql` — session_notes · recaps · recap_events + `recap_delivery_stats` view
- `003_account_health.sql` — signals · flags · interventions · scan_runs (with severity + intervention type enums)
- `004_revenue_share.sql` — payment_events · revenue_share_ledger · revenue_share_statements + `calculate_revenue_share()` plpgsql function
- `005_engagement.sql` — content_briefs · content_assets · engagement_events · advocacy_log · referrals · engagement_weekly_snapshots

**Supabase Edge Functions (4 + shared):**
- `_shared/voice-drift-check.ts` — runs inside every AI function · enforces outcomes-based-communication + margin-voice · 3-retry loop then escalate
- `recap-agent/` — post-session-recap-agent runtime · triggered by session_notes insert · segment-aware recipient picking
- `qual-agent/` — inbound classifier · routes fit/sponsor/complaint · creates lead row + drafts reply
- `health-agent/` — daily 09:00 CT cron · computes signals · reconciles flags · queues interventions by severity
- `stripe-webhook/` — payment events → payment_events + fires calculate_revenue_share() for roster-attributed clients

**GHL integration specs:**
- `infra/ghl/field-mapping.md` — every custom field mapped bi-directionally · tag conventions · what stays out of GHL
- `infra/ghl/webhooks.md` — 7 inbound webhook contracts + outbound endpoint reference · retry/idempotency rules
- `infra/ghl/workflows/README.md` — index of 20 workflows Kyron builds in GHL UI · phased by Foundation/Intelligence/Social+Content
- `infra/ghl/workflows/10-hooks-recap-delivery.md` — exemplar per-workflow spec (recap delivery · the highest-leverage one)

### What this changes

Before Move #2: the skill specs described WHAT to do. After Move #2: every skill has WHERE (which table, which function, which workflow) and HOW (concrete columns, concrete API calls, concrete cron times). The operating brain is now buildable — Will can start on Stripe integration · Kyron can start on GHL workflow builds · migrations can go to prod Supabase whenever Kyron reviews.

### What's NOT in this move (deliberate)

- No production secrets · no actual API keys · no PII · schemas only
- GHL workflow JSON exports (those live in GHL UI · specs are here)
- Auth model beyond service-role · fine-grained RLS policies deferred to a future migration when client-facing dashboards ship

**Next up:** Move #3 (draft the TOJ-Margin master operating agreement · legal instrument codifying the roster-revenue-share and the whole commercial arrangement).

---

## 2026-07-25 · v1.1 upgrades · 4 existing skills cross-referenced to new skills

**Feedback verbatim:** *"Ok lets start with 1 then go to the 2nd one and last lets do the 3rd."* — Kyron (referring to my proposed 3-move sequence: v1.1 upgrades → automation wiring → operating agreement)

**Move #1 complete.** Four existing skills got a v1.1 pass adding version headers, three-segment framing where relevant, and cross-skill integration blocks pointing to the 12 new skills shipped in the Growth Plan absorption.

### Upgrades landed

- **`parent-comms/` v1.1** — expanded from 2-segment to 3-segment (per `client-segmentation/`) + full Cross-Skill Integration block. Handshakes to `onboarding-sequence/`, `post-session-recap-agent/`, `package-renewal-tracking/`, `session-booking-no-show/`, `athlete-referral-program/`, `account-health-agent/`, `sales-qualification-agent/`.
- **`engagement-monitoring/` v1.1** — clarified sibling relationship to `account-health-agent/` (content-side rhythm vs client-side rhythm — both watch signals at different layers). Added cross-references to `release-room-friday/`, `subject-media-coordination/`, `athlete-brand-pipeline/`, `cbh-advocacy/`, `trainer-blueprint/`, `sales-qualification-agent/`, `athlete-referral-program/`, `outcomes-based-communication/`.
- **`subject-media-coordination/` v1.1** — new "Release Room Friday integration" section codifying the weekly production cycle this skill orchestrates. Added `output/content-briefs/_templates/release-room-friday.yaml` template reference. Expanded Cross-Skill Integration to include `release-room-friday/`, `athlete-referral-program/`, `sales-qualification-agent/`, `outcomes-based-communication/`.
- **`cold-outreach/` v1.1** — clarified sibling relationship to `sales-qualification-agent/` (this skill handles OUTBOUND · that agent handles INBOUND). Added cross-references to `client-segmentation/`, `lead-capture-automation/`, `outcomes-based-communication/`, `roster-revenue-share/`.

### Why this matters

The 12 new skills the Growth Plan absorption shipped only work if the existing skills know they exist and hand off to them correctly. Without these v1.1 upgrades, the operating brain would have two disconnected halves — legacy strategic skills on one side, new tactical automation skills on the other. Now every skill either references or hands off to the new layer.

**Next up:** Move #2 (wire GHL/Supabase automation infrastructure · scaffold the concrete runtime for the specs).

---

## 2026-07-25 · STL Growth Plan absorbed · 12 new skills + workflow + adoption doc

**Feedback verbatim:** *"Lets look in the hooks-os repo I want to add things that arent already implemented into the Hooks-os. The name will in the contract does not matter. This is mine now. We are using this to make the plan stronger."* — Kyron

**Source:** external CRM/Automation growth plan received for Sky's The Limit WR (Margin Hooks). Original document named a third-party operator on the 10% roster revenue share — per Kyron's directive, that arrangement is now TOJ's. Authorship irrelevant · execution is what matters.

**Gap-analysis pass** against existing hooks-os skills identified 12 tactical/operational layers the strategic skill set was missing.

### 12 new skills shipped

**CRM foundation (5):**
- `client-segmentation/` — three-segment frame (Youth/HS · College-Bound · Alumni/Pro-Track) every other skill reads against
- `lead-capture-automation/` — every inbound tagged + segment-routed · ad-specific landing pages · form-first pattern
- `session-booking-no-show/` — confirmation cadence + no-show recovery + post-consult 3-way branch
- `onboarding-sequence/` — welcome → intake → first session → first recap · per-segment parallel tracks
- `package-renewal-tracking/` — 30/14/7 reminder cadence + missed-payment recovery + churned-client win-back

**Agent layer (3):**
- `post-session-recap-agent/` — **highest-leverage retention lever** · auto-recap to athlete + parent within 4-6h
- `account-health-agent/` — signal-based drop-off detection · surfaces at-risk before churn
- `sales-qualification-agent/` — inbound DM → segment classification → booked consult

**Marketing discipline (3):**
- `outcomes-based-communication/` — feature-vs-outcome frame · fires on every generated output
- `release-room-friday/` — weekly athlete-story content series · one production cycle → all platforms
- `athlete-referral-program/` — client-to-client referrals with alumni weighting + real-moment triggers

**Commercial layer (1):**
- `roster-revenue-share/` — TOJ 10% on Margin's roster referrals · auto-tracked via CRM tag · zero manual logging

### Plus

- `workflows/lead-to-client-flow.md` — 8-step visualized flow with per-step skill references
- `STL-Growth-Plan-Adoption.md` — top-level mapping doc showing what existed, what shipped, and the 3-phase sequencing (Foundation → Intelligence → Social & content)

### Notable retention insight preserved

Per the Growth Plan return table, the automated post-session recap is *"the single highest-leverage change in the plan for retention · a documented weekly recap is the difference between a parent who renews on autopilot and one who has to be re-sold every package."* Codified as its own skill (`post-session-recap-agent/`) rather than folded into `parent-comms/` — because retention runs through it, and every other skill hands off to or supports it.

### Contract note

The original growth plan named a third-party partner for the 10% roster revenue share. Per Kyron's directive, all partnership terms flow to TOJ. `roster-revenue-share/SKILL.md` documents the arrangement · specific legal instrument to be finalized in the master TOJ-Margin operating agreement.

### 3-phase adoption sequencing (per `STL-Growth-Plan-Adoption.md`)

- **Phase 01 · Foundation (pre-August walkthrough):** the 5 CRM foundation skills + `post-session-recap-agent/` — ship first for immediate visible wins
- **Phase 02 · Intelligence layer (August-October):** the 3 agent skills + outcomes-based-communication voice audit
- **Phase 03 · Social & content (October-December):** Release Room Friday + Athlete Referral Program + social auto-reply expansion

**Ongoing:** `roster-revenue-share/` active from Phase 1 · statement auto-generated monthly.

---

## 2026-06-25 — v1.0 Founding (the most-prepared founding pass in the network)

This repo is the founding trainer brand of the TOJ network, but it is being built **third** in the operating-brain sequence (after youngblood-os v1.0→v1.2 and patterson-os v1.0). That means Margin's brain opens at a quality level **neither of the prior two repos reached at founding** — every architectural lesson learned in the prior client cycles is pre-applied here. The order of building did not match the order of seniority in the federation, and that gap is the gift: Margin's brain skips the growing pains.

### Lessons pre-applied at founding

**1. Brand confirmation as Step 0.**
Source: youngblood-os v1.0→v1.1 brand-name correction. Margin's brand identity is locked (Coached by Hooks + Sky's The Limit WR) — no naming step required. Repo, paths, copy use both brands from commit one. The CBH × STL split is encoded as the architectural backbone of the CLAUDE.md, not buried.

**2. Peer-brand federation framing.**
Source: youngblood-os v1.1→v1.2 apex-correction. Margin's brand is the **most-developed brand and the first proof point** of the operating-brain pattern — but framing-wise it is a peer in the federation, not an apex of a hierarchy. Joshua, Max, and Margin are peers. Margin's CBH Trainer Blueprint is the apex *product* within the trainer funnel, not an apex relationship.

**3. Prospect Edge as evaluation backbone, day one.**
Source: youngblood-os v1.0→v1.1 correction. `skills/prospect-edge-workflow/SKILL.md` is v1.0 of this repo. No "Phase 2" deferment.

**4. Cohort, outreach (two-mode), engagement-monitoring, parent-comms — all v1.0.**
Source: youngblood-os v1.0→v1.1 corrections + patterson-os founding lessons. All standard skills land at v1.0 of this repo, fork-able from the patterson-os pattern with Margin-specific tunings.

**5. `config.md` is mandatory.**
Source: youngblood-os v1.0→v1.1 onboarding-configuration correction. Margin's `config.md` populates during the pre-August walkthrough — outreach mode, language set (EN-only), cohort cadence, approval gates, event archetypes, engagement weighting (Elevated by audience scale). Lives at the root next to `CLAUDE.md`.

**6. Voice skill seeded against existing corpus + intake calibration.**
Source: patterson-os founding lesson. Margin has substantial public content (training session clips, podcast appearances, conference talks). Voice skill seeds against that corpus in a calibration pass before August. Conservative-voice mode applies for the first 30 days post-launch.

**7. Cross-brand relationships pre-approved at the architecture level.**
Source: youngblood-os ↔ patterson-os Rutgers/Delaware-teammate handling. Margin ↔ Joshua and Margin ↔ Max cross-brand content moments are pre-approved in `CLAUDE.md`. Margin frequently references Joshua/Max as Trainer Blueprint case studies; each cross-reference logs to `data/cross-brand-touches.md`.

**8. Engagement weighting calibrated to audience scale.**
Source: patterson-os founding insight. Margin's audience is substantial across @skysthelimitwr and personal channels. Engagement Monitoring runs Elevated mode by default. Monday review includes the Conversion Read section.

**9. The CBH Trainer Blueprint funnel architecture.**
Source: TOJ Operational Transcript W26 pattern (CBH × STL document review). The Trainer Blueprint funnel is encoded as a discrete pipeline and a productized deliverable list in `skills/trainer-blueprint/SKILL.md`. Joshua and Max are referenced as case study graduates of this product.

### Items SPECIFIC to this repo — first-time architectural patterns

These are the patterns that exist nowhere else in the federation and were built directly into Margin's v1.0 because of the partnership structure Kyron is bringing to Margin:

**10. The Athlete Brand & NIL Pipeline — a first-of-its-kind skill.**
Source: Kyron's strategic partnership update (2026-06-25). Margin has 6 NFL + 30+ Power 4 athletes signed to player management. TOJ joins as internal marketing partner on each athlete's brand + NIL deal pipeline. `skills/athlete-brand-pipeline/SKILL.md` is the v1.0 implementation. The data folder structure (`data/athletes/_management-clients/[X]/`) supports per-athlete brand build, NIL deal pipeline, season tracker, and consent management at scale. This skill exists only in this repo; patterns proven here graduate into a standalone TOJ service product after the first season cycle.

**11. The CBH Advocacy Skill — credential infrastructure.**
Source: CBH × STL document. The advocacy call is the credibility weapon, and the log is the proof. `skills/cbh-advocacy/SKILL.md` defines pre-call brief production, post-call debrief capture, attribution-ledger maintenance, and the weekly advocacy report. The attribution ledger becomes the sales asset for future CBH conversations AND the proof-point library for Trainer Blueprint sales.

**12. Three funnels in one repo, not one.**
Source: Architectural reality of Margin's business. Standard trainer repos run one or two funnels (athlete training; maybe events). Margin's repo runs three in parallel: athlete funnel (CBH apex), trainer funnel (Trainer Blueprint apex), athlete-brand/NIL funnel (TOJ partnership). The CLAUDE.md, the goals, the daily workflow, and the engagement reports all reflect this triple-loop structure.

**13. Subject Media coordination, not Subject Media production.**
Source: Existing ecosystem reality — SubjectSkillz creators produce content; the agent does not. `skills/subject-media-coordination/SKILL.md` defines the boundary: agent writes briefs, quality-checks output, orchestrates posting cadence, but never produces a final asset. This rule prevents the agent from drifting into creator-team territory and creating either-bad-output or workflow-confusion.

### What this entry means

Margin's repo opens at v1.0 with twelve baked-in lessons that took the rest of the network three founding passes to surface. The compounding is the operational asset Kyron is building — and Margin's repo is the most visible evidence yet that it's real.

**Critical deadline:** August 10, 2026. Six weeks. The pre-season walkthrough has to deliver a system Margin can stop thinking about. This founding pass is the foundation for that delivery; the next four weeks of work close the gaps surfaced in `STL-10-of-10-Readiness-Plan.md`.

---

## 2026-07-20 · Pre-Season Walkthrough demo prompt authored (Fable delivery)

**Feedback verbatim:** *"Ok prepare on for Margin hooks also then I will tell you if I want to do Fable on both of them or not."* — Kyron 2026-07-20

**What shipped:**
- New folder: `demos/`
- `demos/margin-hooks-demo-prompt.md` — masterclass Fable prompt for the Pre-Season Walkthrough
- `demos/README.md` — usage guide + cohort-peer/Trainer-Blueprint-buyer placeholders

**Prompt structure (7 acts, ~7 minutes total):**
1. Sunday Night · 0:00–0:20 · Margin's own week named (47 unread parent emails · 12 outreach drafts · 3 stalled NIL) · silence-as-design
2. Brain Wakes Up · 0:20–0:55 · CLAUDE.md center · 13 skills · workflows · data · feedback · goals in orbital cascade
3. Two Brands · One Operation · 0:55–1:35 · CBH (apex · gold cluster) vs STL (distribution · green cluster) · working principle reunion
4. Watch It Move · 1:35–3:15 · Wednesday 9:14 PM Coppell WR mom email · full routing simulation · 90 sec agent + 8 sec Margin approval · then rapid 6-scenario montage
5. Personal LLM Path · 3:15–4:15 · 12-month arc scrubber · Months 1-3 context loading → 4-6 skill building → 7-12 Personal LLM emergence → Year 2+ Margin's LLM (productizable IP)
6. The Cohort · 4:15–5:00 · hooks-os + youngblood-os + patterson-os · Growth Autopilot 2 loops running
7. The Athletes · 5:00–6:15 · silhouette callouts by school abbreviation · 26 NFL · 160+ D1 · "the brain runs so you can be with them"

**Discipline embedded:**
- Aesthetic contract: cooler black `#0B0B0F` + warm gold `#E4B95E` + field-green `#1E3A2C` accent (trainer register, not corporate)
- Typography: Anton + Inter + JetBrains Mono
- Motion language: easing over linear · slow reveal · never bounce/flash/spin/wiggle
- 12 explicit anti-patterns (no CRM dashboard · no fitness-app tropes · no military framing · no full athlete names · no hype vocabulary)
- 7 Chills Checkpoints (Sunday Night → Brain Wakes → Two Brands → Watch It Move → Personal LLM → Cohort → Athletes)
- Live GitHub API integration (repo metadata · commits · skill files fetched at runtime)
- Time-back counter running throughout (12.5 hrs/week → 260+ hrs/season by Act 7)
- Voice register from `margin-voice/` carried throughout

**Contrast with pylon-os/demos/pylon-ceo-demo-prompt.md:**

| Dimension | Pylon CEO version | Margin Hooks version |
|---|---|---|
| Audience | Corporate CEO | 20-year trainer |
| Palette | Pylon black + electric yellow | Cooler black + warm gold + field green |
| Emotional arc | Curiosity → chills → conviction | Fatigue → relief → power → legacy |
| Reveal moment | $2.9M–$4M revenue reveal (Act 6) | 260+ hrs/season back + Personal LLM as IP (Acts 5 + 7) |
| Simulation | Pylon Regional Championship (15 skills routed, 96 pieces shipped) | Wednesday 9:14 PM Coppell mom email (90 sec agent + 8 sec approval) |
| Human stakes | 1,261 teams · 117K athletes · 38+ states | 26 NFL · 160+ D1 · many since middle school |
| Anti-patterns | No SaaS dashboard · no clip art | No CRM · no fitness-app tropes · no military framing |

Same architecture · different soul.

**Why this matters:**
Kyron ships the prompt to a fresh Fable session. Fable outputs the HTML. Kyron presents to Margin during the Pre-Season Walkthrough Zoom in the first week of August. If the demo lands, Margin signs off on the Readiness Plan, locks in the "things you don't touch during season" list, and walks into pre-season calm. The demo is part of the closing motion for the August 10 critical deadline.

---

*Future entries follow the standard shape: feedback verbatim → what changed → which file the rule lives in.*
