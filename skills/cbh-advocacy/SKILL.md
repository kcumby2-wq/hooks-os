# CBH Advocacy — Skill

How the agent supports and logs **Margin's personal advocacy** for Coached by Hooks athletes — the phone call he makes to college coaches when they ask about an athlete. This is the credibility weapon. The brand is built on the fact that **26 NFL players, 160+ D1 athletes, 28 HS All-Americans, 11 College All-Americans, 6 Five-Stars, and 1 Pro Bowler** sit behind every advocacy call Margin makes. No other trainer in the country makes that call with that record behind it.

The agent does not make the calls. **Margin does, personally.** The agent's job is to make sure every call is set up well, logged completely, and feeds back into the system as both content and attribution evidence.

---

## What Counts as Advocacy

Three types of advocacy events:

| Type | Who Initiates | What Happens | Frequency |
|---|---|---|---|
| **Inbound advocacy call** | College coach calls Margin asking about an athlete | Margin gives an honest, comprehensive read on the athlete's film, character, development arc | Heaviest in fall + signing windows |
| **Outbound advocacy call** | Margin proactively calls a coach about an athlete he believes fits the program | Margin opens the door before the athlete's name is on the coach's radar | Year-round, especially as athletes mature |
| **Outbound advocacy text/email** | Lighter touch — Margin sends film or a recommendation note | Lower-cost relationship maintenance | Rolling |

All three are tracked. **All three count.** The attribution ledger doesn't care which initiator type — it cares that Margin spoke on behalf of the athlete and the outcome was logged.

---

## The Advocacy Log Structure

Every advocacy event creates a file:

`data/advocacy-calls/[YYYY-MM-DD]-[athlete-id]-[coach-school].md`

Each file contains:

```yaml
date: 2026-09-12
athlete_id: hooks-roster-001  (or hs-eval-014)
athlete_name_internal: [first last]
athlete_class: 2027 (or pro/college/etc.)
coach_name: [first last]
coach_school: [school]
coach_role: [Head Coach / Position Coach / Recruiting Coordinator]
event_type: inbound | outbound_call | outbound_text | outbound_email
initiated_by: coach | margin
duration_minutes: 18
margin_summary: |
  [Margin's own words after the call — short paragraph on what he said,
   what the coach asked, what was left open, what's next.]
content_opportunity: yes/no (e.g., athlete had a great workout the coach mentioned — content angle)
follow_up_required: yes/no
follow_up_action: [what · who · by when]
attribution_chain: |
  [How this call connects to prior touches — was this the 3rd call about
   this athlete? Did the coach mention seeing SR transcript? PE evaluation
   reference? Subject Media content reference?]
outcome_pending: [open · offer expected · likely no · etc.]
```

After the outcome resolves (offer made, no offer, athlete commits, athlete to portal, etc.), the file is appended with the outcome and date. **The full thread becomes the case study.**

---

## What the Agent Does Before an Advocacy Event

When Margin signals an advocacy call is coming (inbound calendar, outbound he's planning, etc.):

1. **Pull the athlete's full file** — `data/athletes/[X]/profile.md`, latest PE evaluation, recent session notes, any prior advocacy events on this athlete.
2. **Prepare a 1-page pre-call brief** — current stats, latest film read, character notes, prior coach inquiries (if any), exclusivity / portal / amateurism flags. Saved to `output/advocacy-briefs/[YYYY-MM-DD]-[athlete-id].md`.
3. **If outbound** — surface why this coach + this athlete: prior recruiting history, position need, geographic fit. Help Margin walk into the call with an opening, not a cold ask.
4. **Coach context** — what does the agent know about this coach (prior calls, prior placements, school's current roster)? Surfaced if available.

The pre-call brief is for Margin's eyes only. Three-minute read before he dials.

---

## What the Agent Does After an Advocacy Event

1. **Capture Margin's debrief** — Margin voice-memos or texts a 60-second debrief. Agent transcribes into the log file.
2. **Identify content opportunity** — was anything said that becomes a content moment (with consent)? Flag for Subject Media coordination.
3. **Trigger follow-ups** — if the coach asked for film, the agent ensures Hudl + PE links are sent within 24 hours. If the coach wanted the athlete's grades, the agent flags it to Kyron + Margin (this is athlete-side coordination, not direct agent action).
4. **Update the athlete's record** — `data/athletes/[X]/advocacy-log.md` gets the entry. The athlete's status in GHL gets a tag: `advocacy-active` or similar.
5. **Update the coach record** — `data/coaches/[school]/[name].md` gets a touchpoint added. This builds the coach network into a searchable asset over time.

---

## The Attribution Ledger (The Credibility Engine)

Every advocacy call → log → outcome chain feeds the **attribution ledger**: a long-form record of *Margin spoke for this athlete on this date; this is what happened.*

That ledger is the credibility infrastructure of the entire CBH brand. It does three things:

### 1. Sales asset (for future CBH clients)
When a parent asks "what does Margin's advocacy actually look like?" — the answer is a redacted summary of recent advocacy events, the outcomes, the attribution. The pipeline of "Margin called → coach offered" becomes documented social proof rather than verbal claim.

### 2. Network proof (for Trainer Blueprint sales)
Trainers buying the Blueprint want to know that the Margin-network-and-relationships are real. The attribution ledger demonstrates that Margin's calls move outcomes. The Blueprint buyer eventually gets the right to make smaller versions of those calls in their own region — but only because Margin's pattern exists to model on.

### 3. Subject Report transcript credibility
When SR transcripts go out to coaches, they land harder if the coach knows Margin will pick up the phone after they read it. The advocacy ledger reinforces that connection.

---

## Compliance Boundaries

- **No promises about offers** — Margin's advocacy is honest read, not deal-making. He tells coaches what the film shows and what character he's seen. He does not promise what the coach will do with that information.
- **No reciprocal arrangements** — Margin does not advocate for an athlete in exchange for the coach favoring another. Each call stands alone.
- **NIL & amateurism awareness** — for college recruits, every advocacy event is logged with an amateurism-status flag. For pro draft prospects, NFLPA-aware caution applies.
- **No advocacy without the athlete's knowledge** — for active recruits, the athlete and family know Margin has been in contact with the coach. Surprise calls are not Margin's style.
- **Conflicts of interest** — if Margin's signed roster (athlete management) and his CBH advocacy intersect (e.g., a signed athlete also being advocated for a different program), the agent flags it to Kyron for routing logic.

---

## Cross-Skill Hand-offs

- **→ `skills/prospect-edge-workflow/SKILL.md`** — every advocacy call references the athlete's most recent PE transcript. If the coach hasn't seen it, the agent ensures it's sent within 24 hours.
- **→ `skills/subject-media-coordination/SKILL.md`** — advocacy moments worth documenting (with consent) become Subject Media content. The "Margin called X coach about [athlete]" content is gold for CBH brand-build.
- **→ `skills/athlete-brand-pipeline/SKILL.md`** — when the athlete is also a TOJ-partnered brand-build client, the advocacy event feeds directly into their brand narrative + potential deal pipeline.
- **→ `skills/cohort-design/SKILL.md`** — successful advocacy outcomes (offer received, commitment made) become teaching examples in the next cohort.

---

## The Weekly Advocacy Report

Every Monday, the agent compiles `output/reports/advocacy-week-[YYYY-WW].md`:

```
## Advocacy Pulse — Week [WW]

### Calls This Week: [count]
- Inbound: [X]
- Outbound: [X]
- Texts/Emails: [X]

### Athletes Advocated For: [list with role tags]

### Coach Network Touched: [count of distinct coaches]
- New relationships: [list]
- Maintained relationships: [list]

### Outcomes Resolved This Week
- [Athlete] → [School] → Offer / Commit / No / Other → [Date]

### Pending Outcomes
- [Athlete] → [School] → Status → [Expected resolution date]

### Content Opportunities Surfaced
- [List items flagged to Subject Media]

### Flagged to Kyron / Margin
- [Anything needing attention]
```

Five-minute Monday read. Margin sees what his calls produced. Kyron sees the attribution chain compounding.

---

## Calibration

The first 90 days of logging set the system's baseline. Patterns that emerge:

- **Call → outcome conversion rates** by coach, school, position, class year.
- **Outbound vs inbound effectiveness** — does Margin's proactive call beat waiting?
- **Content-pull from advocacy events** — what percentage of advocacy events produce shareable content moments?
- **Cross-system effects** — does logging advocacy reduce the time-to-PE-share, increase SR transcript credibility, etc.?

All push to `improvements.md` and the TOJ Operational Transcript per the standard cycle.

---

*The advocacy call is the credential. The log is the proof. The attribution ledger is the sales asset for the next 100 CBH conversations. Protect the log discipline and the credential defends itself.*
