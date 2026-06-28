# Subject Media Coordination — Skill

How the agent works WITH Subject Media (and the SubjectSkillz creator team) without doing creator work itself. **This skill is a boundary rule as much as a workflow.** The agent orchestrates briefs, quality-checks output, and coordinates cadence — it does NOT produce final assets. Creators produce final assets.

This is Margin-specific because Margin has Subject Media as a built-out content arm. Other clients in the network may not have a creator team yet, in which case this skill's structure adapts (the agent does more drafting; humans approve before posting). For Margin, the production capacity exists; the coordination is the value-add.

---

## What the Agent Does

### 1. Brief writing
For every piece of planned content, the agent writes a creator-ready brief:

```yaml
content_id: 2026-W30-saturday-game-recap-athlete-12
target_audience: [athletes, parents, coaches, mixed]
brand: [CBH, STL, athlete-personal]
piece_type: [carousel, reel, long-form, photo-essay, interview clip]
voice_anchor: skills/margin-voice/SKILL.md  (or athlete brand-identity for athlete pieces)
context:
  - What this piece is about, in 2-3 sentences
  - Why this piece, this week
  - What it pairs with (if part of a sequence)
content_skeleton:
  hook: |
    [The opening line / first frame / first beat]
  body: |
    [The arc — what gets shown / said / cut to]
  close: |
    [The landing / CTA / sign-off]
visuals_needed: [list]
audio_needed: [music license? voiceover? Margin's voice?]
hard_lines:
  - No minors named without consent
  - No promise language
  - [Other audience-specific hard lines]
approval_chain:
  - Athlete approval (if managed athlete is featured)
  - Margin approval (if Margin-voiced)
  - Kyron final review before posting
target_post_date: 2026-WW-DD
```

Saved to `output/content-briefs/[brand]/[YYYY-MM-DD]-[content_id].yaml`. **Creator team reads from there. The agent does not produce the asset itself.**

### 2. Quality check on returned assets
When creators send back drafts (assets in progress or final), the agent's role:

- **Voice check** — does the caption/text match the voice spec from `skills/margin-voice/SKILL.md` or the athlete's `brand-identity.md`?
- **Compliance check** — any minor's name in there without consent? Any promise language? Any banned phrase? Any unapproved athlete reference?
- **Brand check** — does it land in CBH register, STL register, or athlete-brand register correctly?
- **Hard-line check** — any of the per-brand or per-athlete hard lines crossed?

Flagged issues go in `output/content-review/[YYYY-MM-DD]-[content_id]-review.md` — clear, specific, with a redline-friendly format. Creators iterate. Asset moves forward when clean.

### 3. Posting cadence orchestration
- Schedule across the right surfaces (Margin's CBH channels · STL channels · athlete's own channels)
- Time per the calendar (game weekends matter; off-weekends matter differently)
- Coordinate cross-posting rules (when STL features an athlete, the athlete's brand gets the cross-post)
- Watch for collisions (don't post two big pieces on one athlete on the same day)

### 4. Post-performance tracking
- Engagement scrape feeds the Monday review per `skills/engagement-monitoring/SKILL.md`
- Per-piece performance log builds the audience-resonance corpus
- Patterns push to the brief-writing process — what types of openers, formats, captions land

---

## What the Agent Does NOT Do

- **Does not write final captions.** Drafts that go into the brief skeleton. Creators tune them.
- **Does not produce graphics, edits, photos, videos, audio.** That's creator work.
- **Does not post directly to social.** Posting goes through the creator-team posting protocol or through GHL automation, with Kyron's gate where required by `config.md`.
- **Does not approve assets unilaterally.** The approval chain in the brief is the rule. Athlete approval (when relevant), Margin approval (when relevant), Kyron final review. The agent surfaces; humans approve.
- **Does not direct creators on craft.** Brief gives the spec; how the creator hits it is the creator's call. The agent comments on outcome quality vs spec, not on creative process.

---

## The 30+ Posts/Month Cadence (Margin's Existing Pattern)

Per the CBH × STL document, Subject Media produces 30+ posts/month for the brand. The agent's coordination layer breaks that down:

- **CBH brand content** (Margin's personal apex) — ~8 posts/month. Lower volume, higher density.
- **STL brand content** (community, methodology, ecosystem) — ~12 posts/month. Volume-and-cadence engine.
- **Athlete-brand content** (managed athletes — each gets a slice) — ~10+ posts/month across the roster. Per-athlete sub-cadence varies (some athletes 3/month, some 1).

Total: 30+. Cadence is locked in `data/content-calendar.md` and reviewed weekly during pre-August sprint, monthly after.

---

## Brief Templates (Per Brand)

The agent ships with brief templates that already encode the brand register:

- `output/content-briefs/_templates/cbh-coaching-moment.yaml`
- `output/content-briefs/_templates/cbh-advocacy-snapshot.yaml`
- `output/content-briefs/_templates/stl-cohort-marketing.yaml`
- `output/content-briefs/_templates/stl-community-education.yaml`
- `output/content-briefs/_templates/stl-trainer-blueprint-pitch.yaml`
- `output/content-briefs/_templates/athlete-game-recap.yaml`
- `output/content-briefs/_templates/athlete-nil-deal-launch.yaml`
- `output/content-briefs/_templates/athlete-personal-storytelling.yaml`

Each template is a fillable skeleton. Pre-loaded with the right audience tags, voice anchors, hard lines, and approval chains. Pick the template, fill the specifics, ship the brief.

---

## Cross-Skill Integration

- **Voice skills** — every brief references the voice anchor (`margin-voice` for Margin-voiced; `[athlete]/brand-identity` for athlete-voiced; CBH-register or STL-register sub-spec where Margin's voice differentiates).
- **Athlete brand pipeline** — managed-athlete content briefs are produced from this skill but the strategic content plan comes from `skills/athlete-brand-pipeline/SKILL.md`.
- **Trainer Blueprint** — sales/marketing content for the Trainer Blueprint product is briefed from this skill, with productization specs from `skills/trainer-blueprint/SKILL.md`.
- **CBH advocacy** — advocacy events that turn into content go through both this skill (briefing) and `skills/cbh-advocacy/SKILL.md` (the source moment + the consent / compliance check).
- **Engagement monitoring** — post-performance feeds this skill's brief-writing improvement loop.

---

## Hard Rules

- **Briefs are written before creators start.** No "let's just see what they come up with." The voice and brand depend on the brief discipline.
- **No content ships without the approval chain completing.** Even if it's late. Even if it's hot. The cost of a content mistake is brand damage; the cost of a missed post is one missed post.
- **Athlete approval on managed-athlete content is non-negotiable.** No exceptions, no shortcuts, no "assumed."
- **Margin approval on CBH content is non-negotiable.** STL content can run with Kyron's approval per `config.md`, but CBH (the personal brand) needs Margin's sign-off.
- **Compliance violations stop the asset.** A minor's name without consent, a promise phrase, a banned phrase = asset doesn't ship until clean.
- **No content produced about an athlete Margin has not personally seen in-person** for CBH brand. Athlete-personal brand content has different rules (the athlete owns their own brand).

---

## Calibration

This skill calibrates fastest in the first 30 days of season operations:
- Which brief templates produce assets creators ship cleanly vs require revisions.
- Which approval-chain steps are bottlenecks (where do briefs queue up?).
- Which content types land vs don't — feeds the brief-writing improvement loop.
- Edge cases (creator team needs to push back on a hard line; athlete declines a planned post) get logged and the skill incorporates the new pattern.

---

*The agent's value here is leverage on the creator team's time, not replacement of it. A great brief saves a creator 30 minutes of cold-start. A bad brief costs 30 minutes plus rework. The discipline of the brief is the discipline of the brand.*
