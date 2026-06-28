# Engagement Monitoring — Skill

How the agent processes weekly engagement across STL/CBH's **three parallel funnels** and feeds patterns back into voice, content, and the TOJ Operational Transcript. **Elevated mode** by default — Margin's audience scale and the apex credential's public visibility both justify this from day one.

---

## Why This Skill Runs Differently Here

Most client repos run one or two funnels. Margin's repo runs three: athlete (CBH apex), trainer (Trainer Blueprint), athlete-brand/NIL (the strategic-unlock partnership). The Monday review has to read engagement signal across all three without losing the thread on any one.

---

## What Gets Reviewed Every Monday

| Source | Funnel | What It Tells the Brain |
|---|---|---|
| STL community channels (IG, etc.) | Trainer + general brand | Reach, content resonance, Trainer Blueprint interest signal |
| CBH-specific content engagement | Athlete (apex) | Demand for personal access, advocacy-credibility signal |
| Trainer Blueprint landing page / inquiry form | Trainer | Application funnel health |
| Athlete-brand-pipeline content (per managed athlete) | Athlete-brand/NIL | Per-athlete performance — feeds the weekly roster pulse in `skills/athlete-brand-pipeline/SKILL.md` |
| Coach database inquiries | Athlete (apex) | College-side demand signal |
| Inbound emails | All three | Parent, coach, trainer-candidate, and partnership inbound |

---

## The Three-Funnel Monday Read

Unlike single-funnel repos, this review explicitly separates signal by funnel before synthesizing:

### Funnel 1 — Athlete (CBH apex)
- Inquiry volume for personal access
- Advocacy-call outcomes (cross-reference `skills/cbh-advocacy/SKILL.md` weekly report)
- Evaluation requests

### Funnel 2 — Trainer (Trainer Blueprint)
- Applications received, qualifying calls booked
- STL Certified Trainer network engagement
- Content performance on Blueprint-marketing pieces

### Funnel 3 — Athlete-Brand/NIL
- Cross-reference the weekly roster pulse from `skills/athlete-brand-pipeline/SKILL.md` — this funnel has its own dedicated weekly report; engagement monitoring here adds the public-facing content-performance layer on top

---

## What the Agent Produces

`output/reports/engagement-[YYYY-WW].md`:

```
## Week [WW] Engagement Pulse — [DATE]

### Funnel 1 — Athlete (CBH)
- [Signal] → [proposed action]

### Funnel 2 — Trainer (Blueprint)
- [Signal] → [proposed action]

### Funnel 3 — Athlete-Brand/NIL
- See athlete-brand-pipeline weekly roster pulse for detail; cross-funnel content notes here

### Conversion Read
- Where did engagement → action this week, across any funnel?
- Where did it evaporate?

### Patterns Worth a Rule Change
- [Pattern] → [proposed file edit] → awaiting approval

### Flagged to Kyron / Margin
- [Anything needing attention]
```

---

## What Feeds the TOJ Operational Transcript

Generalizable patterns (no PII, no client-specific copy, no revenue figures) push to `data/engagement/toj-transcript-candidates-[YYYY-WW].md`. Given this repo's apex-tier status and the first-of-its-kind athlete-brand pipeline, **patterns observed here are likely to set precedent for future apex-tier clients** (e.g., a future Premier Athletes repo) more than for high-audience-tier clients.

---

## What This Skill Does NOT Do

- Does not auto-edit voice/content skills — proposes only.
- Does not respond to comments/DMs in real time.
- Does not report vanity metrics without an attached action.
- Does not replace the dedicated athlete-brand-pipeline weekly roster pulse — it complements it.

---

*Elevated mode, three-funnel structure, apex-tier precedent-setting. The Monday review here carries more weight than in any other repo in the network.*
