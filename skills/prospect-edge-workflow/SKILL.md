# Prospect Edge Workflow — Skill

How the agent runs STL/CBH athletes through the Prospect Edge evaluation platform under the TOJ × Optimum Grading affiliate. **Prospect Edge is the evaluation backbone for the entire TOJ network — this repo is where it runs at the highest volume**, given Margin's broad athlete base (training clients + 36+ managed athletes).

---

## The Evaluation Flow

```
Athlete created in Subject Report  →  Film uploaded (End Zone / Sideline / Eagle Eye)
                                  →  Play-by-play grading by position-specific traits
                                  →  Grade distribution computed  →  Overall grade produced
                                  →  Transcript delivered to family
                                  →  4.0+ flagged for Athlete Certified consideration
                                  →  Coach-shareable profile (consent gated)
```

---

## Step 1 — Create the Prospect

Required fields per the Subject Report Add Prospect form: name, email, jersey #, class/yr, height/weight, position, region, team/school affiliation, social handles, highlight video link, avatar (consent-gated for minors).

Tag at creation: `SOURCE: STL` or `SOURCE: CBH` or `SOURCE: Athlete-Brand-Pipeline` depending on which funnel the athlete entered through. Saved to the appropriate folder — `data/athletes/_training-clients/[athlete]/` or `data/athletes/_management-clients/[athlete]/`.

---

## Step 2 — Film Upload

Three angle slots: End Zone, Sideline, Eagle Eye. Play number detection defaults to **Extract from Filename** (preserves Hudl export conventions).

---

## Step 3 — Position-Specific Grading

**Margin's grading range is the broadest in the network** — primary WR specialization plus broad athlete-management experience across positions, given the scale of his signed roster (6 NFL + 30+ P4 spans more than one position group in practice, even though WR is the training specialty).

- **WR (primary specialization):** Hands · Route Depth · Release · Separation · YAC · Body Control · Ball Tracking · Toughness · Football IQ
- **Other positions on the managed roster:** graded by Margin directly where his expertise covers it, or routed to a qualified STL Certified Trainer / network grader where it doesn't. The agent flags any evaluation outside core WR specialization for explicit routing confirmation before assuming Margin grades it personally.

The agent does NOT auto-grade. It prepares the platform, queues plays, surfaces context, and Margin (or the assigned grader) grades. The agent transcribes the grading rationale into the transcript narrative.

---

## Step 4 — Grade Distribution + Overall

**Never inflated, ever.** Mediocre evaluation reported as mediocre. This rule carries the most weight in this repo specifically — Margin's apex credential depends on every transcript being defensibly honest, since the advocacy calls (`skills/cbh-advocacy/SKILL.md`) reference these transcripts directly to coaches.

---

## Step 5 — Transcript Delivery

Auto-fires once grading is marked complete. Delivered via GHL email + Subject Report link. Saved to `data/athletes/[X]/transcripts/[YYYY-MM-DD]-transcript.pdf`. Cover note runs through `skills/parent-comms/SKILL.md` (training clients) or athlete-direct comms (managed adult athletes, per `skills/athlete-brand-pipeline/SKILL.md`).

---

## Step 6 — 4.0+ Flagging (Athlete Certified Routing)

Overall grade ≥ 4.0 → auto-flag as Athlete Certified candidate. Notification to Kyron, GHL tag `AC-CANDIDATE`, draft outreach prepared. **Manual review by Kyron + Margin before any AC outreach is sent — no auto-mode for AC flags, network-wide rule.**

---

## Step 7 — Coach-Shareable Profile

Consent-gated. Margin's advocacy calls (`skills/cbh-advocacy/SKILL.md`) often reference these transcripts directly — when a coach asks for film, the transcript link is usually already in hand because of this workflow.

---

## What the Agent Tracks Per Athlete

```yaml
athlete_id: hooks-roster-001
name_internal: [first] [last]
position: WR
funnel_source: cbh | stl | athlete_brand_pipeline
evaluations:
  - date: 2026-W30
    overall_grade: 4.3
    star_tier: 5
    ac_candidate: true
    ac_outreach_sent: pending_review
    transcript_delivered: yes
consent:
  parent_consent: yes
  public_profile_consent: pending
  film_use_consent: yes
```

---

## Hard Rules

- Never invent a grade.
- Never publish a profile without consent on file.
- Never inflate — this rule is the foundation of the entire CBH advocacy credential.
- Never share a transcript with a coach outside the consent-gated pipeline.
- Never re-grade a play already graded without explicit instruction.

---

*The transcript is the product across the whole network. In this repo specifically, the transcript is also the raw material for the advocacy ledger — protect the honesty of the grade and you protect the entire CBH credibility chain.*
