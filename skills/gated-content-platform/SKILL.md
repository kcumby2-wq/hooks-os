# Gated Content Platform — Skill

How the STL / CBH digital platform monetizes Margin's teaching library through a **three-layer content gate** modeled on Study.com's freemium video pattern. This skill exists because the platform is the point where Margin's audience becomes measurable revenue — every free short, every 2-minute preview, every membership signup, every cohort application feeds one data model.

Not a marketing plan. A **repeatable operational unit** — same three-layer structure any Elite-tier trainer client in the TOJ Sports avenue receives as part of the $30K Elite Package.

---

## The Three Layers (locked)

### Layer 0 — Distribution shorts (Opus Clips)
- Every long-form lesson video generates 8-12 short cuts (15-60 seconds) via Opus Clips
- Distributed across IG Reels, TikTok, YouTube Shorts, X
- Each short ends with the same call: *"Full breakdown on the STL platform — link in bio"*
- **The shorts are the ads for the previews.** Never monetized directly. Purpose is qualified traffic to Layer 1.

### Layer 1 — Free preview (the hook, no account required)
- Every lesson video plays the **first 2 minutes free**
- The 2-minute point is chosen deliberately per lesson — see "Preview Point Selection" below
- No signup wall to *watch* the preview. The wall is what happens AT the 2-minute mark.
- Purpose: proof of quality. The viewer learns something real before being asked for anything.
- **Fires the `preview_started` and `preview_completed` funnel events** — these are the highest-value pre-conversion signals in the whole system.

### Layer 2 — STL Membership ($99/mo)
- Full lesson library unlocked
- Drill packet PDFs attached to each lesson
- 3-question rep check per lesson
- Track completion certificates (shareable — this is the referral loop)
- Community access (per the CBH × STL doc)
- Progress dashboard visible to parent + athlete
- Weekly new lesson drops

### Layer 3 — Premium tiers (existing STL/CBH ladder, digitally native)
- **Cohort enrollment** — quarterly, application-gated, curriculum delivered through the platform, per `skills/cohort-design/SKILL.md`
- **Evaluation** — Prospect Edge transcript ordered from the platform, per `skills/prospect-edge-workflow/SKILL.md`
- **Coached by Hooks** — apex tier, application-only, platform explains it, entry is manual

**The ladder is a straight line.** Short → preview → member → cohort → evaluation → CBH. Nothing loops backward. Every rung raises the next rung's price.

---

## Preview Point Selection (the 2-minute mark)

The single most consequential craft decision in this skill. **Pick the wrong preview point and the gate feels like a rug-pull. Pick the right one and it feels like an invitation.**

### The rule
The 2-minute preview ends **after Margin has taught one complete coaching point but BEFORE the drill progression that applies it.**

### Why
- Two minutes is enough to demonstrate Margin's teaching quality (proof)
- Ending after the point but before the drills leaves the viewer with a *question they now want answered by doing the reps* — not a cliffhanger, not incomplete information
- If the gate drops in the middle of an idea, viewers feel manipulated. If it drops after the idea is complete, viewers feel taught.

### The tagging workflow
1. Kyron watches the raw video with Margin
2. They agree on the preview point together — never algorithmic
3. Two candidate points marked: primary and backup
4. Test cut of the 2 minutes reviewed on mobile (this is where 80% of viewers will watch)
5. Preview point locked in the video metadata, gates the render

### Backup rule
If a lesson's 2:00 mark naturally falls in the middle of a demonstration, the preview extends to 2:30 or contracts to 1:45 to hit a natural pause. **Timing serves the teaching, not the other way around.**

---

## Curriculum Mapping (Study.com structure, Margin's methodology)

Adopts Study.com's course/chapter/lesson/quiz/certificate structure. Applied to STL's WR curriculum from `skills/cohort-design/SKILL.md`:

| Study.com element | STL platform equivalent |
|-------------------|-------------------------|
| Course | **Track** (e.g., "Release Mechanics — Foundation") |
| Chapter | **Phase** — matches the 6-week cohort arc (release → stem → breakpoint → route tree → install → transcript) |
| Lesson (video + text) | **Lesson** (Margin's video + drill packet PDF) |
| Quiz | **Rep check** — 3-5 questions confirming the athlete understood the coaching point |
| Certificate | **Track completion badge** — shareable graphic athletes post on their own social |
| Progress dashboard | **Athlete progress view** — visible to parent (who is usually the buyer) and to the athlete |

### Why the certificates matter more than they look
A 14-year-old completing "Release Mechanics — Foundation" posts the badge. His teammates see it. They ask what it is. **That's the referral loop, digitized.** Certificates are marketing assets that the athletes themselves distribute — the cheapest customer acquisition in the entire stack.

Design constraint: certificates must look serious enough that a family wants to display them. Not gamified. Not cartoon. Same aesthetic as the Operational Transcript — quiet authority.

---

## Video Production Workflow (from 6 raw videos to launch library)

The initial 6 YouTube videos Kyron shot are the seed inventory. Per video, the workflow:

| Step | Owner | Output |
|------|-------|--------|
| 1. Raw upload + Kyron/Margin review | Kyron + Margin | Preview point marked, drill packet outlined |
| 2. Drill packet PDF drafted | Kyron | 1-2 page PDF matching the lesson's drills |
| 3. Rep check written | Kyron | 3-5 questions, saved to lesson metadata |
| 4. Video encoded for platform | Platform engineering | Two-file output: 2-minute preview clip + full lesson |
| 5. Opus Clips run on full lesson | Kyron | 8-12 shorts, tagged by hook style |
| 6. Distribution calendar set | Subject Media coordination (per that skill) | 1-2 shorts/day for the following 2 weeks per video |
| 7. Post-launch review | Kyron | Preview → member conversion measured per lesson |

**Six videos = ~48-72 distribution shorts + 6 preview funnels + 6 full lessons.** Enough to launch. Weekly cadence after that: 1 new lesson/week (batch-filmable in a single day/month).

---

## Funnel Events (the data that drives the company)

Every layer fires structured events into the GHL sub-account and the platform's analytics store. **These are the signals that make the company data-driven — Margin knows what's converting before he films the next video.**

| Event | Fires when | GHL tag applied | What it enables |
|-------|-----------|-----------------|-----------------|
| `short_view` | User watches ≥50% of a distribution short | none (pre-lead) | Content performance ranking |
| `platform_visit` | User arrives at STL platform from a short | `traffic:opus-clips` | Attribution to the short that drove the visit |
| `preview_started` | User clicks play on a lesson preview | `warm-lead` | Nurture sequence begins |
| `preview_completed` | User watches the full 2-minute preview | `warm-lead-qualified` | Higher-intent nurture sequence begins |
| `gate_reached` | The membership gate drops for the user | `intent:membership` | Retargeting-eligible signal |
| `member_joined` | User completes Stripe checkout for $99/mo | `member:active`, remove all warm-lead tags | Onboarding sequence begins |
| `lesson_completed` | Member watches a full lesson | `progress:track-X-lesson-Y` | Progress dashboard update, rep-check prompt |
| `track_completed` | Member finishes all lessons in a track | `certificate:track-X` | Certificate generation, referral prompt |
| `cohort_applied` | Member applies for the next cohort | `intent:cohort` | Manual review queue |
| `evaluation_ordered` | Member orders a Prospect Edge transcript | `product:eval` | PE workflow initiated per that skill |
| `cbh_inquiry` | Member submits CBH inquiry form | `intent:cbh`, flagged to Margin personally | High-value inbound to Margin |

**Rule:** every event that fires must map to a decision the operator will make with the data. No vanity events. If nobody will change behavior based on the data, don't collect the event.

---

## The Weekly Operator Read (what the platform gives Margin every Monday)

Feeds directly into `skills/engagement-monitoring/SKILL.md`'s Monday routine — this skill is where the funnel data comes from:

- Shorts view count + top-performing hook style
- Preview watch rate per lesson (which lessons hold attention)
- Preview → member conversion rate per lesson (which lessons *sell*)
- New members this week + churn this week + net MRR change
- Lesson completion rate for active members (are members actually watching?)
- Cohort application count + evaluation orders + CBH inquiries (the upper-ladder pull)

**The killer number:** preview → member conversion per lesson. This tells Margin which teaching style, which coaching point, which drill demonstration converts. **He'll know what to film next.**

---

## Hard Rules

- **No preview point set without Margin's approval.** The 2-minute cut is a teaching decision, not an engineering decision.
- **No lesson published without a rep check.** A video without the check is inert — the check is what makes it curriculum instead of content.
- **No certificate design without operator review.** Certificates are brand-adjacent artifacts. Cheap-looking ones damage the credential.
- **No promise language in the preview or the gate copy.** "Learn Margin's methodology" ≠ "Get college offers." The ban list from `skills/margin-voice/SKILL.md` applies.
- **No minor's face on the certificate share graphic without consent flag on file.** Even celebration content follows the network-wide minor-safety rules.
- **No paywall on evaluation results.** A family's Prospect Edge transcript is theirs the moment it's compiled — not gated behind an upsell.
- **No "cancel is hidden" pattern.** Stripe self-serve cancel visible from the account page. Cheap trickery costs long-term reputation.

---

## Cross-Skill Integration

- **`skills/subject-media-coordination/SKILL.md`** — the shorts distribution runs through Subject Media briefs. The video pipeline described here feeds that skill's cadence.
- **`skills/cohort-design/SKILL.md`** — the platform is where cohort curriculum is delivered. This skill and cohort-design share the curriculum structure.
- **`skills/margin-voice/SKILL.md`** — every preview, every gate copy line, every certificate caption is voice-checked against margin-voice.
- **`skills/engagement-monitoring/SKILL.md`** — the funnel events feed the Monday operator read.
- **`skills/prospect-edge-workflow/SKILL.md`** — evaluation orders placed through the platform initiate the PE workflow.
- **`skills/parent-comms/SKILL.md`** — automated comms triggered by funnel events run through parent-comms voice.

---

## Calibration Notes

First 90 days after launch is the calibration window. Expected iterations:

- Preview point per lesson (some will need to move — data will show it)
- Gate copy (three variants A/B/C tested weekly, winner kept)
- Certificate design (first-week signups will surface visual issues)
- Rep-check question difficulty (too easy = worthless, too hard = churn)
- Weekly lesson cadence (1/week may prove too slow or unsustainable)

All calibration entries push to `improvements.md` and the TOJ Operational Transcript per the network cycle.

---

## Why This Is a TOJ-Network Skill, Not Just an STL Product

This exact three-layer gate template applies to every Elite-tier client in the TOJ Sports avenue AND to TOJ Big Business clients in the training niche (e.g., multi-location training operations that need to certify staff on a methodology — same Study.com structure serves internal certification as well as external customer curriculum). After Margin's is the reference implementation, deployment #2, #3, #4 use the same skill, tuned to the client's curriculum. **The skill compounds; the codebase compounds; the funnel benchmark data compounds.**

---

*The gate is where a DM becomes a member. The preview point is the single most important teaching decision. The certificates are the referral loop, digitized.*
