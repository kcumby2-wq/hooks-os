# Sky's The Limit Site Rebuild — High-Ticket Intake Plan

**Client:** Margin Hooks (Sky's The Limit + Coached by Hooks)
**Reference implementation of:** the TOJ Sports Elite $30K package, applied to a trainer with a mature audience but an outdated web presence
**Companion files:**
- `stl-demo-sandbox-v1.html` (Kyron's demo — one slice of this)
- `skysthelimit-site-v1.html` (the full homepage rebuild — the design source-of-truth)
- `STL-Platform-Build-Plan.md` (the 12-week Phase 1/2/3 build sequence)
- `skills/gated-content-platform/SKILL.md` (the Study.com gate model powering Film Room)
**Follows the pattern from:** `HIGH_TICKET_INTAKE_TEMPLATE_PLAYBOOK.md` v1.2 (SubjectReport + SubjectMedias)
**Created:** 2026-06-28

---

## § 1 — Why Margin Is Treated as a High-Ticket Intake

Margin has the exact shape of client the intake playbook was written for:
- **Audience already qualified.** 24.8K X, 27K IG, 4.7K Threads — parents and coaches actively following, not cold traffic
- **High-value product ladder.** From free content to a low-thousands membership, mid-four-figure cohort, and a five-figure-plus advocacy tier
- **Current site is a 2022 Typedream 3-pager.** No intake, no gated content, no dashboard, no data. Every visitor today is a data leak.
- **The delivery workflow demands intake data.** Whether it's a cohort application, an evaluation order, or a CBH inquiry, Margin needs to know before he says yes: who's the athlete, what's their film look like, who's the parent, what have they already done. The intake IS the pre-qualification.

**Track application per `toj-operator-brain/reference/pricing-model.md`:** Margin is a Track 1 client at the TOJ Sports Elite tier ($30K). The site rebuild is Phase 1 (Foundation) of that 12-week build — positioned as a first standalone deliverable to prove work quality before the deeper platform buildout.

---

## § 2 — Section-by-Section Skill Mapping

Every visible section of `skysthelimit-site-v1.html` is grounded in a specific `hooks-os` skill. The site's purpose is to be the customer-facing surface of the operating brain.

| Site section | Powered by | What the visitor sees | What runs behind it |
|---|---|---|---|
| Hero + credibility strip | `role-model` + `margin-voice` | The record. The promise. | Voice bans applied to every headline. |
| The Ladder | Composite of all 5 product skills | 5 tiers: Free · Member · Cohort · Evaluation · CBH | Each rung is a real product with defined delivery workflow. |
| Film Room + live gate demo | `gated-content-platform` | Study.com-style 2-min preview → paywall drops | Three-layer content gate + 11 funnel events. |
| STL Cohort | `cohort-design` | 6-week arc, quarterly enrollment, application-gated | Quarterly Zoom cohort. Application feeds Margin's review queue. |
| Get Evaluated | `prospect-edge-workflow` | Order form → 7-day transcript → shareable coach link | Verified evaluation with five-pillar grading. |
| Managed Athletes | `athlete-brand-pipeline` | Public roster strip of consent-flagged athletes | Full pipeline manages 36+ athletes; only consented ones surface. |
| Coached by Hooks | `cbh-advocacy` | Apex tier + advocacy log peek | The attribution ledger surfaced as credibility. |
| Events & Clinics | `event-campaign-design` | Eventbrite calendar | Training-session-IS-the-camp philosophy. |
| Trainer Blueprint | `trainer-blueprint` | $3.5-5K product for coaches licensing methodology | Includes onboarding call + 12mo updates. |
| The System | `engagement-monitoring` | Dashboard peek: funnel + roster + transcript | The Monday three-funnel read, made public. |
| Footer intake trigger | `parent-comms` (indirect) | Multi-step gated intake modal | Every submission triggers a comms sequence. |
| Behind the scenes | `subject-media-coordination` | Video credits, distribution shorts | Powers Film Room content pipeline. |
| Behind the scenes | `cold-outreach` | Not surfaced publicly | Runs when Margin identifies athletes — never public. |

**Every skill except `cold-outreach` gets visible presence on the site.**

---

## § 3 — The High-Ticket Intake Applied to Margin

The playbook (v1.2) defines the pattern: gated modal → POST /api/intake → Supabase row (pending) → Stripe Checkout Session with `client_reference_id` → customer pays → webhook fires → row (paid) + 2 emails. Margin's rebuild applies this with **one intake modal serving FIVE product paths** instead of five separate checkout pages.

### The one modal, five products

| CTA on site | Modal opens with |
|---|---|
| "Start Discovery" (nav + hero + final CTA) | Product picker open |
| "STL Membership" ladder rung | Membership pre-selected |
| "STL Cohort" ladder rung or Cohort section | Cohort pre-selected |
| "Prospect Edge" ladder rung or Evaluate CTA | Evaluation pre-selected |
| "Coached by Hooks" ladder rung or CBH section | CBH pre-selected |
| Trainer Blueprint section | Blueprint pre-selected |
| Roster "Request coach access" | Coach access flow |
| Event "Get the alert when open" | Event alert signup |

**All eight entry points land in the same modal, share the same Supabase table, and route via a single Stripe webhook.** Exact SubjectReport/SubjectMedias pattern — URL routes the product; plumbing is one system.

### The four steps

1. **Athlete info** — name, position, class year, height/weight, HS, film link
2. **Product selection** — Membership / Cohort / Evaluation / CBH / Trainer Blueprint
3. **Parent/guardian info** — name, phone, email, freeform "anything Coach Hooks should know"
4. **Consent** — guardian consent, communication, roster/social, Athletes Certified public listing

### The two emails on `checkout.session.completed`

Per playbook: customer confirmation + internal notification. **Different template per product** — CBH gets flagged to Margin personally, membership auto-provisions, evaluation queues for the grading team, etc.

---

## § 4 — Reference Sites (Subject Media × Subject Report)

The playbook v1.2 names both sites as the pattern's origin — first built June 2026.

**Margin inherits from SubjectReport:** Prospect Edge evaluation transcript as purchasable product, five-pillar grading, coach-facing shareable link pattern.

**Margin inherits from SubjectMedias:** Film Room content model (Study.com gate for sports coaching), multi-tenant creator-storefront architecture, Subject Media coordination powering distribution shorts.

**Margin adds on top:** 5-tier ladder (vs single product), advocacy log peek (unique to CBH), Athletes Certified public strip, Trainer Blueprint sibling product.

---

## § 5 — The Six Manual Provisioning Steps

For the production build:

**Step 1 — Supabase schema.** New `stl` schema with `intakes` table. Columns cover athlete info, product routing, parent info, all four consent flags, Stripe reference, timestamps for status transitions. Indexed on product+status and parent_email.

**Step 2 — Stripe Products/Prices.** Six env vars: STL_MEMBERSHIP ($99/mo recurring), STL_COHORT (TBD $499-999), STL_EVAL (TBD $299-499), STL_CBH_DEPOSIT (TBD refundable $200), STL_BLUEPRINT_MIN ($3.5K), STL_BLUEPRINT_MAX ($5K). **Three prices to lock with Margin before Phase 2.**

**Step 3 — Resend domain.** DNS records added at whoever hosts skysthelimitwr.com DNS (likely GoDaddy per current Typedream hosting).

**Step 4 — Vercel env vars.** Playbook standard set, STL-namespaced.

**Step 5 — Stripe webhook.** `https://skysthelimitwr.com/api/stripe/webhook` — same handler code as SubjectReport, routes on product field.

**Step 6 — Deploy.** `skysthelimit-site-v1.html` mockup converted to Next.js or kept static + serverless intake route.

---

## § 6 — What's Different from Vanilla Playbook Build

**1. The Film Room live gate demo.** Study.com model bolted into homepage as working simulation. Visitors don't read about the gate — they feel it. Margin-specific integration of STL Platform Build Plan Phase 1 deliverable.

**2. The advocacy log peek.** CBH section shows recent (illustrative) advocacy activity. Unique — no other TOJ property has personal-advocacy public-facing surface because no other property has Margin's record.

**3. Five product paths through one modal.** SubjectReport is single-product. Margin has 5 products at 5 price points. Modal branches at Step 2 based on entry CTA.

---

## § 7 — What's Still TBD

- [ ] **Cohort seat price** (recommend $499-999)
- [ ] **Prospect Edge evaluation price** (recommend $299-499)
- [ ] **CBH application review fee** (recommend refundable $200)
- [ ] **Domain / DNS control** — confirm access to skysthelimitwr.com DNS
- [ ] **Current Typedream content extraction** — what to preserve vs rewrite
- [ ] **Athletes Certified consent audit** — real athletes with signed parent consent for public roster (mockup uses placeholders)
- [ ] **Real drill packet + rep check content** — preview points per lesson need marking with Margin
- [ ] **Event calendar sync** — Eventbrite API vs manual update

---

## § 8 — Sequencing With STL Platform Build Plan

**Weeks 1-2:** Site rebuild + intake stack (this document's core)
**Weeks 3-4:** Film Room video processing + content system
**Weeks 5-8:** Phase 2 (Automation) — GHL sub-account, 4 pipelines, comms sequences, first transcript
**Weeks 9-12:** Phase 3 (Compounding) — cohort delivery through platform, evaluation ordering, CBH inquiry flow, parent-visible dashboard

**Week 12 = August 10, 2026** — doubles as August walkthrough per `STL-10-of-10-Readiness-Plan.md`.

---

## § 9 — Demo Flow for Margin

1. Open the mockup — full-screen browser
2. Scroll the ladder — "Every tier of your business as a customer sees it. Five entry points. One methodology."
3. Live gate demo — click play on Release lesson. Watch the gate drop.
4. Advocacy log peek — "This is you, publicly. Not names — but the *pattern* of your work, made visible."
5. Intake modal from any CTA — walk through 4 steps. "One modal. Five products. Every intake tagged, tracked, routed."
6. Dashboard peek — "This is your Monday morning read. Automated."
7. Final CTA — "This site plus operating brain plus GHL stack plus transcript cadence — that's the $30K package. The site alone is Phase 1."

---

## § 10 — Hard Rules

- **No marketing voice.** Zero "elevate," "unlock," "transform" on the live site.
- **No minor names on public surfaces without consent.** Mockup roster is illustrative.
- **No promise language.** "The record is the reference."
- **No CBH auto-approval.** Every application to Margin personally per `cbh-advocacy`.
- **Mobile-first.** 375px minimum tested.
- **The intake modal is the ONE conversion surface.** Every product route runs through the same 4-step flow.

---

*v1.0 — 2026-06-28. The rebuild is Phase 1 of the STL Platform Build Plan. The mockup is the design source-of-truth. The playbook is the production execution guide.*
