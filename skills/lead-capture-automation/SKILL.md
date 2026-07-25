# Lead Capture Automation — Every Inbound, Tagged and Routed

> **⬢ Operating altitude:** `T → P` · CRM backbone · runs continuously without Margin having to trigger it
> **⬢ Trusted-agent spec (7Q):** shadow-pending · initial calibration during August build
> **⬢ Operational lead:** Kyron (build) · Will (billing integration handoff) · automation runs autonomously post-launch

**Purpose:** Every lead captured. Every lead segmented. Every lead routed into the correct nurture — automatically, at the moment of inquiry. This is the layer that stops leads leaking out before Margin ever sees them.

**Return:** more consults on the calendar without Margin spending more time chasing replies. Leads that go silent today get caught.

---

## What gets captured

**Every inquiry, from every surface, routes into the CRM:**
- Website intake form (main STL site + ad-specific landing pages)
- Instagram DM (via `sales-qualification-agent/`)
- X comment or reply
- Referral submission (via `athlete-referral-program/`)
- Roster-network intro from Margin's personal contacts (pre-tagged)

**Minimum captured fields at first touch:**
- Athlete name + level (Youth · HS underclassman · HS upperclassman · College · Alumni)
- Parent name (if athlete is minor)
- Contact (phone or email)
- Position / graduation year (if provided)
- Source (which surface routed them in)
- Segment tag (per `client-segmentation/`) — auto-tagged from level

---

## Ad-specific landing pages

**The main site page informs.** It has nav, program info, breadth.

**Paid traffic needs the opposite.** A stripped-down landing page matched to the ad's exact message:
- One headline
- One outcome
- One call to action
- One form (name · level · goal)

**Anti-pattern:** sending ad clicks to the main STL page. That spends ad dollars to educate instead of convert. Every paid campaign gets its own dedicated landing page.

---

## Lead intake form ahead of the calendar

**Discovery-call booking sits behind a short contact form.** Name · athlete level · goal · film link (optional).

**Why the form goes before the calendar:** even a visitor who abandons before booking becomes a tracked lead — tagged by segment, routed into nurture. Without the form-first pattern, visitors leave with no record they were ever there.

**Fields ordered by lowest friction:**
1. Athlete first name
2. Level (dropdown · maps to segment)
3. Goal (one line · freeform)
4. Contact
5. Film link (optional)

---

## Routing logic per segment

| Segment tag | Auto-fires |
|---|---|
| Youth / HS | Parent-focused nurture (`parent-comms/` register) · 3-touch education sequence · booking prompt at touch 4 |
| College-Bound | Athlete-focused nurture · recruiting-window messaging · booking prompt at touch 2 |
| Alumni / Pro-Track | No nurture — direct-to-Margin notification for personal follow-up |
| Roster-referral | Direct-to-Margin + tagged for `roster-revenue-share/` tracking |

---

## Where this connects downstream

- **Consult booked:** hands off to `session-booking-no-show/`
- **Booked but did not attend:** hands off to no-show recovery
- **Consult attended · didn't buy:** "still deciding" branch (part of Lead Nurture · timed to season)
- **Consult attended · signed package:** hands off to `onboarding-sequence/`
- **Never books:** stays in long-run nurture (light-touch in-season · active off-season · winter · spring evals · summer)

---

## Anti-patterns

- Generic contact form that doesn't segment at intake
- Booking calendar with no form gate (loses uncommitted visitors)
- Same nurture cadence firing regardless of segment
- Ad traffic → main site page (spends money to teach instead of convert)

---

## Success signal

- 0 inbound inquiries lost between surface (IG · X · site · referral) and CRM
- 100% of leads tagged at intake with a segment
- Nurture opt-outs and reply rates tracked per segment (feeds `outcomes-based-communication/` calibration)

---

## Cross-skill integration

- **`client-segmentation/`** — every lead reads segment tag from here
- **`sales-qualification-agent/`** — social/DM inbounds classified before landing in nurture
- **`session-booking-no-show/`** — takes over once a lead books
- **`onboarding-sequence/`** — takes over once a lead becomes a client
- **`account-health-agent/`** — reads pipeline stage from CRM populated here
- **`roster-revenue-share/`** — reads the "roster-referral" tag set at intake

---

*Lead capture is the doorway. Every lead through the door gets tagged, tracked, and routed automatically. Nothing leaks.*
