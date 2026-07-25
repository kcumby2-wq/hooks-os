# Outcomes-Based Communication — Feature-vs-Outcome Frame

> **⬢ Operating altitude:** `E` · voice-guardrail sibling to `margin-voice/` · applies EVERYWHERE
> **⬢ Trusted-agent spec (7Q):** shadow-pending
> **⬢ Operational lead:** Margin (voice authority) · Kyron (enforces on every generated output) · every agent + template runs against this

**Purpose:** Every communication a lead or client reads from Sky's The Limit leads with what changes for the athlete — not what a session involves. Features tell. Outcomes convert. This skill is the frame every other content, comms, and agent skill honors.

**Return per Growth Plan:** *"Outcome-led messaging converts more leads out of the same traffic and content Margin already has — this isn't more marketing, it's the same marketing returning more."*

**Distinguished from `margin-voice/`:** margin-voice is HOW Margin sounds (register, cadence, vocabulary). This is WHAT the sentence is about (what changes for the athlete). Both fire on every output.

---

## The frame · features vs outcomes

**A feature** describes what a session covers:
- "Release-package training sessions"
- "Route detail work"
- "Contested-catch reps"
- "1:1 and small-group WR development"

**An outcome** describes what changes for the athlete:
- "Beat press coverage before the DB sets his feet"
- "Snap the top of the route so the DB has no chance to close"
- "Come down with the ball in traffic — even when he's not open"
- "Get seen by the college coach recruiting your division"

**The rule:** if the sentence describes the training, revise it. If it describes what the athlete WILL DO differently, keep it.

---

## Where this fires

- **Sales-qualification-agent scripts** (`sales-qualification-agent/`)
- **All lifecycle messages** (welcome, no-show recovery, renewal, review request · via `parent-comms/` + `onboarding-sequence/` + `package-renewal-tracking/`)
- **Post-session recaps** (`post-session-recap-agent/` — the "focus" and "coach's note" fields especially)
- **Landing page copy** (main STL page + ad-specific landing pages)
- **Social captions** (`release-room-friday/` + every result-driven post per socials strategy)
- **Newsletter** ("Route Tree Weekly")
- **Blueprint marketing** (`trainer-blueprint/` sales page)

**Anywhere copy is generated, this guardrail fires.**

---

## Common feature-language patterns and outcome-rewrites

| Feature (avoid) | Outcome (rewrite to) |
|---|---|
| "1:1 wide receiver development" | "One-on-one time to fix the exact thing showing up on his tape" |
| "Route detail training" | "Get separation at the top of every route — every rep" |
| "Contested-catch mechanics" | "Come down with the ball in traffic" |
| "Small-group WR sessions" | "Compete against WRs at your level · get better than them" |
| "Elite training with a Master Trainer" | "Get coached by the guy 7 NFL players trained under" |
| "Season-long training package" | "Show up to fall camp faster, more separated, and impossible to press" |
| "Film review sessions" | "Watch your own tape with the coach who can tell you exactly what to fix" |
| "Recruiting-ready development" | "Get on college coach desks with tape that actually gets them to call" |

---

## The one exception · when to use feature language

**Feature language IS appropriate in two places:**
1. **Compliance / disclosure** (what a package legally includes)
2. **Product-detail pages a buyer opens AFTER being convinced by outcomes** (the terms sheet · the FAQ · the receipt)

**Everywhere else · outcomes only.**

---

## Voice-drift check

**Every generated output runs through this filter before send:**
1. Does the first sentence describe what changes for the athlete? Yes → pass. No → revise.
2. Does the CTA describe a specific improvement, or does it describe the product? Improvement → pass. Product → revise.
3. Are there feature-language patterns present that could be outcome-rewritten?

**If ≥ 1 fails, the output goes back to draft.**

---

## Anti-patterns

- Leading with "our program includes..."
- Leading with "we offer..."
- Leading with product-tier names ("Membership · Cohort · CBH") without an outcome context
- Using elite-marketing vocabulary ("elite," "premier," "world-class," "revolutionary")
- Same feature-language across all three segments (Youth parent needs different outcomes than College-Bound athlete)

---

## Success signal

- Weekly voice-drift audit shows < 5% of outputs with feature-language patterns in first sentence
- Consult-conversion rate improves measurably 4 weeks after full-frame adoption (baseline vs post)
- Renewal rate improves 4 weeks after post-session-recap-agent adopts this frame consistently

---

## Cross-skill integration

- **`margin-voice/`** — sibling guardrail · every output honors both
- **`sales-qualification-agent/`** — every script this agent generates runs this filter
- **`post-session-recap-agent/`** — the "focus" and "coach's note" fields especially
- **`parent-comms/`** — Youth/HS parent messages
- **`onboarding-sequence/`** — welcome + intake + first-recap messages
- **`package-renewal-tracking/`** — renewal messages (never feature-language on a renewal · always tie to outcome achieved this block)
- **`release-room-friday/`** — every athlete-story spotlight leads with the outcome achieved
- **`client-segmentation/`** — outcomes chosen per segment (Youth outcomes ≠ College-Bound outcomes ≠ Alumni outcomes)

---

*Features tell. Outcomes convert. Every sentence a family reads should describe what changes for their athlete — not what a session involves.*
