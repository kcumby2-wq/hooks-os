# Improvements Log

*The agent logs every rule change here with the feedback that drove it. Git history + this file = the audit trail of the brain getting smarter.*

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

## 2026-07-17 — v1.1 addition: `skills/weekly-stats-cards/`

**Feedback that drove this:**
> "Right now Margin's weekly stat marketing works like this: he types stat lines into iPhone Notes, screenshots the list, posts the raw screenshot to his 25.2K-follower Twitter. Every week. Name variants drift ('Braylun' / 'Braylon', 'Mans. Lakeridge' / 'M.Lakeridge'), schools get abbreviated inconsistently, no branded card wraps the stats, no per-athlete leaderboard, no offer-add trigger, no rollup for the season."

**What changed:**

New skill `skills/weekly-stats-cards/SKILL.md` retires the iPhone-Notes-screenshot workflow. One canonical stat file per week (`data/stats/YYYY-WW.md`) — one branded card pack per week (`output/cards/YYYY-WW/`) — one approval brief per week (`output/reports/YYYY-WW-card-brief.md`).

Three standalone Node scripts encode the pipeline:

- `scripts/parse-stats.mjs` — accepts raw paste or structured YAML, resolves every name against `data/stats/canonical-athletes.md` (single lookup table), exits code 1 on any `PENDING-MATCH`. Uses Anthropic SDK + `claude-haiku-4-5` for free-form parsing.
- `scripts/build-cards.mjs` — Playwright + Chromium renders four card templates (single-athlete IG 1080×1350, single-athlete Twitter 1200×675, leaderboard top-10 IG, offer-add IG) with STL brand tokens locked (navy #0B1D3A · gold #E4B23C · cream #F5F1E8) and Anton + Fraunces + JetBrains Mono + Manrope typography embedded from local woff2. No Google Fonts fetch at runtime.
- `scripts/rollup-athlete-stats.mjs` — idempotent per-athlete season file update (`data/athletes/[folder]/stats-season-YYYY.md`) after every ingest.

**Boundary contracts:**

- Does NOT overlap with `athlete-brand-pipeline` — that skill runs the Monday strategic roster pulse; this skill produces the visual asset pack. Both skills now cross-reference each other.
- Explicit exception clause added to `subject-media-coordination/SKILL.md` — template-driven data cards are agent-produced final assets by design; editorial and narrative pieces remain creator territory.

**Hard rules encoded:**

- **The skill never publishes.** Writes to `output/` only. No POST paths in code.
- **Consent gate.** Adult athletes need `consent_public_stats: true`; minors need both that AND `guardian_signed_release_on_file: true`. Missing on a minor → no card renders at all.
- **PENDING-MATCH blocks the pipeline.** Every name resolves through the canonical file or Kyron reconciles first.

**Files touched:**

- New: `skills/weekly-stats-cards/SKILL.md`, `data/stats/canonical-athletes.md`, `scripts/parse-stats.mjs`, `scripts/build-cards.mjs`, `scripts/rollup-athlete-stats.mjs`
- Updated: `CLAUDE.md` (rule 15 added, subsequent rules renumbered), `workflows/daily.md` (Sunday stats-cards mode), `workflows/weekly-engagement-review.md` (Monday reads Sunday's card brief), `config.md` (`athlete_brand_pipeline.stats_sources` → `data/stats/`), `skills/athlete-brand-pipeline/SKILL.md` (cross-ref), `skills/subject-media-coordination/SKILL.md` (exception clause)

**Why now:**

TOJ Campaign × hooks-os federation integration. The stat-card motion is the most visible weekly artifact in Margin's marketing — retiring the Notes-app workflow before the August 10 pre-season deadline makes the operating-brain visible to the audience the same week the platform switches on. The season-long canonical stat record also becomes the case-study substrate that reinforces every CBH advocacy call and every future Trainer Blueprint sale.

**Open questions carried forward to Kyron:**

1. Preferred cadence — Sunday night default is proposed; alternative Monday-morning or on-demand-only is open.
2. Headshot library for the athletes — v1 renders without headshots. If Margin has an image bank, v2 adds a portrait placeholder slot to the templates.
3. `canonical-athletes.md` seeding — no cards ship until Kyron populates the file with the current roster + consent flags.
4. Offer-add trigger — v1 recommendation is manual flag only (Kyron flags in the brief). Auto-triggering from a source (new signee, transfer commit, milestone stat) is a v2 conversation.
5. Multi-channel drafts — brief includes Twitter + IG drafts. LinkedIn + Threads copy can be added in v2.
6. Retirement of the tojcampaign Roster Pulse agent — Kyron sign-off needed before deleting `agents/hooks/roles/roster-pulse.js` from tojcampaign.

---

*Future entries follow the standard shape: feedback verbatim → what changed → which file the rule lives in.*
