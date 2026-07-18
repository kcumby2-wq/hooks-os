# Eval Set — [Job Name]

**Shadowed:** [N] runs · [date range]
**Spec version:** v1.0

---

## Trusted-agent spec (7Q · extracted from shadow observations)

1. **Wakes:** _[observed trigger — most common form]_
2. **Context:** _[data + memory scope the human referenced]_
3. **Tools:** _[systems + surfaces the human used]_
4. **Autonomy:** _[decisions made without asking anyone]_
5. **Success:** _[shape of a "good" completed run]_
6. **Approval gates:** _[pauses for someone else's OK]_
7. **Escalation:** _[what triggered "I need help"]_

**Guardrails:** _[the always-on rules the human enforced without thinking]_
**Evals:** _[the check the human ran on their own output before shipping]_

---

## Eval examples (target: 20-50 real cases)

| # | Input (real) | Expected output | Guardrails to check | Category |
|---|-------------|-----------------|---------------------|----------|
| 1 |             |                 |                     | normal   |
| 2 |             |                 |                     | normal   |
| 3 |             |                 |                     | edge     |
| 4 |             |                 |                     | edge     |

Categories: `normal` · `edge` · `failure` · `escalation-required`.

---

## Pass criteria

- **Ship-ready:** fail rate under [X]% on the eval set → agent is tested labor
- **Not-yet-ready:** fail rate above [X]% → spec is wrong, not the agent · return to shadow
- **Failing an edge case is worth 3 failures on a normal case** — edges are where trust dies

---

## Run history

_(log each time the agent gets tested against this eval set)_

| Date | Pass rate | Failures observed | Fix applied | Ship-ready? |
|------|-----------|-------------------|-------------|-------------|
|      |           |                   |             |             |
