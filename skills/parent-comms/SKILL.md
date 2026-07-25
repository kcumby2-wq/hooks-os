# Parent Comms — Skill

**Version:** v1.1 (2026-07-25 · aligned with STL Growth Plan absorption)

How the agent writes to parents of training-client athletes (not the adult managed athletes — see `skills/athlete-brand-pipeline/SKILL.md` for that audience). US English, per `config.md`.

**v1.1 note:** parent-comms is now the voice register that fires INSIDE the lifecycle sequences shipped in Growth Plan absorption (`onboarding-sequence/` · `post-session-recap-agent/` · `package-renewal-tracking/`). Segmentation reads from `client-segmentation/` (three segments, not two — see below). Every generated parent message honors `outcomes-based-communication/` as sibling guardrail to `margin-voice/`.

---

## Three Parent Segments (v1.1 · aligned with `client-segmentation/`)

The two DFW/remote split from v1 was operationally useful but incomplete. Per `client-segmentation/`, the three-segment frame the whole operating brain reads against is:

| Segment | Channel | Tone Calibration | Lifecycle sequences |
|---|---|---|---|
| **Youth / HS parent** (in-person or cohort) | Email + SMS | High-context, personal, references the athlete by first name and session specifics | `onboarding-sequence/` Youth track · `post-session-recap-agent/` parent-first framing · `package-renewal-tracking/` parent-facing reminders |
| **College-Bound parent** (co-signer) | Email primary, SMS on scheduling only | Slightly more formal, references recruiting delta rather than in-person detail; athlete leads the conversation, parent CC'd | `onboarding-sequence/` College-Bound track · `post-session-recap-agent/` athlete-first w/ parent CC (per intake) |
| **CBH apex family** (premium personal access) | Direct-to-Margin default; agent-drafted only when Margin okays | Higher stakes, references Margin's direct credibility + advocacy-call value; extra care and lowest auto-approval threshold | Manual · not auto-fired · agent drafts for Margin review only |
| **Alumni/Pro-Track family** | Almost never — the athlete is the relationship | N/A — Margin's call | Never automated · see `client-segmentation/` |

CBH content approval remains `config.md → approval_gates.cbh_content: margin_required_always`.

---

## Posture

- **Direct and honest.** No hype-marketer voice. Margin's record speaks for itself — comms don't need to oversell.
- **The Prospect Edge transcript and the advocacy log are the receipts.** When parent comms reference an athlete's standing, they're backed by something verifiable, never by vibes.
- **Coach-register, not sales-register.** Margin talks to parents the way a respected coach talks to a parent, not the way a program markets to a prospect.

---

## What Always Gets Sent (Weekly Cadence — Active Clients)

1. **Week recap** — what was worked on with [athlete first name], what showed up well, what's next.
2. **Practical follow-up** — specific home-work, specific reps.
3. **One question** — invites response, feeds the feedback loop.

---

## Banned

| Phrase | Why |
|---|---|
| *guaranteed exposure / placement* | Outcome promise — banned ecosystem-wide |
| *your athlete will get [outcome]* | Same |
| *elevate, unlock, transform, level up* | Marketer voice |
| *we're excited to / proud to announce* | Corporate filler |
| *vague positive feedback without a specific* | Reads as filler to parents paying premium for evaluation and access |

---

## Sample

**To a DFW training client parent:**
> Worked on [first name]'s release off press coverage today. Good first step — hands stayed tight through the jam. Still some drift on the second move; that's the separation leak. Two reps a day against a bag this week and we'll see it close. Anything from his game film this weekend I should look at?

**To a CBH-tier parent (higher-stakes register):**
> [First name]'s film from this week confirmed what I saw in person — the release is college-ready, the route discipline needs another month. I'm planning to bring his film up with [Coach name] when we talk next week. Let me know if there's anything specific you want me to raise.

---

## Quality Bar

- Every parent email gets Kyron (and, for CBH-tier, Margin) review for the first 30 days post-launch.
- Graduates per channel after the standard network rule: 3 consecutive clean review batches.

---

## Cross-Skill Integration (v1.1)

- **`client-segmentation/`** — determines which parent segment applies (Youth/HS · College-Bound · CBH · Alumni)
- **`margin-voice/`** — sibling voice guardrail · fires on every generated message
- **`outcomes-based-communication/`** — sibling voice guardrail · every message leads with what changes for the athlete
- **`onboarding-sequence/`** — parent-facing welcome + intake + first-session messages use this skill's register
- **`post-session-recap-agent/`** — recap-to-parent register per this skill; Youth/HS parent-first framing
- **`package-renewal-tracking/`** — 30/14/7 renewal reminders + missed-payment recovery register
- **`session-booking-no-show/`** — parent-facing reminder + no-show recovery messages
- **`athlete-referral-program/`** — parent-triggered referrals get a special-recognition register (personal, low-pressure)
- **`account-health-agent/`** — when Margin's dashboard flags a Youth/HS account, the intervention message uses this skill's register
- **`sales-qualification-agent/`** — parent-side inbound DMs handled via this register

---

*The transcript and the advocacy log are the proof. Parent comms reference them; they don't replace them with enthusiasm. v1.1: every lifecycle automation the Growth Plan absorption shipped runs its parent-facing messages through this skill's register.*
