# Athlete Referral Program — Client-to-Client Growth

> **⬢ Operating altitude:** `P` · CRM-automation-adjacent growth motion
> **⬢ Trusted-agent spec (7Q):** shadow-pending
> **⬢ Operational lead:** Kyron (build + tracking) · Margin (referral moment recognition) · runs off event triggers

**Purpose:** Families trust other families more than advertisements — and athletes trust other athletes even more. This skill turns Margin's existing client base and alumni network into a growth channel with structured incentives, timed to real moments rather than generic "refer a friend" prompts.

**Distinguished from `cbh-advocacy/`:** cbh-advocacy is Margin advocating FOR his athletes to COLLEGE COACHES. This skill is client families referring OTHER families to Margin.

**Distinguished from `roster-revenue-share/`:** roster-revenue-share is TOJ's commercial arrangement with Margin on referrals from his existing roster. This skill is the client-facing referral mechanic.

---

## Incentive structure

**Every referring family who converts a new signed client gets one of:**
- Free training session (Youth/HS or College-Bound tier)
- Discounted package upgrade (10-20% off next block)
- Priority scheduling access (skip the waitlist for the next 60 days)
- Invite to an exclusive small-group clinic or session

**Referring family picks the reward** at referral confirmation · reduces friction and increases perceived value.

---

## Weighting · alumni-heavy

**Alumni referrals are the highest-conversion source.**

The referral program is designed with Alumni weighting in mind:
- **Alumni referrals get a Margin-personal thank-you** (not automated)
- **Alumni-referred leads bypass the standard sales-qualification-agent** and route directly to Margin
- **Alumni get a distinct incentive:** access to an in-person session with Margin in Plano when in the area · not a discount (they're not price-sensitive)

**Weighting rationale:** an NFL alum publicly referencing Margin is the single highest-conversion trigger available. That moment gets prioritized over a Youth parent's word-of-mouth by orders of magnitude.

---

## The trigger patterns · when to make the ask

**Do not ask by fixed schedule ("30 days after signup"). Ask by real moment:**

| Trigger | Action |
|---|---|
| Athlete receives an offer | Referral ask within 48h ("who else's kid needs this?") |
| Athlete gets a measurable win (40-time PR · state honors · signing day) | Same-week ask timed to the celebration |
| Alumni gets drafted OR signs with new program AND publicly references Margin | Immediate personal ask from Margin ("who from your rookie class needs the release work?") |
| Cohort completion + Prospect Edge transcript delivery | Ask embedded in the completion message |
| Parent posts a spontaneous testimonial or thank-you | Ask within 24h |
| Athlete featured in Release Room Friday | Featured-family gets a personal ask that week |

**Anti-pattern:** the "please refer us" email that fires 30 days after signup regardless of context. Kills momentum. Feels transactional.

---

## The mechanics

**Referral flow (family-facing):**
1. Family clicks their personal referral link (unique · tracks source)
2. Referred family lands on a dedicated intake page with "Referred by [Family Name]" pre-populated
3. Referred family fills out the standard intake (per `lead-capture-automation/`) · tagged "referral" + source family
4. Sales-qualification-agent handles from there · segment classification · booking

**Attribution:**
- Every conversion writes back to the referring family's record
- Reward auto-fires when new lead signs a package (not just when they book a consult)
- Kyron dashboard shows referral tree · which families are producing conversions

**Recognition:**
- Top referring families of the year get an unbidden acknowledgment (small gift · personal note from Margin · public recognition IF they consent)
- Not a leaderboard · not gamified · just recognition of relationships

---

## What this integrates with

- **`sales-qualification-agent/`** — handles referred inbounds (unless Alumni-referred · then direct to Margin)
- **`lead-capture-automation/`** — tagged "referral" at intake
- **`client-segmentation/`** — referred leads get the same segment routing
- **`onboarding-sequence/`** — the referring family gets a "your friend just started" note (with consent)
- **`release-room-friday/`** — featured athletes become natural referral moments
- **`cbh-advocacy/`** — Alumni referrals often align with advocacy timing
- **`roster-revenue-share/`** — Margin's own roster referrals are tracked under that commercial layer AS WELL AS through this program (double-counted from Margin's side · single-counted from TOJ commercial-terms side)

---

## Anti-patterns

- Generic "refer a friend" email blast on a fixed schedule
- Cash-back incentives (feels transactional · attracts wrong-fit referrals)
- Public leaderboards or gamification (breaks the coaching relationship register)
- Same incentive for Youth/HS parent as for an Alumni NFL referral (different scale · different treatment)
- Ignoring the moment — waiting weeks to make the ask after an obvious trigger
- Automated ask that lands during a bad news moment (an injury · a program change)

---

## Success signal

- ≥ 25% of new signed clients originate from referral within 12 months
- Alumni-referred conversion rate ≥ 3x cold-lead conversion
- Zero automated referral asks fired without a real trigger
- Top 5 referring families identified quarterly · relationship investment maintained

---

## Cross-skill integration

- **`lead-capture-automation/`** — referral leads tagged at intake
- **`sales-qualification-agent/`** — routes referred inbounds
- **`client-segmentation/`** — determines routing + reward tier
- **`cbh-advocacy/`** — Alumni referral moments align with advocacy calls
- **`release-room-friday/`** — featured athletes prompt organic referral asks
- **`account-health-agent/`** — active + healthy clients are the ones asked (never a flagged/at-risk account)
- **`roster-revenue-share/`** — commercial layer running underneath the referral flow for Margin's roster
- **`onboarding-sequence/`** — referring family's onboarding builds trust that produces future referrals

---

*Families trust families. Athletes trust athletes. The alumni network is the moat. Structured incentives + timed asks turn that moat into a flywheel.*
