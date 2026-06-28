# Cold Outreach — Skill

Cold email, text, and DM outreach for STL/CBH. **Includes follower-triggered outreach.** Two-mode operation per the network standard — Manual Review or Auto Reach, set per channel in `config.md`.

**Margin's situation:** as the founding apex trainer, inbound volume (people who already know the record and are reaching out) typically outweighs the value of aggressive outbound. Cold outreach here is lower-priority than for high-audience-tier clients building reach — the credential does the attracting. Outbound is used surgically: trainer-blueprint candidate sourcing, specific athlete families STL wants to reach, coach-network expansion.

---

## The Two Modes (Network Standard)

### Manual Review Mode
Agent drafts every outreach → saves to `output/outreach/[YYYY-MM-DD]-[channel]-[batch].md` → Kyron (or Margin, per `config.md`) reviews → marks `APPROVE` or `EDIT [note]` → approved drafts push to send queue.

### Auto Reach Mode
Fires automatically per rules below once a channel graduates. Every send logs for audit.

**Default at onboarding:** Manual Review on every channel. Auto unlocks per channel after two consecutive clean review batches.

---

## Channels (Priority Order for STL/CBH)

| Channel | Priority | Notes |
|---|---|---|
| **Coach/partner outreach** | High-value, always manual | Never automated, regardless of client tier — see network standard |
| **STL community follower-trigger** | Medium-high | Someone follows @skysthelimitwr — light-touch welcome, not a sales push |
| **Trainer Blueprint candidate sourcing** | Medium | Outbound to credentialed trainers who fit the qualification profile — always manual, this is relationship-building not volume |
| **Cold email/SMS to athlete families** | Low | Inbound typically exceeds need for this; used opportunistically for specific target families |

---

## Follower-Triggered Outreach

When someone follows an STL channel:

1. Webhook fires (GHL contact creation).
2. Agent enriches — bio, recent posts, tags as parent / athlete / coach / trainer-candidate / other.
3. Routes to the matching template.
4. Manual mode (default): drafts the DM → `output/outreach/follower-touch/` for review.
5. Auto mode (post-graduation): sends after a delay, never instant.

**Guardrails (network-standard):**
- Skip low-signal accounts (private + empty bio, dormant).
- Rate caps per `config.md`.
- Never repeat outreach to the same contact within 90 days.
- Escalate any complaint/legal-tone/do-not-contact reply immediately, auto-stop that contact's sequence.

---

## Trainer Blueprint Candidate Outreach (STL-Specific)

This channel doesn't exist in high-audience or standard-tier repos — it's specific to apex trainers building a certified-trainer lineage.

- **Sourced from:** Margin's existing network, coaching circles, referrals from current STL Certified Trainers, inbound interest from STL community content about the Blueprint.
- **Always manual.** Margin personally vets every Trainer Blueprint relationship — see `skills/trainer-blueprint/SKILL.md`. Outreach here is relationship-opening, not a sales sequence.
- **Never cold-list at volume.** A trainer who feels "marketed to" rather than "personally invited" is the wrong start for a relationship that ends in Margin vouching for them.

---

## Hard Rules (Network Standard)

1. Honest about the channel — first touch identifies it's the STL/TOJ team, not Margin personally typing, unless Margin is actually the one sending.
2. One ask per message.
3. No fake personalization.
4. Compliance: two-click unsubscribe, regional anti-spam rules per `config.md`.
5. Never outreach to minors directly — always parent-routed.
6. Sponsor/partnership inquiries flagged to Kyron + Margin, never auto-drafted.

---

## What the Agent Tracks Per Batch

```yaml
batch_id: 2026-W30-followers-stl
channel: ig_dm
mode: manual_review
sent: 12
replies: 4
positive_replies: 3
trainer_candidates_surfaced: 1
opt_outs: 0
flagged: 0
```

Saved to `data/engagement/outreach/[batch_id].yaml`.

---

*This skill is intentionally lower-volume than the equivalent in high-audience-tier repos. The credential attracts; outreach here protects relationships rather than chasing growth.*
