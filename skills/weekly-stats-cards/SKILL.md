# Weekly Stats Cards — Skill

> **⬢ Operating altitude:** `T` · Template-driven data cards · fully specified · fully evaluable<br>
> **⬢ Trusted-agent spec (7Q):** shadow-pending · see [`_trusted-agent-spec.md`](../_trusted-agent-spec.md) · full protocol [/framework-ops#spec](https://fbtrainer-tojcampaign.vercel.app/framework-ops#spec)


**One paste in. One canonical stat file. One branded card pack out. One approval doc for Margin.**

Retires the iPhone Notes screenshot workflow. Kills name-variant drift. Makes Sunday-night marketing deterministic, on-brand, and legible to the entire signed roster + training-client base.

This skill is narrower than `skills/athlete-brand-pipeline/SKILL.md` — that skill runs the strategic weekly roster pulse. **This skill produces the visual assets.** They cross-reference each other. They do not duplicate logic.

---

## Purpose

Every week during the season, Margin publishes a stat rollup for his signed and training athletes. The current motion is: type stat lines into iPhone Notes → screenshot → post the raw screenshot to his 25.2K-follower Twitter. No branded card. No canonical file. Name variants drift. Schools abbreviate inconsistently. No per-athlete leaderboard. No seasonal rollup.

This skill replaces that motion with a repeatable pipeline: **raw paste → canonical stat file → branded card pack → approval brief → Margin ships.** Every athlete stat that flows through the skill also updates that athlete's season-tracker file, so the roster picture stays current without a second data-entry pass.

---

## When This Runs

- **Sunday nights by default.** Game data materializes over the weekend; Sunday is when the pack ships for Monday-morning review and Monday-through-Wednesday distribution.
- **On-demand any day** when a raw paste lands in `data/inbound-stats/YYYY-WW-raw.txt`. The parser is idempotent — a re-run overwrites the same-week canonical file cleanly and re-generates the card pack.

The Monday engagement review (`workflows/weekly-engagement-review.md`) reads Sunday's `output/reports/YYYY-WW-card-brief.md` when measuring which cards drove engagement — that's the feedback loop.

---

## Voice Contract

Card copy — captions, tweet drafts, IG copy in the brief — routes through `skills/margin-voice/SKILL.md`. Same voice rules, same hard lines. Card **art** is template-driven — brand tokens locked, typography locked, no per-card creative variance.

Register per surface:
- **Twitter card copy** — Margin's coach voice, short, one idea per line.
- **IG caption drafts** — coach voice, room for a two-beat opener, always closes with a "Coached by Hooks" line-of-sight.
- **Leaderboard card** — no copy per row; ranked list only. The card IS the message.

The agent never invents a stat, a school, or a coaching quote.

---

## The One-Input Rule

The skill accepts exactly one form of weekly input, in one location:

```
data/inbound-stats/YYYY-WW-raw.txt
```

Two acceptable formats inside that file:

**Format A — Raw paste (Margin's Notes-app export).** Free-form stat lines, one athlete per line, mixed formats acceptable. Examples:

```
Kaydon Finley Aledo HS 5-157-2
Mason James North Norman HS 10-144-2
Trenton Yancey Duncanville HS 4td 187apy
Braylon Reed M.Lakeridge 8-89-1
```

**Format B — Structured YAML block.** For weeks where Margin (or Kyron) prefers to hand-structure the input:

```yaml
week: 8
season: 2025
lines:
  - name: Kaydon Finley
    school: Aledo HS
    rec: 5
    yds: 157
    td: 2
```

The parser (`scripts/parse-stats.mjs`) accepts either format and lands one canonical file at `data/stats/YYYY-WW.md`. If any name comes in unmatched against `data/stats/canonical-athletes.md`, the parser flags it as `PENDING-MATCH` and exits with a non-zero code. **Kyron reconciles before ingest completes.** No cards generate until the canonical file is clean.

---

## The Two Outputs

Every run produces exactly two output surfaces:

**1. Card assets** — `output/cards/YYYY-WW/*.png`

Four card templates per qualifying athlete + one leaderboard + one optional offer-add:

| Template | Dimensions | Purpose |
|---|---|---|
| `single-athlete-ig.png` | 1080×1350 | IG feed post per athlete |
| `single-athlete-twitter.png` | 1200×675 | Twitter post per athlete |
| `leaderboard-top10-ig.png` | 1080×1350 | Weekly top-10 ranked list |
| `offer-add-ig.png` | 1080×1350 | Offer announcement (manual flag only for v1) |

**2. Approval brief** — `output/reports/YYYY-WW-card-brief.md`

One markdown doc per week containing:
- Week summary (X athletes played, Y highlights, Z APY-tier stat lines)
- Per-card block: preview thumbnail reference, athlete context, consent status, tweet draft, IG caption draft
- Consent-pending section (any cards blocked by missing consent — flagged red)
- Offer-add recommendations (Kyron flags manually for v1)
- Anything requiring Margin's attention before shipping

---

## Approval Gate (Hard Rule)

**The skill never publishes. Ever.**

Every card pack lands as drafts in `output/cards/YYYY-WW/`. The brief lands in `output/reports/`. Kyron reads the brief, approves individual cards, then either:

1. Hands the approved cards + drafts to Subject Media crew for scheduling per `skills/subject-media-coordination/SKILL.md`, OR
2. Posts them himself from the file.

No script, no agent, no automation in this skill ever POSTs anywhere. The scripts write to `output/` only. That is enforced in code (`scripts/parse-stats.mjs` and `scripts/build-cards.mjs` have no network POST paths) and enforced in this SKILL.md as a hard rule.

If a future automation layer adds scheduled publishing, it lands in a separate skill with its own approval gate. It never lives here.

---

## Consent Check

Before generating any card, the agent reads the athlete's profile.md.

**For `_management-clients/` (signed adult athletes — NFL + Power 4):**

- Required: `consent_public_stats: true` in the athlete's profile.
- Missing or false → card generates into `output/cards/YYYY-WW/_pending-consent/` and gets flagged red in the brief. Margin sees it flagged; nothing ships from `_pending-consent/`.

**For `_training-clients/` (HS + youth — minors by default):**

- Required: **both** `consent_public_stats: true` **and** `guardian_signed_release_on_file: true`.
- Missing either → card does not generate at all. Athlete appears in the brief with a note flagging the missing consent and directing Kyron to secure it before next week.

This is not a soft rule. Missing consent on a minor's card would be a brand-ending mistake — and the whole system is designed to make that impossible.

---

## Canonical Athletes File (Source of Truth for Name Resolution)

`data/stats/canonical-athletes.md` is the single lookup table. Every athlete_id used anywhere in this skill exists there first. The parser reads the file, matches raw-paste names against the `variants` list per athlete, and resolves to the canonical id.

When Margin's paste contains a variant that isn't in the file (`"Braylun Reed"` when only `["Braylon Reed", "B. Reed"]` are known), the parser flags `PENDING-MATCH` and exits with code 1. Kyron adds the variant to the file OR corrects the paste, then re-runs.

**Why this matters:** Margin's audience already has drift ("Braylun" vs "Braylon", "Mans. Lakeridge" vs "M.Lakeridge"). Every card that ships with a variant deepens the drift. Locking to one canonical name per athlete tightens the season-long record — which becomes the case-study material for CBH the year after.

---

## Boundary vs `athlete-brand-pipeline`

**No overlap.** These two skills operate at different altitudes on the same data:

| Concern | `athlete-brand-pipeline` | `weekly-stats-cards` |
|---|---|---|
| Weekly roster pulse (Monday) | ✅ Owns it | ❌ Reads its output |
| Stats ingestion + canonical file | ❌ Reads canonical file | ✅ Owns it |
| Card asset generation | ❌ Coordinates approvals | ✅ Owns it |
| NIL deal pipeline | ✅ Owns it | ❌ Not in scope |
| Content brief writing for strategic pieces | ✅ Owns it | ❌ Not in scope |
| Card copy voice-check | ❌ | ✅ (via `margin-voice`) |
| Per-athlete season rollup | ❌ Reads it | ✅ Writes it (via rollup script) |

If it's a strategic content decision → `athlete-brand-pipeline`. If it's a card asset with structured stat data → this skill.

---

## Template-Driven Exception to `subject-media-coordination`

`skills/subject-media-coordination/SKILL.md` establishes a hard rule: **the agent orchestrates, humans/creators produce.** Weekly stat cards are the one explicit exception.

**Why the exception holds:** the card templates are authored once (by Margin + Kyron, during the initial calibration pass), the brand tokens are locked (STL navy + gold + cream, Anton + Fraunces + JetBrains Mono), and the agent's role is filling structured data into a template that has no editorial or narrative judgment left in it. This is data visualization, not creator work.

Editorial pieces, narrative assets, highlight edits, photo shoots, feature reels — all remain SubjectSkillz creator territory. If a "card" ever grows an editorial element (a voice pull-quote, a per-athlete narrative frame), it graduates out of this skill into a `subject-media-coordination` brief.

---

## Cadence

- **Sunday nights** — locked. Kyron confirmed 2026-07-17. Weekend games materialize, Sunday-night ingest builds the pack, Monday-morning read + distribution.
- **On-demand** — any day a raw paste is dropped at `data/inbound-stats/YYYY-WW-raw.txt`.
- **Never:** Cards do not backfill retroactively without Kyron's flag. If Margin missed a Sunday, the following Sunday's card can include a "last-week catch-up" section — but the brief calls it out explicitly so it doesn't read as fresh.

---

## Consent Policy Defaults (v1.1)

Kyron confirmed 2026-07-17: **Varsity, College, and NFL athletes default to `consent_public_stats: true`** in `data/stats/canonical-athletes.md`. This reflects the standing understanding — public game footage + public stats + public-record recognition is the medium these athletes already compete in. Individual overrides (an athlete asks to be held back from a specific card) get flagged per-athlete.

Minors on `_training-clients/` still need **both** `consent_public_stats: true` AND `guardian_signed_release_on_file: true` — no default. That gate does not move.

---

## Multi-Channel Drafts (v1.1)

The card brief now includes drafts for **four surfaces per card**:

- **Twitter** — coach voice, one idea, short line.
- **IG caption** — coach voice, two-beat opener, closes with "Coached by Hooks" line-of-sight.
- **LinkedIn** — professional register · same stat frame · adds one line of program context (school, class year, position). Longer-form, no hashtags.
- **Threads** — conversational, first-person as Margin, 1-2 short lines, no hashtags.

Kyron picks which surfaces run per card during approval. Nothing publishes.

---

## Offer-Add Auto-Trigger (v1.1)

Kyron confirmed 2026-07-17: **offer-add cards auto-generate.** Two triggers, both surfaced in the weekly brief:

1. **First-appearance detection** — an athlete whose `athlete_id` was NOT present in the last 4 weekly stat files gets an offer-add card. This catches new signees, transfers-in, and returning athletes coming off injury.
2. **Status change** — an athlete whose `status` field changed to `committed` or `signed` since the last ingest gets an offer-add card announcing it.

Both trigger paths are diff-based (compare current week to prior weeks), computed by `build-cards.mjs` at build time. Auto-flagged cards land in `output/cards/YYYY-WW/_offer-add/` with a `[REASON]` prefix in the filename so Kyron can filter fast (e.g., `first-appearance-kaydon-finley-ig.png`).

**Offer-add cards still never publish automatically.** They land as drafts like every other card. The auto-trigger is about *detection*, not *distribution*.

---

## Headshots (v1.1)

**v1 renders text-only cards.** Kyron will upload headshots as they come in.

Portrait convention:
- Location: `assets/portraits/{athlete_id}.jpg` (or `.png`, `.webp`)
- Aspect: 1:1 square, 800×800 minimum, subject centered
- Missing portrait → card renders with a gold-tinted silhouette placeholder (no visible "missing image" defect).
- Portrait present → card renders with the athlete's photo in a circular crop, top-of-card.

The template detects the file's presence at build time. No config change required when a portrait lands — drop it in `assets/portraits/`, re-run `build-cards.mjs`, next card generation picks it up.

---

## Edge Cases

- **Unmatched name.** Parser flags `PENDING-MATCH`, exits 1. Kyron adds a variant or corrects the paste. Re-run.
- **Athlete graduated mid-season.** Their entry in `canonical-athletes.md` gets `status: committed` or `status: signed`. Their cards continue generating unless `status: inactive` is set.
- **APY-only row** (Trenton Yancey pattern — 4td, 187apy, no rec/yds). Parser writes rec/yds as blank and marks `notes: APY marker`. Card template uses the APY line as the giant number instead of yds. The template picks the "hero stat" based on presence: `td` > `apy` > `yds` > `rec`.
- **Dual-position athlete** (rare — a WR who also returns punts, or a two-way player). Parser accepts multiple stat blocks per athlete in a week. The card template picks the primary position's stat line for the "hero card" and the brief includes a note about the secondary line.
- **Athlete with no consent on file.** `_management-clients/` — card lands in `_pending-consent/`. `_training-clients/` — no card at all; athlete listed in brief with consent-missing note.
- **Bad/malformed paste line.** Parser retains the line as `_parse_failed` with the raw text preserved, writes to the canonical file's diagnostic block, exits 1. Kyron cleans up.
- **Two athletes with same name.** Canonical id is `[firstname]-[lastname]` by default, disambiguated by school when needed (`kaydon-finley-aledo` vs `kaydon-finley-north-crowley`). Variants list handles it — always resolve to the id, never the display name.
- **Off-week (bye).** Athlete has no line in the paste. No card generated. Season tracker updated with `week_N: BYE`.

---

## Success Criteria (Per Run)

- [ ] `data/stats/YYYY-WW.md` exists, valid, all names resolved to canonical ids, zero `PENDING-MATCH` rows.
- [ ] `output/cards/YYYY-WW/` contains exactly the expected card files (per-athlete IG + Twitter + leaderboard + any manual offer-add flags).
- [ ] `output/cards/YYYY-WW/_pending-consent/` holds any consent-blocked cards, clearly separated.
- [ ] `output/reports/YYYY-WW-card-brief.md` reads cleanly, tweet + IG drafts on-brand, consent-flags red.
- [ ] Each athlete's `stats-season-YYYY.md` in their `_management-clients/` or `_training-clients/` folder has the new week appended and season totals recomputed.
- [ ] Nothing left the repo. No POSTs. No publishes.

---

*The Notes-app screenshot dies with this skill. The season-long stat record becomes an asset that reinforces every advocacy call, every case study, every future Trainer Blueprint sale.*
