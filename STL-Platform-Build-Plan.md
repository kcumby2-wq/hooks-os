# STL × CBH Digital Platform — The $30K Elite Package Build Plan

**Owner:** Kyron Cumby · Trail of Joy Player Management Group, LLC
**For:** Margin Hooks — the reference implementation of the TOJ Sports Elite tier
**Package price:** $30,000 (Track 1 Phase 1+2+3 total — first locked number in the TOJ pricing model per `toj-operator-brain/reference/pricing-model.md` § 7a)
**Timeline:** 12 weeks from contract signature
**Pairs with:** `skills/gated-content-platform/SKILL.md` (the operational skill), `STL-10-of-10-Readiness-Plan.md` (the August walkthrough spine)
**Reference designs:** SpreeAI (single-scroll cinematic positioning), Study.com (three-layer content gate model — documented in the gated-content-platform skill)

---

## § 1 — What This Product Actually Is

A branded, gated digital platform that turns Margin's teaching library into recurring revenue, feeds the existing STL/CBH ladder, and gives the operator a measurable funnel from the first Opus Clips short to the final CBH advocacy call.

**In one line:** *One film upload. Every development question answered.*

This is the TOJ Elite SaaS template — designed to be avenue-agnostic. Same engine deploys for other Elite trainer clients in TOJ Sports AND for TOJ Big Business clients in the training niche (multi-location operations, staff certification, coach development). Margin's is the reference implementation. Every deployment after his benefits from what his teaches us about the funnel.

---

## § 2 — The Value Math (Why $30K Is Defensible)

What the client receives:

| Component | Standalone value | Notes |
|-----------|-----------------|-------|
| Branded gated-content platform (Study.com engine, custom UI) | $8-12K | Video hosting, preview gating, membership auth, Stripe billing |
| Operating-brain repo + 12 skills configured | $5-8K | The hooks-os pattern — voice, advocacy, pipeline, comms skills |
| GHL sub-account full build (4 pipelines + sequences) | $4-6K | Player mgmt, cohort, camps, trainer blueprint pipelines |
| Operational Transcript (quarterly, first year) | $3-4K | Four transcripts, the artifact |
| Content system launch (video pipeline + Opus Clips workflow + 90-day calendar) | $3-5K | 6 videos → 60+ distributed assets |
| Dashboard + funnel analytics layer | $3-4K | Full funnel visibility: preview → member → cohort → eval → apex |
| **Total standalone** | **$26-39K** | |
| **Package price** | **$30,000** | Positioned mid-range of the standalone total |

**The self-financing story:** the $30K pays for itself at 25 sustained memberships/month ($99 × 25 × 12 = $29,700/yr recurring). Margin's existing audience is larger than that. The build is essentially cash-flow-positive within the first year.

**Monthly retainer after build (Phase 3 completion):** TBD, recommended $1,500-2,500/mo for TOJ Sports Elite tier — includes the 2 standard skills/month per `pricing-model.md`, quarterly Operational Transcript, platform maintenance.

---

## § 3 — The Three-Layer Content Model (Study.com's DNA)

Detailed in `skills/gated-content-platform/SKILL.md`. Summary:

- **Layer 0 — Distribution shorts (Opus Clips):** 8-12 shorts per lesson, free, cross-platform. Shorts advertise previews.
- **Layer 1 — Free preview (2 minutes):** every lesson, no signup, ends after one complete coaching point but before the drill progression. Previews advertise membership.
- **Layer 2 — STL Membership ($99/mo):** full library + drill packets + rep checks + certificates + community. Members feed cohort applications.
- **Layer 3 — Premium ladder:** Cohort ($premium, application-gated) → Evaluation (Prospect Edge transcript) → CBH (apex, application-only, in-person with Margin).

**Every layer feeds the next.** Every layer is measured. This is what makes the platform data-driven and not just a video library.

---

## § 4 — The Positioning (SpreeAI's DNA)

SpreeAI sells confidence at the moment of decision through single-scroll cinematic storytelling. STL adopts the same structural pattern:

- One hero moment. One promise. No feature list on the homepage.
- The demo IS the pitch — the visitor experiences the gate, not a description of it.
- Enterprise CTA (Cohort / CBH inquiry) sits underneath the product experience, not above it.
- Aesthetic: STL navy authority (`#1E3A5F`) with champagne gold accents (`#D4A853`), Fraunces serif + JetBrains Mono labels. Locker-room seriousness. Not tech-startup gradients.

**What we do NOT copy from SpreeAI:** their cool-tech visual language. STL's confidence comes from the record (26 NFL, 160+ D1, 1 Pro Bowler), not from motion design.

---

## § 5 — Build Sequence (12 Weeks)

### Phase 1 — Foundation (Weeks 1-4)
- Contract kickoff + brand tokens locked
- Platform scaffold (Next.js + Supabase + Stripe — same stack family as `cmc-visuals`, new template)
- All 6 Kyron-shot videos processed: preview points marked with Margin, drill packets drafted, rep checks written
- Video library UI + gating engine live on staging
- Membership auth + Stripe subscription wired end-to-end
- **Done when:** platform is live, first track (3 lessons) published, membership purchasable, one real test purchase processed

### Phase 2 — Automation (Weeks 5-8)
- Curriculum structure locked (tracks → phases → lessons → rep checks → certificates)
- Opus Clips distribution pipeline producing 8-12 shorts per lesson
- GHL pipelines wired to platform events (per the skill's funnel event table)
- Automated comms sequences per event (preview-watched, gate-reached, member-joined, lesson-completed, cohort-applied)
- Funnel dashboard v1 live for Margin + Kyron
- First Operational Transcript baseline produced
- **Done when:** automation loop closed, funnel data flowing, first transcript delivered

### Phase 3 — Compounding (Weeks 9-12)
- Cohort delivery through the platform (curriculum, live session hosting, member gating)
- Evaluation ordering flow (parent orders Prospect Edge, workflow routes per `skills/prospect-edge-workflow/SKILL.md`)
- CBH application flow (application-gated, routes to Margin's personal review queue)
- Parent-visible athlete progress dashboard (progress bars per track, certificates earned)
- Full role-scoped dashboard (Margin, Kyron, athlete, parent — different views per `scope.js` pattern)
- **Done when:** the client could stop checking in for 30 days and the system would keep running

### Week 12 — Launch review = August walkthrough
The Phase 3 completion review doubles as the August 10 readiness walkthrough per `STL-10-of-10-Readiness-Plan.md`. One meeting, two outcomes.

---

## § 6 — The Demo Sandbox (What Kyron Shows Margin First)

Before the contract, Kyron demos the concept using `stl-demo-sandbox-v1.html` — a working front-end mockup that feels like the finished product. It has:

1. The SpreeAI-style hero — Margin's brand voice, real credential numbers
2. **A live preview-gate simulation** — a video card that plays a compressed 10-second "preview timer" representing the 2-minute preview, and drops the gate live. Margin needs to *feel* the gate to understand why it converts.
3. The tier ladder (free → member → cohort → CBH) rendered as the platform's ladder page
4. The funnel dashboard — the Monday operator read visualized with plausible sample numbers
5. The Operational Transcript embedded — the artifact that makes this a TOJ system, not a Kajabi clone

Suggested demo script (15 minutes total):
1. *(2m)* Hero — "This is what a family sees when someone sends them your link."
2. *(3m)* Watch the preview gate drop. "That moment is where a DM becomes a member."
3. *(3m)* Funnel dashboard — "You'll know which lesson converts before you film the next one."
4. *(3m)* Transcript + operating brain — "The platform is the storefront; the brain is the operation."
5. *(2m)* The ladder — "Nothing about your business changed — it just runs without your thumbs."
6. *(2m)* The number — "$30K build, monthly retainer after. Pays for itself at 25 members."

---

## § 7 — TOJ Campaign as a Dual-Lane Client

Beyond Margin, TOJcampaign.com itself becomes an early instance of this template — running as a TOJ Big Business client AND operating in the TOJ Sports realm. Two implications:

1. **TOJ eats its own cooking.** The gated-content model applies to TOJ's own /standard content — free samples, deeper operator content behind a soft gate.
2. **Deployment data compounds at the network level.** After the first 5 Elite deployments, TOJ has anonymized funnel benchmarks for the training niche (preview→member conversion, average lesson completion, cohort application rate). Those benchmarks become the sales deck for deployment #6+. The data moat compounds the same way the transcript moat does.

---

## § 8 — What Gets Pushed to Which Repo (final map)

| Artifact | Destination |
|----------|-------------|
| `skills/gated-content-platform/SKILL.md` | `hooks-os` (pushed) |
| `STL-Platform-Build-Plan.md` (this doc) | `hooks-os` root (pushed) |
| `stl-demo-sandbox-v1.html` | Kyron's local — not pushed unless Margin approves after seeing it |
| Pricing lock: TOJ Sports Elite = $30K | `toj-operator-brain/reference/pricing-model.md` § 7a |
| Decision log entry | `toj-operator-brain/decisions/decision-log.md` |
| Active-fires update (Margin demo becomes P0) | `toj-operator-brain/state/active-fires.md` |

---

## § 9 — Hard Rules (network-level, non-negotiable)

- **No sign-off on the build without Margin's yes on the demo.** The demo is the pitch. If it doesn't land, the plan doesn't ship.
- **No preview points selected without Margin present.** Every lesson's 2-minute cut requires his teaching judgment.
- **No inflated funnel projections in the sales conversation.** The self-financing math uses conservative assumptions — 25 members. Don't sell 100.
- **No feature scope-creep beyond the three phases without a change order.** Every "quick add" is a new phase 3.5.
- **No CBH advocacy claim on any platform copy about an athlete Margin has not personally seen in-person.** The hard rule from `skills/cbh-advocacy/SKILL.md` applies.

---

## § 10 — Success Criteria (12-week acceptance)

The client accepts Phase 3 delivery when ALL of the following are true:

- [ ] Platform live on Margin's domain with SSL
- [ ] 6 initial lessons published with previews, drill packets, rep checks
- [ ] Stripe membership purchase confirmed working end-to-end
- [ ] Opus Clips workflow producing shorts weekly
- [ ] All 11 funnel events firing correctly into GHL
- [ ] 4 GHL pipelines + sequences live
- [ ] Cohort application flow gated and routing to Margin
- [ ] Prospect Edge evaluation orderable through platform
- [ ] CBH inquiry form flagged to Margin personally
- [ ] Q1 Operational Transcript delivered to Margin
- [ ] Parent-visible athlete progress dashboard functional
- [ ] Dashboard shows funnel pulse + roster pulse + advocacy log

---

*v1.0 — 2026-06-28. Phase 1 starts the week Margin signs. The demo lands first.*
