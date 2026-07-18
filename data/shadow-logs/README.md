# Shadow Logs — Human Job → Agent Spec

**Purpose:** Turn a human job into tested labor. Watch 10-20 real runs. Screen-record + narrate. Extract triggers, rules, handoffs, and edge cases. Build an eval set. Ship as tested labor — not vague automation.

Full method: [/framework-ops#shadow](https://fbtrainer-tojcampaign.vercel.app/framework-ops#shadow)

---

## Folder shape

```
data/shadow-logs/
├── README.md                          ← this file
├── _template/                         ← copy this to start a new shadow
│   ├── shadow-log.md                  ← the running log (one row per real run)
│   ├── recordings/                    ← screen recordings (.mp4 or link)
│   ├── narration/                     ← audio + transcript per run
│   └── eval-set.md                    ← extracted spec + eval examples
└── [job-name]/                        ← one folder per job being shadowed
    ├── shadow-log.md
    ├── recordings/
    ├── narration/
    └── eval-set.md
```

---

## First 3 jobs to shadow (priority order)

Based on ROI + strategic value per [/framework-ops#shadow](https://fbtrainer-tojcampaign.vercel.app/framework-ops#shadow):

1. **`margin-sunday-stat-sheet/`** — Margin's Sunday stat compilation workflow. Already spec'd in `skills/weekly-stats-cards/`, but a real 10-week shadow generates the eval set that proves the agent works. **Target: 10 runs by 2026-10-15.**

2. **`kyron-monday-triage/`** — Kyron's own Monday triage flow (the meta-workflow). 4 Mondays of shadow → extracted spec → next iteration of the Control Tower's automation. **Target: 4 Mondays starting 2026-07-20.**

3. **`margin-advocacy-call-log/`** — Margin's post-call log entry pattern. 10 calls shadowed → Coordinate agent for CBH advocacy. **Target: 10 calls by end of Q1 2027.**

Additional candidates queued (not yet started): Subject Media brief-writing · Kyron's discovery-call flow · Margin's parent-comms response pattern.

---

## The shadow-log format (one row per real run)

Every observed run gets one row. Keep it tight — richness comes from volume, not per-row detail.

| # | Date | Duration | Trigger | Steps taken | Decisions made | Handoffs | Edge case? | Time spent |
|---|------|----------|---------|-------------|----------------|----------|------------|------------|
| 1 |      |          |         |             |                |          |            |            |

Fields:
- **Trigger:** what set the run in motion (game weekend, inbound email, calendar event, manual pull)
- **Steps taken:** ordered list of what the human did, in their words
- **Decisions made:** where judgment was applied — the "why did I do X and not Y" moment
- **Handoffs:** anywhere the human paused to wait for another human (Margin, Kyron, client)
- **Edge case?** was this a normal run or was something unusual? What?
- **Time spent:** actual clock time

After 10-20 rows, patterns become obvious. That's the spec.

---

## The eval-set format (extracted from the shadow log)

```markdown
# Eval Set — [Job Name]

**Shadowed:** [N] runs · [date range]
**Spec version:** v1.0

## Trusted-agent spec (7Q · from shadow observations)

1. **Wakes:** [observed trigger — most common]
2. **Context:** [inputs the human referenced]
3. **Tools:** [tools/systems the human used]
4. **Autonomy:** [decisions the human made without asking anyone]
5. **Success:** [what a "good" completed run looks like]
6. **Approval gates:** [where the human paused for someone else's OK]
7. **Escalation:** [what triggered "wait, I need help on this one"]

## Eval examples (20-50 real cases)

| Case | Input (real) | Expected output | Guardrails to check | Category |
|------|-------------|-----------------|---------------------|----------|
| 1    |             |                 |                     | normal   |
| 2    |             |                 |                     | edge     |

## Pass criteria for ship

- Fail rate under [X]% on the eval set → ship-ready as tested labor
- Fail rate above [X]% → spec is wrong, not the agent. Return to shadow.
```

---

## Rules

- **Do not skip the shadow.** No spec is built from imagination. The spec is EXTRACTED from real work, not designed for it.
- **10 runs minimum. 20 preferred.** Below 10 and the edge cases stay hidden.
- **Narrate while doing.** Silent screen recordings lose the "why." Voice-over the reasoning.
- **Log the boring runs too.** The boring runs are where the automation lives.
- **Every eval example is a real case.** Never invented. If you don't have enough real cases, keep shadowing.

---

*The shadow log is how vague automation becomes tested labor. The eval set is the receipt.*
