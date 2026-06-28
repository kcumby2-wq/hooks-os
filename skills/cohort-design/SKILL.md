# Cohort Design — Skill

How the agent designs, populates, and runs **Sky's The Limit WR cohorts** — the Zoom-delivered, system-scaled training product that carries Margin's methodology to athletes who can't get to DFW in person. Same architectural pattern used across the TOJ network, tuned for STL's specific situation: apex-credentialed methodology, national/global reach, application-gated for brand protection.

---

## What a Cohort Is

A **time-bounded, group-delivered training program** open to athletes nationally and internationally — the mechanism that makes Margin's methodology reach people who will never train with him in person. Cohorts are explicitly the "system, not Margin's time" motion — see `CLAUDE.md`'s working principle.

- **Cadence:** Quarterly. Four cohorts per calendar year.
- **Duration:** 6–8 weeks per cohort (tunable — confirm at walkthrough).
- **Delivery:** Zoom (live sessions, may feature Margin directly or STL Certified Trainers) + GHL membership portal (drills, film breakdowns, weekly homework).
- **Size:** 15–25 athletes per cohort. Below 15 = revisit pricing/audience. Above 25 = quality erodes — the apex credential depends on this not becoming a mass-market product.
- **Price:** TBD by Margin (see `config.md` → `cohort.pricing_tiers`). Premium positioning regardless of final number — STL cohorts are not a discount-volume play.

---

## The Curriculum Arc — WR Methodology, Position-Specific

| Phase | Focus | Live Session | Async Drop |
|---|---|---|---|
| 1 | Foundation — release & stance | Press release, off-coverage releases, Margin's signature footwork sequence | Drill packet + recap video |
| 2 | The stem — selling the route | Vertical stems, breakpoint setup, route disguise | Drill packet + recap |
| 3 | The breakpoint — separation craft | Top of the route, hip drop, snap-off | Drill packet + recap |
| 4 | Route tree — full position install | Run the tree against cohort members on film | Drill packet + recap |
| 5 | Parent week — what film shows, what recruiting actually looks like | Parent-facing live session | Resource list |
| 6+ | The transcript — every athlete gets a Prospect Edge evaluation | Cohort wrap + 1:1 messages | Transcript delivery |

This curriculum **is the productized version of what Coached by Hooks delivers in person.** It is also the spine of `skills/trainer-blueprint/SKILL.md`'s Phase 1 methodology transfer — the same teaching sequence, different audience and delivery format. Keep the two in sync; a curriculum improvement here should propagate there.

---

## Enrollment Workflow

1. **Waitlist opens** ahead of each cohort (timing per `config.md`). Promoted through STL community channels, existing client referrals, and cross-brand mentions from Joshua/Max where relevant.
2. **Application required** — not pay-and-play. Athlete fills: age, position, current level, goals, film link. **The application gate protects the apex credential** — STL cohorts cannot read as a volume product without damaging the CBH brand they feed into.
3. **Margin (or a delegated reviewer) approves applications** — accepts based on fit.
4. **Accepted athletes** get Stripe checkout per `config.md` invoicing settings. Spot held 48 hours.
5. **Confirmed cohort** populated ahead of start. Welcome packet, Zoom links, community channel access opens.
6. **Cohort kicks off** with a Margin intro (live or recorded, confirm format per cohort).

---

## What the Agent Produces Each Week

- Drill packet, saved to `output/content/cohort-[YYYY-Q#]/week-[N]/`.
- Live session deck (Margin or delegated trainer approves before going live).
- Parent update copy, saved to `output/sequences/` — routes through `skills/parent-comms/SKILL.md`.
- STL community digest of cohort wins.
- Cohort-week-themed social content for STL channels (proves the cohort is alive without exposing minors).

---

## Marketing Cadence for the Next Cohort

The next cohort sells *during* the current one.

- Weeks 1–2 of current cohort: Tease — what the program is, Margin's voice.
- Weeks 3–4: Athlete-led — testimonials from cohort members (with consent), or anonymized wins.
- Weeks 5–6: Open waitlist for the next cohort.
- Between cohorts: Final-seats push using the prior cohort's transcripts as proof.

---

## Hard Rules

- **No promises in cohort marketing.** "Train under Margin's verified methodology. Evaluation included." Not: "Get on coaches' radar" or any placement-implying language.
- **No minors named** in cohort marketing unless consent flag is on file.
- **Refunds:** per `config.md` policy — default suggestion, full refund through week 1, credit toward next cohort after.
- **Curriculum protection:** drill packets and live session decks are Margin's IP. Watermarked. Not shareable outside the cohort portal — this curriculum is also what Trainer Blueprint buyers pay $3,500-5,000 to receive; protecting it protects both revenue lines.

---

## Calibration Notes

Each cohort cycle produces lessons — fill rate, application-to-acceptance ratio, completion rate, transcript-to-CBH-inquiry conversion. Push generalizable patterns to `data/engagement/toj-transcript-candidates-[YYYY-WW].md` per the standard network loop.

*This is v1.0 — a template inheriting the network's cohort pattern, tuned for STL's apex positioning. The first cohort cycle under this exact structure becomes the calibration commit.*
