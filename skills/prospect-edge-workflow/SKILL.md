# Prospect Edge Workflow — Skill

How the agent runs Coached by Hooks and STL athletes through **Prospect Edge**, Optimum Grading's film-grading app.

**Rewritten 2026-11-04** to match Kyron's update, "Prospect Edge: What It Is and How It Works" (Nov 4, 2026). It replaces the old Subject Report flow: trainer-graded transcripts, the nine-trait WR set, PDFs by email and the 4.0+ Athlete Certified flag.

---

## Two Kinds of Grade

| | Margin's own club (STL) | A CFR evaluation |
|---|---|---|
| Who grades | Margin, or staff he gives a seat | A CFR College Placement Specialist who has never trained the athlete |
| What it is | **Development notes** | The independent evaluation colleges can see |
| Who sees it | The athlete and the parent | Private until the parent shares it |
| Can a college see it? | **No** | Only as a link the family approves |

- Margin's club grades are development notes, not a CFR grade. They never go to a college or onto a public page. They are never called a transcript, a rating or an evaluation.
- **When a family wants colleges to see graded film, the parent signs up through CollegeFootballRecruiting.com (CFR).** The agent can explain CFR and give the parent the sign-up link. It never signs a family up, and never moves an athlete's data into CFR.

---

## Margin's Role in CFR

This is per the draft Head of College Placement addendum (v1.0, not yet signed). Until it's signed, treat it as draft.

- **Standard.** Margin sets the standard for how specialists critique plays and write reports.
- **His seat.** He has a Lead seat: he reads and comments on reports in every Region. He can't change grades, export or share.
- **He never grades.** He never changes, argues for or influences a released grade. Only the Standards and Safety Council's quarterly audit can change one.
- **His own athletes are firewalled.** That means Hooks Management clients, STL trainees and players he coaches. CFR routes them to a specialist in another Region, and his seat can't open their files.
- **He never messages an athlete under 18.** Contact goes through the parent.

**Gap the update exposes:** in Prospect Edge a seat sees the whole club, because seats aren't tied to athletes. Only the View Report role limits a seat to the reports the admin picks. So "his seat can't open that file" needs one of two setups:
- his seat is a View Report seat with his athletes' reports left out; or
- his athletes sit in a club where he has no seat.

Confirm which with CFR before the addendum is signed.

---

## Setting Up Margin's Club

1. **Sign up** on the Prospect Edge sign-up page. Whoever signs up becomes the Club Admin: Margin, or the person he names to run operations.
2. **Load the five CFR traits** at each position: Alignment, Assignment, Technique, Execution and Pursuit. A position's weights add up to 100%. Development notes then use the same words families hear from CFR, and CFR can walk the club through it.
3. **Load the roster** from the Prospects template, one athlete at a time or as a file. For a minor, load only what grading needs: name, position, class, jersey number and team.
   - Leave height, weight and social links blank unless the parent asks.
   - Add a photo only with the consent flag on file.
4. **Create an event** for each game, combine or training session. Load one clip per play from the End Zone, Sideline or Eagle Eye angle.
5. **Grade every play.** Mark each trait plus, minus or not graded. Margin or the staff member grades; the agent never does.
6. **Track progress** with Player Progression. That's the development story the family sees.

---

## Seats

- A club holds up to **20 seats and 2,500 athletes**.
- There are six roles: Club Admin, Create & Grade Prospects, Create Prospects, Grade Prospects, View Only and View Report.
- **A seat sees the whole roster.** Give one only to someone who should see every athlete in the club.
- Don't give seats to creators or content crews.
- If adult managed athletes are graded at all, keep them in a separate club from the training clients, who are minors.

---

## Reports

| Report | Use |
|---|---|
| Prospect Report | Share with the parent, or with the athlete if 18 or older |
| Player Progression | Show the family how the grades move from game to game |
| Comparison Report | **Internal only.** Calibration between graders |
| Prospect Ranking | **Internal only.** It shows other athletes' names and grades |

- Outside the club, quote the percentage, never the star label.
- Printing and export stay internal. Share a report as its link, not as a PDF, and never save report files in this repo.

---

## Prospect List and the College Directory

- The **College Directory** (893 programs) is fine for research and fit lists.
- **Margin's club never sends a Prospect List to college coaches.** Development notes aren't an evaluation. Colleges see graded film only through CFR, as a link the family approves.
- An advocacy call (`skills/cbh-advocacy/SKILL.md`) rests on what Margin has seen in person. It can point a coach to a family-approved CFR report, never to his own club's grades.

---

## What the Agent Does

- Sets up events, loads film, queues plays and surfaces game context.
- Writes up Margin's notes in his words for the family. Minors go through `skills/parent-comms/SKILL.md`; managed adults go through `skills/athlete-brand-pipeline/SKILL.md`.
- Never grades, re-grades, inflates or invents a grade.

---

## What the Agent Tracks Per Athlete

```yaml
athlete_id: hooks-roster-001        # an ID only: no name, contact or film link in this file
position: WR
funnel_source: cbh | stl | athlete_brand_pipeline
club: stl_development               # Margin's club: development notes
development:
  - event: 2026-W30-game
    graded_by: margin
    plays_graded: 14
    shared_with_family: yes         # Prospect Report link to the parent (or the athlete, 18+)
cfr:
  family_signed_up: no              # the parent signs up through CFR; the agent never does
  firewall_confirmed: n/a           # yes once CFR confirms Margin can't open this athlete's file
consent:
  parent_consent: yes
  photo_consent: pending
  film_use_consent: yes
```

---

## Hard Rules

- Never invent a grade. Never inflate. Never re-grade a play without explicit instruction.
- Margin's club grades are development notes. They are never sent to a college, never on a public page, and never called a CFR grade, a transcript or a rating.
- Margin never grades, reviews or discusses one of his own athletes in CFR, and never changes or argues a CFR grade.
- A report reaches a college only as a CFR link the family approves.
- Ranking and Comparison reports never leave the staff.
- No promises about offers, rankings or scholarships. No pay moves with a grade or an outcome (NCAA Bylaw 12.3.3.1).
- Minors: a consent flag comes before a photo or any public mention, and contact goes through the parent.

---

*Development notes help the athlete get better. The independent grade is what a college can trust. Keeping the two apart protects both, and protects Margin's credential.*
