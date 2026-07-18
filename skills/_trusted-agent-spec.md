# Trusted-Agent Spec Template (7 Questions)

Every skill in `skills/` answers these seven questions. If any answer is "we'll figure it out later," the skill is **not trusted yet** — no matter how good the output looks. Do not sell it as tested labor until every answer is locked.

Full protocol: [/framework-ops#spec](https://fbtrainer-tojcampaign.vercel.app/framework-ops#spec)

---

## The 7 questions

1. **What wakes it up?** — the trigger. Time-based (Sunday night), event-based (raw paste drop), or manual (Kyron invokes). No trigger = not shippable.

2. **What context can it use?** — data + memory scope. Which files, which prior sessions, which client folder. Everything else is out-of-scope by default.

3. **What tools can it use?** — allowed MCP / API / script surface. Everything not on the list is blocked. Build-to-protect layer.

4. **What can it do by itself?** — the autonomy zone. Actions that don't need approval. Draft a caption? Yes. Send it? No — that's Q06.

5. **What does success look like?** — definition of done. What shape the output must hit. **This becomes the eval spec.**

6. **Where does it need approval?** — every hard gate. "Never publishes" is an approval gate. "Never sends money" is an approval gate.

7. **When does it escalate to a human?** — kill-switch conditions. Failed eval twice, ambiguous input, hard-line violation → route back, don't force through.

---

## Guardrails vs Evals

**Guardrails** = the rules that define what "good" looks like (tone · structure · format · compliance · hard lines). Always-on.

**Evals** = the checklist / test layer that runs outputs against the guardrails **before** delivery. Fail → agent retries, reshapes, or routes to review. Never delivers messy work.

---

## How to fill the spec for a new skill

The framework says: **shadow-and-ship**. Do not guess the answers.

1. Shadow 10-20 real runs (screen record + narrate).
2. Extract triggers · rules · handoffs · edge cases → the 7 answers above.
3. Build an eval set from 20-50 real examples with expected outputs.
4. Run the agent against the eval set until pass rate clears the bar.
5. Ship as tested labor.

See [/framework-ops#shadow](https://fbtrainer-tojcampaign.vercel.app/framework-ops#shadow) for the full method.

---

## Altitude codes (also declared per skill)

| Code | Level | Owned by |
|---|---|---|
| `T` | Tactics | AI · junior human · outsourceable |
| `P` | Principles | Senior operators + Kyron · reviewed |
| `E` | Essence | Kyron only · non-transferable |
| `T→P` | Climbing | Currently tactics, climbing to principles |
| `P→E` | Climbing | Currently principles, climbing to essence |

Every SKILL.md declares one of these codes at the top.

---

## Per-skill spec block · paste this into every SKILL.md

```markdown
## Trusted-Agent Spec (7Q)

**Spec status:** shadow-pending · fill during first shadow pass · target date [YYYY-MM-DD]

1. **Wakes:** _[trigger]_
2. **Context:** _[data + memory scope]_
3. **Tools:** _[allowed surface]_
4. **Autonomy:** _[what it does without approval]_
5. **Success:** _[definition of done → eval spec]_
6. **Approval gates:** _[hard gates]_
7. **Escalation:** _[kill-switch conditions]_

**Guardrails:** _[always-on rules — tone, structure, hard lines]_
**Evals:** _[output-check rules — pass criteria before delivery]_
```

Reference example (fully spec'd): `skills/weekly-stats-cards/SKILL.md`.
