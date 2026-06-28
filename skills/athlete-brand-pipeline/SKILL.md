# Athlete Brand & NIL Pipeline — Skill

The strategic unlock of the TOJ × Margin partnership. **Margin has 6 NFL + 30+ Power 4 college athletes signed to player management. TOJ becomes Margin's internal marketing partner on their personal brands + NIL deals.** This skill encodes how the agent runs that pipeline at scale during the playing season.

This is a **first-of-its-kind capability** in the TOJ network. It does not exist in Joshua's or Max's repos. Patterns proven here graduate into a standalone TOJ service product after the first season cycle.

---

## What's Different About Managed Athletes vs Training Clients

| Dimension | Training Client (typical youngblood-os athlete) | Managed Athlete (Margin's roster) |
|---|---|---|
| Relationship | Trainer ↔ athlete | Manager ↔ athlete + brand build partner |
| Athlete role | Receives coaching | Already a public-facing competitor |
| Audience | Parent (decision-maker) | Athlete (decision-maker, if 18+) |
| Content | Training session footage | Game footage + lifestyle + brand storytelling |
| Revenue Source | Training fees + Prospect Edge eval | NIL deals · sponsorship · royalties · appearance fees |
| Brand maturity | TBD or none | Often pre-existing — refresh / refine / amplify, don't construct from zero |
| Consent | Parent consent flag | Athlete signs directly (adult); image rights and brand rights tracked per deal |
| Compliance | Amateurism rules (HS) | NIL rules (college) · NFLPA / NFL agent rules (pro) |
| Timeline | Multi-year development | Season-cycle urgency · deals close during season or not at all |

**Implication:** the same architectural muscles apply (voice, content, evaluation, outreach, engagement), but the audience, the consent model, the legal stack, and the urgency are different. The agent treats managed athletes as a separate audience class throughout.

---

## The Athlete Folder Structure (one per managed athlete)

```
data/athletes/_management-clients/[lastname]-[firstname]/
├── profile.md              ← bio, signed-since date, position, team, agent (if any), NIL counsel
├── brand-identity.md       ← v1 brand snapshot — voice, visual direction, content pillars, audience
├── season-tracker.md       ← week-by-week performance, content delivered, deals closed
├── consents/
│   ├── content-rights.md   ← what TOJ can produce + post
│   ├── image-rights.md     ← per-shoot, per-deal
│   ├── nil-counsel.md      ← who reviews deals
│   └── communications.md   ← preferred channels, response cadence expectations
├── nil-deals/
│   ├── active/             ← currently running deals · deliverables · payment status
│   ├── pipeline/           ← in-conversation, sent contracts, awaiting signature
│   ├── closed/             ← completed deals — for case-study / track record
│   └── declined/           ← deals we walked away from + reason
├── content/
│   ├── [YYYY-MM-DD]-[type].md   ← per-piece content briefs (Margin-voice draft → athlete approval → SM production)
│   └── calendar.md         ← rolling 4-week cadence
├── advocacy-log.md         ← Margin's college coach calls + NFL contacts made on this athlete's behalf
└── index.yaml              ← machine-readable summary: status, active deals, content cadence, attribution
```

**Every managed athlete gets this folder** at minimum the day TOJ joins the partnership for that athlete. Folder is populated through the onboarding flow in Section 3 of this skill.

---

## Onboarding a Managed Athlete (the "intake-light" for athletes)

This is NOT the full Trail of Joy Campaign Intake — managed athletes already have a relationship with Margin. The athlete intake is a tighter 4-step process that captures what's needed for brand + NIL pipeline operation.

### Step 1 — Verify the relationship (Day 0)
- Confirm athlete is signed to Margin's player management.
- Confirm athlete has agreed to TOJ joining as internal marketing partner.
- Confirm NIL counsel routing (if college) or agent routing (if pro).

### Step 2 — Public dossier (Day 1)
- Pull verified record: stats, accolades, current team, contract status, existing brand footprint (social handles, follower counts, recent campaigns).
- Note any pre-existing brand deals, sponsorships, exclusive arrangements that constrain new deals.
- Note any pending compliance flags (NIL collective relationships, transfer portal status, etc.).
- **Saved to `data/athletes/_management-clients/[athlete]/profile.md`**

### Step 3 — Athlete intake call (Day 2–3, 30 min)
Shorter than a trainer intake. Six questions:
1. What do you want your brand to be known for, beyond your performance on the field?
2. What deals are you currently in? What's exclusive vs open?
3. Who handles your NIL / agent comms? When TOJ proposes a deal, what's the routing?
4. What content do you NOT want produced about you? (Family, off-field life, religion — any hard lines.)
5. What's your communications preference for routine touch (text, email, voice memo)? Response time you can sustain during season?
6. What's the 12-month picture you want to walk into?

Saved to `data/athletes/_management-clients/[athlete]/brand-identity.md`.

### Step 4 — Brand v1 + Consent package (Day 5–7)
- Brand identity v1 written (positioning, voice signature, visual direction, content pillars).
- Consent package delivered for signature (content rights, image rights, communications preferences).
- First content brief produced for athlete review.
- Athlete approves brand v1 in writing before any external content ships.

---

## The Weekly Cadence (Per Managed Athlete, During Season)

Each managed athlete has a weekly motion that runs automatically (with required human checkpoints):

| Day | Activity | Output | Approval Required? |
|---|---|---|---|
| Sunday (post-game) | Game performance read + content opportunity identification. **Stats pulled from MaxPreps (national baseline) cross-referenced with Dallas Morning News (DFW-area stats + feature coverage — part of Margin's existing manual workflow)** — see `data/stats-sources.md` for the full pull protocol. | `data/athletes/[X]/season-tracker.md` weekly entry | No |
| Monday | Content briefs for the week drafted | `data/athletes/[X]/content/[date]-[type].md` | **Yes — athlete approves before SM produces** |
| Tuesday | NIL pipeline review — new opportunities, pending deals, expiring offers | `output/reports/nil-pipeline-[YYYY-WW].md` | Kyron + agent/counsel approve before athlete outreach |
| Wednesday–Friday | Content production by Subject Media · deals progressed | Asset deliverables · deal docs | Athlete approves final assets before SM posts |
| Saturday | Pre-game content + storyline coordination | `data/athletes/[X]/content/[date]-pre-game.md` | Athlete confirms or skip-weeks |

This cadence runs for **every managed athlete** the partnership covers. **Six NFL + 30+ P4 = 36+ parallel weekly cadences.** That's the scale challenge the system has to absorb. The skill is built for it; the operational test is the first full season.

---

## NIL Deal Pipeline Management

```
PROSPECT  →  OUTREACH  →  PROPOSAL  →  NEGOTIATION  →  CONTRACT  →  DELIVERABLES  →  PAYMENT  →  CASE STUDY
```

Each stage has its own file in `data/athletes/[X]/nil-deals/pipeline/[deal-name]/`:

- `brief.md` — brand, athlete fit, proposed scope, proposed value
- `comms-log.md` — every touch with the brand
- `contract-drafts/` — versions tracked
- `compliance-check.md` — NIL counsel review (college) or NFLPA/agent review (pro), with sign-off
- `deliverables.md` — what's owed, due dates, status
- `attribution.md` — TOJ revenue share documentation

**Rules that always apply:**

1. **No deal proposed to an athlete without compliance pre-check.** NIL counsel for college; agent + NFLPA-aware review for pro. Skip this step and the partnership ends.
2. **No deal closed without athlete's explicit written approval.** Text confirmation is not enough — sign-off in a document trail.
3. **Exclusivity is sacred.** Before proposing a deal, check `consents/` for category exclusivity that might conflict. A missed exclusivity flag is the kind of mistake that triggers lawsuits.
4. **Payment terms get tracked.** NIL deals notoriously slip on payment. Every contracted payment date logs to a watch list; missed payments escalate to Kyron immediately.
5. **TOJ revenue attribution per the partnership agreement.** Logged in `attribution.md` per deal. Quarterly reconciliation.

---

## Content Production Coordination

The agent does NOT produce final content for managed athletes. Subject Media + SubjectSkillz creators do. The agent's role:

1. **Brief writing** — content brief for each piece, athlete-approved before SM starts.
2. **Voice quality-check** — assets get checked against the athlete's brand-identity.md voice spec.
3. **Compliance check** — caption copy reviewed against NIL/NFLPA rules and athlete's hard lines (`brand-identity.md` §4).
4. **Posting cadence orchestration** — coordinate timing across the athlete's own channels and STL channels.
5. **Performance tracking** — what landed feeds `skills/engagement-monitoring/SKILL.md` Monday review.

Content lives in two places after production:
- Athlete's own channels (their distribution)
- STL channels when the athlete is featured in STL-branded content

**Cross-channel content rules** — when an athlete appears in STL content, their brand benefits from STL's reach. When STL features an athlete, STL's brand benefits from the athlete's credentials. The exchange is logged in `data/cross-brand-touches.md`.

---

## What the Agent Tracks Across the Whole Roster

`output/reports/athlete-roster-weekly-[YYYY-WW].md` — every Monday, a cross-roster summary:

```
## Roster Pulse — Week [WW]

### Performance
- [athlete count] athletes played this week. [X] highlights worth content. [X] required quiet handling (injury, off-game, off-field).

### Brand Build
- Content delivered: [X] pieces across [Y] athletes
- Athlete approvals outstanding: [list]
- New brand-identity reviews needed: [list]

### NIL Deal Pipeline
- New prospects: [X]
- Proposals out: [X]
- In negotiation: [X]
- Closed this week: [X], totaling $[value]
- Payment issues: [list]
- Compliance flags: [list]

### Advocacy
- Margin advocacy calls this week: [X], on behalf of [athletes]
- College coach inbound mentioning Margin's athletes: [X]

### Flagged to Kyron
- [Anything that needs Kyron's attention before Margin's]
```

This is Kyron's read of the entire portfolio in 5 minutes. Margin sees the same report — what's working, what needs his attention.

---

## Hard Rules (Network-Level)

- **Never fabricate stats, performance reads, or testimonials about an athlete.**
- **Never propose a deal that conflicts with active exclusivity.** Compliance pre-check is non-negotiable.
- **Never close a deal without the athlete's explicit written approval.**
- **Never post content the athlete has not approved.** Even if "obviously fine."
- **Never share an athlete's draft contract, deal value, or negotiation status outside the partnership chain.** TOJ + Margin + athlete + their counsel. No one else.
- **Never compare two managed athletes in public-facing content.** Internal notes can be honest. Public is never at one athlete's expense.

---

## Cross-Pollination With Other Skills

- **`skills/cbh-advocacy/SKILL.md`** — when Margin's advocacy call is on behalf of a managed athlete, the log entry references both the athlete's folder AND the advocacy log. The two feed each other.
- **`skills/prospect-edge-workflow/SKILL.md`** — managed athletes (especially those with pro draft prospects in their HS/college history) may have legacy PE evaluations worth pulling forward as brand assets.
- **`skills/subject-media-coordination/SKILL.md`** — athlete content runs through SM. The brief flow is owned here; production is owned there.
- **`skills/engagement-monitoring/SKILL.md`** — per-athlete engagement reads feed the brand-build calibration. Voice landings, content performance, deal-conversion signal.

---

## Calibration

This skill is v1.0 — the first season is the source of truth. Patterns observed across 36+ athletes generate the TOJ Operational Transcript candidates that eventually graduate this skill into a standalone TOJ service product.

Likely calibration vectors:
- Which content formats drive NIL inbound vs. just engagement.
- Which athlete-brand archetypes (storyteller / craftsman / community / faith) convert deals at higher rates.
- Optimal weekly cadence per athlete (some hit 5 posts/week, some 1).
- Payment-collection patterns across NIL collectives vs direct brand deals.
- Compliance failure modes — what types of deals nearly trigger violations.
- The relationship between Margin's advocacy calls and athlete deal closings.

All of it logs through the Monday roster pulse → improvements.md → TOJ Operational Transcript.

---

*This is the highest-value-add skill in this repo by an order of magnitude. The first 90 days of running it set the standard for every athlete-management engagement TOJ will run for the next decade.*
