# Roster Revenue Share — TOJ Partnership Terms

> **⬢ Operating altitude:** `E` · commercial layer · defines the partnership between TOJ and Margin's existing network
> **⬢ Trusted-agent spec (7Q):** shadow-pending · contract calibration during August walkthrough
> **⬢ Operational lead:** Kyron (contract owner) · Margin (roster origin authority) · CRM (automatic tracking · zero manual logging)

**Purpose:** For any athlete who comes from Margin's existing roster, alumni network, or personal relationships and becomes an active paying client through this system, **TOJ receives a 10% revenue share of that athlete's earnings for as long as they remain a client.**

**Why the arrangement:** roster-referred athletes convert at a far higher rate than cold leads and cost nothing to acquire. The value TOJ is building is the infrastructure that turns a name Margin already knows into a tracked, recurring paying client — not just the introduction itself.

**Note on origin:** an earlier version of this term named a different entity as the revenue-share partner. That's no longer the operating agreement. **TOJ owns this partnership term.** All roster referrals feed the TOJ commercial layer directly.

---

## What triggers the revenue share

**A revenue share is owed to TOJ when:**
1. The athlete is tagged at intake as originating from Margin's existing roster, alumni network, or personal relationships
2. The athlete signs a paying package (any tier · Youth/HS · College-Bound · Alumni retainer)
3. Payment successfully processes (not just signed · actually collected)

**10% of the collected revenue is TOJ's share for as long as the athlete remains an active client.**

---

## What does NOT trigger the revenue share

- Athletes acquired through **new marketing** (ad traffic · organic social · newsletter conversions from cold traffic) — these are new revenue TOJ built through the system, not Margin's pre-existing network
- Athletes referred through the **client-facing referral program** (`athlete-referral-program/`) who did NOT originate from Margin's roster
- Trainer Blueprint sales (`trainer-blueprint/`) — separate commercial terms
- Existing clients Margin was already training before the system launched — grandfathered unless the athlete themselves signs a new package post-launch

**The distinction:** roster referrals = Margin's relational asset. New acquisition = TOJ's infrastructure asset. Different value creation · different terms.

---

## How it gets tracked

**Automatic · zero manual logging:**
- Every lead is tagged at intake (per `lead-capture-automation/`) with a source field
- Source options: `cold-inbound` · `paid-ad` · `client-referral` · `roster-referral` · `alumni-network` · `direct-margin-intro`
- `roster-referral`, `alumni-network`, and `direct-margin-intro` tags all trigger the revenue-share calculation
- Revenue-share amount computed off actual collected revenue (per `package-renewal-tracking/` payment webhook) · not off expected or invoiced amounts

**Reporting:**
- Monthly statement generated automatically · sent to both parties
- Line items: athlete · package · collected · TOJ share · running total
- No hand-tracking · no memory · no goodwill that never shows up on a statement

---

## Why it's structured this way

**Roster-referred athletes:**
- Convert at rates 3-5x cold inbound
- Have near-zero acquisition cost
- Carry the trust of a real relationship into the sales conversation
- Renew at higher rates because the trust predates the transaction

**The value TOJ is building is not the introduction itself.** Margin's relationships are Margin's. What TOJ is building is:
- The intake infrastructure that captures the referral cleanly
- The lifecycle automation that keeps the referred athlete engaged
- The billing infrastructure that recovers renewals automatically
- The recap discipline that makes retention feel earned

**The 10% pays for the infrastructure that turns a name into a client — and keeps them one.**

---

## What this runs alongside

**This term runs alongside — not instead of — the athlete referral program:**
- `athlete-referral-program/` is the client-facing referral MECHANIC (incentive, ask, tracking)
- `roster-revenue-share/` is the COMMERCIAL ARRANGEMENT for referrals that originate from Margin's own roster

**Both can fire on the same conversion:**
- Marvin (alumni) refers his younger brother
- Referral program: Marvin gets the alumni-tier incentive
- Roster revenue share: TOJ gets 10% of the brother's package revenue for as long as he's a client

**No double-dipping · both are computed independently on the same conversion event.**

---

## Contract-level considerations

- **Term:** as long as the athlete remains an active paying client (no time cap)
- **Termination:** if TOJ's infrastructure ceases operation OR if the operating agreement between TOJ and Margin's business ends, the revenue share unwinds per the terms of the operating agreement
- **Audit rights:** TOJ has the right to audit the roster-referral tag classifications quarterly · Margin has the right to reclassify any lead
- **Dispute resolution:** any disputed classification is resolved with a written note in the CRM lead record · defaults to Margin's call when ambiguous
- **Non-compete boundary:** this term does not restrict Margin from operating roster relationships outside the STL/CBH tiers · it applies only to conversions through the STL/CBH system

**All specific contract language finalized in the master TOJ-Margin operating agreement.** This skill file is the operational-brain frame · the legal instrument is separate.

---

## Anti-patterns

- Applying the revenue share to cold-inbound conversions
- Retroactively applying to Margin's pre-system existing clients
- Manual quarterly reconciliation instead of automatic per-payment calculation
- Ambiguous or contested classifications going unresolved past one billing cycle
- Treating this as an obstacle to referrals (it should be invisible to the family experience · pure back-office)

---

## Success signal

- 100% of new leads tagged with source at intake
- Monthly automatic statement generated on schedule · zero manual reconciliation
- Roster-referred conversion rate tracked and reported (should stay 3x+ over cold conversion)
- Zero disputed classifications past one billing cycle

---

## Cross-skill integration

- **`lead-capture-automation/`** — source tag captured at intake
- **`package-renewal-tracking/`** — payment webhook triggers the revenue-share calculation
- **`athlete-referral-program/`** — sibling mechanic · both fire on qualifying conversions
- **`client-segmentation/`** — segment routing does not affect revenue-share status (all segments eligible)
- **`cbh-advocacy/`** — Alumni network is a primary source of roster referrals · advocacy timing often generates them

---

*Roster referrals are the highest-value conversions in the system. The 10% is what turns Margin's existing goodwill into tracked, recurring revenue for the infrastructure that keeps them paying. Automatic. Auditable. Aligned.*
