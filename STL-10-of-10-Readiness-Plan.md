# STL × Coached by Hooks — 10/10 Readiness Plan

**Owner:** Kyron Cumby · Trail of Joy Player Management Group, LLC
**Client:** Margin Hooks · Sky's The Limit WR + Coached by Hooks
**Deadline:** Pre-season — second week of August 2026
**Time remaining at v1.0 creation:** ~6.5 weeks (today: 2026-06-25)

The purpose of this document: lock the STL × CBH system to a 10/10 state before football season starts and Margin's attention goes entirely to athletes. After August 10, every minute Margin spends thinking about the operational system instead of about athletes is a system failure. This document defines what "10/10" actually means, where the gaps are, and what gets closed in the next 6 weeks.

---

## 1 — The Two-Brand Architecture (confirmed)

| Brand | What It Is | Constraint | Status |
|---|---|---|---|
| **Coached by Hooks (CBH)** | Margin's personal coaching brand. His eyes, his advocacy. | In-person required. Limited by Margin's calendar + physical presence. | Brand document v1.0 finalized. Pricing TBD by Margin. |
| **Sky's The Limit (STL)** | The platform that scales Margin's methodology globally. | Unlimited — system carries it. | Operational layers built across multiple artifacts. Integration check needed. |

**Working principle for all August prep:** every system decision is evaluated against one question — *does this require Margin's time/attention to operate, or does the system carry it?* If it requires Margin, it belongs in CBH. If the system can carry it, it belongs in STL. Mixing them collapses the value of both.

---

## 2 — The Two Funnels (confirmed by the CBH document)

```
ATHLETE FUNNEL                              TRAINER FUNNEL
──────────────                              ──────────────
STL community (free)                        STL community (free)
    ↓                                            ↓
Prospect Edge evaluation                    Cohort participation
    ↓                                            ↓
4.0+ flagged → SR transcript                Coached by Hooks
    ↓                                       Trainer Blueprint ($3.5-5K one-time)
Subject Media documents                          ↓
    ↓                                       STL Certified Trainer
Family wants direct access                       ↓
    ↓                                       Operates regionally in ecosystem
Coached by Hooks (in-person, premium)            ↓
    ↓                                       Becomes proof point that sells
Margin advocates to college coaches         the next Trainer Blueprint
```

**The flywheel** — every CBH athlete is potential CBH trainer-network referral source (parents become advocates). Every CBH-trained trainer is a future generator of CBH-eligible athletes through their own regional pipeline. The two funnels feed each other indefinitely. This is the whole architecture.

---

## 3 — Component Readiness Checklist

Each row is one component of the STL × CBH system. **Kyron marks status** before the August walkthrough so Margin sees an honest readiness picture, not aspirational claims. The four status values are:

- **🟢 Live** — built, tested, running in production
- **🟡 Built — needs final pass** — functional but a polish step away from 10/10
- **🔴 Built — but not integrated** — exists, but doesn't yet talk to the rest of the system
- **⬜ Not yet built** — gap to close before August 10

### Brand & Strategy Layer

| Component | Source Document | Status | Owner | Note |
|---|---|---|---|---|
| **`hooks-os` operating brain (CLAUDE.md + 12 skills + workflows + data structure)** | `hooks-os/` | 🟡 v1.0 built — needs voice calibration + roster lockdown | Kyron + Margin | **NEW as of 2026-06-25.** Margin now has his own dedicated repo. v1.0 founding has all 12 lessons from Joshua + Max pre-applied. Three Margin-unique skills built: athlete-brand-pipeline, trainer-blueprint, cbh-advocacy. |
| Voice calibration (corpus pull + tightening) | `hooks-os/skills/margin-voice/SKILL.md` | 🔴 Skill exists, calibration pending | Kyron | Pull 30+ pieces of Margin's public content, catalog phrases/hooks/cues, tighten the spec. Pre-August. |
| Athlete-management roster lockdown | `hooks-os/data/athletes/_management-clients/` | 🔴 Folder structure ready, roster not populated | Kyron + Margin | Confirm which of 6 NFL + 30+ P4 athletes are in v1.0 brand-build cohort. Athlete-by-athlete consent. |
| STL operating brain (legacy reference) | `stl-operating-brain.html` | 🟢 Live (reference document) | Kyron | Existing spec doc that informed `hooks-os` build — retain as historical reference. |
| CBH × STL brand document | `coached-by-hooks-stl.pdf` | 🟢 Live | Margin + Kyron | v1.0 finalized this week. Integrated into `hooks-os/CLAUDE.md`. |
| CBH pricing finalized | Margin's call | _____ | Margin | Three athlete options proposed ($2.5-3.5K block · $5-8K annual) + Trainer Blueprint $3.5-5K. Lock before August walkthrough. |
| Trainer Blueprint productization sign-off | `hooks-os/skills/trainer-blueprint/SKILL.md` | 🟡 Productization spec written — needs Margin sign-off | Margin + Kyron | 12+8 modules · DFW immersion · 1:1 calls · network kit · repo seeded. Margin confirms deliverable list. |
| Season campaign plan | `stl-season-campaign-plan.html` | _____ | Kyron | Confirm the "training session IS the camp" insight is reflected in the `hooks-os` operational stack. |

### Distribution Layer (STL)

| Component | Source Document | Status | Owner | Note |
|---|---|---|---|---|
| Website + 7 agents | `stl-website-agent-spec.html` | _____ | Kyron + dev | 7 agents: Lead Qual, Booking, Film Submission, Cohort Waitlist, Community Membership, Coach Database, Athlete Profile Auto-Publish |
| GHL pipelines (Player Mgmt + Cohort) | Section 3 of TOJ Master SOP | _____ | Kyron | Two pipelines spec'd in Section 3. Add Pipeline 3 (Camps & Events) when relevant. |
| GHL automation sequences | Section 3 of TOJ Master SOP | _____ | Kyron | Sequence A (Player Mgmt Inquiry) + Sequence B (Cohort Waitlist Nurture) |
| Calendar booking | Section 3 of TOJ Master SOP | _____ | Kyron | 30-min STL discovery call · 15-min buffer · auto-reminders · no-show automation |
| Cohort program operational | season campaign + STL doc | _____ | Margin + Kyron | Cohort dates set, curriculum locked, enrollment open before season starts |
| Community membership ($99/mo) | CBH/STL doc | _____ | Kyron | Stripe-gated portal · weekly content from Margin · onboarding sequence |
| Coach database | OG ecosystem + STL doc | _____ | Kyron | Subscribing college staffs access verified athlete profiles · pricing TBD |
| Subject Media content cadence | growth-execution-dashboard | _____ | Subject Media | 30+ posts/month documenting the brand. Confirm production pipeline runs without Margin's input. |

### Apex Layer (Coached by Hooks)

| Component | Status | Owner | Note |
|---|---|---|---|
| CBH athlete in-person session calendar | _____ | Margin | Sessions per year minimum defined by Margin |
| CBH athlete pricing locked | _____ | Margin | Intensive block, annual program — Margin's call |
| CBH Trainer Blueprint productized | _____ | Margin + Kyron | $3.5-5K one-time · what gets delivered · how the engagement runs |
| CBH advocacy protocol | _____ | Margin | How Margin handles the college coach phone call · how it gets tracked in GHL |
| Subject Media coverage of in-person CBH sessions | _____ | Subject Media | SubjectSkillz creators on-site for documentation |

### Trainer Network Layer

| Component | Status | Owner | Note |
|---|---|---|---|
| STL Partner tier definition | _____ | Kyron + Margin | Ross Alpeau model · what makes someone a Partner |
| STL Certified Trainer tier definition | _____ | Kyron + Margin | Trainer Blueprint graduates · cohort-hosting rights · revenue share spec |
| STL Affiliate tier definition | _____ | Kyron | Aligned with methodology · referral fees · Prospect Edge access |
| Active trainer roster | _____ | Kyron | Ross Alpeau (existing) · Joshua (in-progress) · Max (pre-signing) · Kyron (active) |
| Trainer network agreement template | _____ | Kyron | Sub-agreement under STL × TOJ for network trainers |

### Evaluation Backbone (Network-Level)

| Component | Status | Owner | Note |
|---|---|---|---|
| Prospect Edge under TOJ affiliate | 🟢 Live | TOJ × OG | Existing affiliate agreement |
| SR transcript production flow | _____ | Kyron | From PE grade → transcript → family delivery |
| 4.0+ Athlete Certified routing | _____ | Kyron + Dylan | Auto-flag + handoff to AC team |
| Cross-trainer evaluation routing | _____ | Kyron | Out-of-specialization positions route between trainers |

### Operating Intelligence (Network-Level)

| Component | Status | Owner | Note |
|---|---|---|---|
| Master Trail-of-Joy Intake SOP v2.0 | 🟢 Live | Kyron | Updated this week with brand-naming, onboarding config, network registration |
| TOJ Operational Transcript v1.0 | 🟢 Live | Kyron | Seven founding entries logged; weekly compounding from each client repo |
| TOJ Network Brain README v1.0 | 🟢 Live | Kyron | Federation model documented |

---

## 4 — The August Walkthrough Agenda (Margin's Side)

A structured walkthrough Kyron delivers to Margin in early August (target: first week of August so Margin has buffer before season). One Zoom session, ~90 minutes, recorded. Margin should leave it knowing exactly what runs without him and what still needs his input during season.

### Block 1 — The Two Brands (15 min)
Show the CBH × STL document. Confirm what each brand does, what Margin personally owns vs what the system owns. The principle every season decision routes through.

### Block 2 — The Two Funnels (15 min)
Walk the athlete funnel and the trainer funnel end-to-end. Show where each step is automated (GHL sequences, content cadence, evaluation flow) and where Margin's input is required (CBH athlete sessions, CBH advocacy phone calls, Trainer Blueprint final approvals).

### Block 3 — The Component Readiness Table (30 min)
Walk Section 3 of this document live with Margin. Every row, marked status. Identify the 🟡 and 🔴 rows that need to close before season. Identify ⬜ rows that can defer to mid-season or post-season.

### Block 4 — What Runs Without You During Season (15 min)
Explicit list of what Margin does NOT touch during season: Subject Media content production, STL community management, Prospect Edge evaluation queue (Kyron + reviewers), cohort marketing, cold outreach (per `config.md`), engagement monitoring, follower-trigger reach-out. **The list of "things Margin doesn't touch" is the proof the system works.**

### Block 5 — What You Still Do (10 min)
Equally explicit. CBH in-person sessions. CBH advocacy calls. Trainer Blueprint approvals on candidate trainers. Final-mile content (Margin's voice on the things only Margin can voice). Approval gate for anything the system flagged for review.

### Block 6 — The 90-Day Post-Season Plan (5 min)
What gets activated when season ends. What gets reviewed. What gets evolved.

---

## 5 — Gaps to Close Before August 10

This section gets filled in as Kyron marks status above. Below is the **template structure** — each gap becomes a workstream with an owner, a deadline, and a definition of done.

```
GAP 1: [component name]
  Current status: [where it is]
  Definition of 10/10: [what done looks like]
  Owner: [Kyron / Margin / Subject Media / dev / other]
  Deadline: [specific date]
  Dependencies: [what has to happen first]
  
GAP 2: ...
```

Working assumption (revisable when status is marked): the most likely critical gaps are (a) CBH pricing finalization by Margin, (b) Trainer Blueprint productization (the actual deliverables a trainer gets for $3.5-5K), (c) GHL pipeline + automation sequence implementation if Section 3 wasn't already executed, (d) cohort program enrollment readiness for the season-launch cohort. **Confirm or correct against actual status before committing the workstreams.**

---

## 6 — What This Document Is and Isn't

**This is** — the spine of the August walkthrough. The structured checklist Margin sees. The clarity-forcing function that makes "10/10 ready" a thing you can verify, not a vibe.

**This isn't** — the actual buildout of the gaps. That work happens in the individual artifacts and the GHL build. This document is the index.

---

## 7 — Tracking This Document Itself

Versioned. Every status mark, every closed gap, every walkthrough revision logged in a tail-of-file changelog.

- **v1.0** — 2026-06-25 — Founding scaffold. Component table established. Walkthrough agenda drafted.
- **v1.1** — _____ — Kyron's first-pass status marks.
- **v1.2** — _____ — Post-walkthrough revisions from Margin's session.
- **v2.0** — _____ — Post-season retrospective.

---

*This document is the operational asset of the August deadline. The system is 10/10 when every row is 🟢 or honestly deferred. No vibes. No "mostly there." Marked status or it isn't ready.*
