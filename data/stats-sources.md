# Stats & Coverage Sources — hooks-os

This file names the actual data sources the weekly athlete-brand-pipeline cadence pulls from. Referenced by `skills/athlete-brand-pipeline/SKILL.md` Sunday step ("Game performance read") and by `skills/cbh-advocacy/SKILL.md` pre-call brief production.

---

## MaxPreps — Primary Stats Feed (National Coverage)

**What it covers:** Week-by-week game stats for high school athletes across the roster, nationally. This is the baseline source for every HS-level athlete in `data/athletes/_training-clients/` and any HS-age athletes in `data/athletes/_management-clients/` — especially those outside the DFW area where DMN coverage doesn't reach.

**For DFW-area athletes specifically, see the Dallas Morning News section below** — DMN often carries the same game's stats and is already part of Margin's manual workflow, so the two get cross-referenced rather than treating MaxPreps as the sole source. **When the two disagree, MaxPreps is the tiebreaker — it's the more verified source.** DMN stays valuable for narrative/feature coverage and as a secondary stat check, but MaxPreps numbers go in the record when there's a conflict.

**What the agent pulls:**
- Box score stats per game (receptions, yards, TDs, tackles, etc. — position-dependent)
- Season cumulative stats
- Team schedule + results
- Roster verification (confirms athlete is listed under the right team/year)

**How it's used:**
- Feeds `data/athletes/[X]/season-tracker.md` weekly entry
- Surfaces content opportunities ("athlete had a big game — content angle")
- Feeds `skills/cbh-advocacy/SKILL.md` pre-call briefs (current stats line before Margin's call)

**Access method:** Manual pull via MaxPreps team/athlete page (no public API as of this writing — confirm if TOJ has any data partnership or scraping arrangement; if not, this is a Sunday-morning manual pull task, not an automated feed). **Flag to Kyron:** if volume across 30+ athletes makes manual pull unsustainable, this is the first place to investigate a paid data feed or scraping solution.

---

## Dallas Morning News — Margin's Athletes (DFW Local Coverage + Stats)

**What it covers:** Local DFW-area high school football coverage AND stats — specifically for athletes Margin trains and/or represents. DMN carries box-score-level stats alongside feature pieces, game recaps with quotes, and recruiting writeups. **This pull is already part of Margin's existing manual workflow** — the agent is documenting and supporting an established habit, not introducing a new source.

**What the agent pulls:**
- Game stats (where DMN publishes them — often alongside or ahead of MaxPreps for DFW-area games)
- Feature articles mentioning Margin's trained/represented athletes
- Game recap quotes (coach quotes, athlete quotes)
- Recruiting-angle writeups (offers mentioned, recruiting interest noted)
- All-area / all-district recognition coverage

**How it's used:**
- Cross-referenced against MaxPreps for DFW-area athletes — **MaxPreps is the verified tiebreaker when stats conflict**; DMN's number gets noted but doesn't override MaxPreps in the record
- Feeds `data/athletes/[X]/season-tracker.md` weekly entry (stats side) alongside the narrative use below
- Feeds content opportunities — a DMN feature is a shareable, credible third-party validation (with consent + appropriate attribution/fair-use handling)
- Feeds `skills/cbh-advocacy/SKILL.md` pre-call briefs — both the stat line and the narrative context ("DMN covered him after the Week 6 game, said X") go into the brief
- Feeds the case-study library for Trainer Blueprint sales (third-party press validates the training methodology's outcomes)

**Access method:** Manual pull/monitoring of DMN's HS sports section — **this is Margin's existing workflow**; the agent's role is to make sure the pull happens consistently and the results get logged into the athlete files rather than staying in Margin's head or a separate untracked habit. **Copyright note:** per TOJ's standing copyright rules, the agent never reproduces DMN article text beyond a short attributed quote (under 15 words) — summarize the coverage, link to the source, don't republish. Stats themselves (numbers) aren't copyrightable in the same way and can be logged directly.

---

## Scope Note — DMN Is Margin-Specific

This file lives in `hooks-os` because Dallas Morning News coverage is specifically relevant to Margin's DFW-based athletes. **This source does not apply to Joshua's repo (Saarland, Germany — DMN has zero relevant coverage) or to Max's repo (NJ/NY — different local paper would apply if needed).** If Max's repo eventually needs an equivalent local-press source for NJ/NY, that gets its own `stats-sources.md` entry in `patterson-os`, not a network-level standard — this is a per-market detail, not a shared pattern.

MaxPreps, by contrast, **is** a shared pattern — any client with HS-age athletes benefits from the same source. Future clients with HS rosters should get a MaxPreps reference in their own `stats-sources.md`, copied from this template.

---

## Weekly Pull Checklist (Sunday Morning, Before the Roster Pulse)

- [ ] Pull MaxPreps box scores for every HS-age athlete who played this week
- [ ] Pull Dallas Morning News stats + coverage for DFW-area athletes (per Margin's existing manual workflow)
- [ ] Cross-reference MaxPreps vs. DMN stats for DFW athletes — **if they disagree, MaxPreps wins** (more verified); log DMN's number as a footnote only, don't let it override the record
- [ ] Search DMN for any feature/narrative coverage mentioning Margin's athletes beyond the box score
- [ ] Cross-reference: any athlete with a standout stat line AND DMN feature coverage = priority content + advocacy opportunity this week
- [ ] Log findings into each athlete's `season-tracker.md`
- [ ] Flag standout performances to the Monday content-brief step

---

*This file is a config/reference, not a skill. It's read by `athlete-brand-pipeline` and `cbh-advocacy` — it doesn't run on its own. Update it if Margin's athlete roster expands into other states/markets with their own dominant local-press outlet.*
