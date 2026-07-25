# Master Operating Agreement

**Between:** Trail of Joy Player Management Group ("**TOJ**") — represented by Kyron Cumby, Principal

**And:** Margin Hooks / Sky's The Limit WR / Coached by Hooks (collectively, "**Margin**") — represented by Margin Hooks, Principal

**Effective Date:** _______________ (to be set at signing)

---

> ⚠️ **DRAFT · v0.1 · 2026-07-25 · attorney review required before signing**
>
> This document codifies the commercial and operational arrangement between TOJ and Margin as it currently operates in the [`hooks-os`](../) repository. It is drafted to reflect intent, not to serve as final legal counsel. **Both parties must have this reviewed by their own attorney before execution.** All bracketed items marked `[REVIEW]` are decisions that require attorney input or a joint principal call before final language is set.

---

## 1. Recitals

**WHEREAS**, Margin has built a decade of coaching authority and a roster of active and alumni athletes in the wide-receiver development space through Margin Hooks (professional training), Sky's The Limit WR ("**STL**") (athlete platform + membership), and Coached by Hooks ("**CBH**") (college placement advocacy);

**WHEREAS**, TOJ has built the operating infrastructure — CRM automation, lifecycle sequences, agent-layer intelligence, recap discipline, revenue-share tracking, content production cycle, and the codified operating brain documented in the `hooks-os` repository — that converts Margin's coaching authority into recurring, tracked, high-retention paying client revenue;

**WHEREAS**, the parties wish to formalize the terms under which TOJ provides the operating infrastructure to Margin, receives compensation for that infrastructure, and defines the ownership boundaries between Margin's coaching craft and TOJ's operating system;

**NOW THEREFORE**, in consideration of the mutual covenants below, the parties agree:

---

## 2. Definitions

For purposes of this Agreement:

- **"Operating Brain"** — the collection of skill specifications, runtime infrastructure, agent code, content workflows, and CRM configuration documented in the `hooks-os` repository, as maintained and evolved by TOJ.
- **"Roster Referral"** — an athlete who becomes a paying client of Margin's business AND whose intake was tagged with source `roster_referral`, `alumni_network`, or `direct_margin_intro` under the `client-segmentation` / `lead-capture-automation` skills in the `hooks-os` operating brain.
- **"New Acquisition"** — an athlete who becomes a paying client through channels that did NOT originate from Margin's pre-existing network: paid ads, cold inbound, organic social, newsletter, and client-to-client referrals not sourced from the roster.
- **"Collected Revenue"** — revenue actually received (net of refunds, chargebacks, and processor fees) by Margin's business from a given client during the client's tenure as an active paying customer, as recorded by the payment processor and mirrored in the `payment_events` table.
- **"Active Client"** — an athlete or family with at least one non-expired paying package (per `packages.status = 'active'` in the operating brain schema).
- **"Trainer Blueprint"** — the separate certified-trainer program governed by its own commercial terms (`skills/trainer-blueprint`). Blueprint sales are **excluded** from this Agreement's revenue-share scope.

---

## 3. Scope of Services

TOJ shall provide, maintain, and evolve the Operating Brain on Margin's behalf, including but not limited to:

**3.1 Operating infrastructure:**
- Lead capture, segmentation, and routing (skills: `lead-capture-automation`, `client-segmentation`)
- Consult booking and no-show recovery (`session-booking-no-show`)
- Onboarding lifecycle sequences per segment (`onboarding-sequence`)
- Package renewal cadence (30/14/7 day) and payment recovery (`package-renewal-tracking`)
- Post-session recap generation and delivery within 4-6h SLA (`post-session-recap-agent`)
- Account-health monitoring and intervention queuing (`account-health-agent`)
- Inbound qualification and consult booking (`sales-qualification-agent`)
- Voice-consistency enforcement across all agent-generated communication (`outcomes-based-communication`, `margin-voice`)

**3.2 Content and marketing operations:**
- Weekly Release Room Friday production cycle (`release-room-friday`, `subject-media-coordination`)
- Athlete referral program mechanics (`athlete-referral-program`)
- Outbound outreach coordination (`cold-outreach`)
- Engagement monitoring and weekly Monday review (`engagement-monitoring`)

**3.3 Commercial infrastructure:**
- Revenue-share tracking and monthly statement generation (`roster-revenue-share`)
- CRM ↔ Supabase field synchronization and data integrity (`infra/`)
- Stripe integration and payment webhook processing

**3.4 Ongoing evolution:**
- Iteration on skill specifications as the operating brain learns from feedback
- Bug fixes, integration maintenance, and infrastructure upgrades
- Documentation of every rule change in `improvements.md` for auditable evolution

**3.5 What is NOT within TOJ's scope:**
- Coaching delivery (Margin's craft)
- Athlete evaluation and grading (`prospect-edge-workflow`)
- College advocacy calls (`cbh-advocacy`)
- Trainer Blueprint candidate vetting (Margin personally vets every relationship)
- Content that requires Margin's personal presence, voice, or on-camera involvement (Margin remains the on-camera authority)

---

## 4. Compensation · Roster Revenue Share

**4.1 Revenue-share rate.** TOJ shall receive **ten percent (10%)** of the Collected Revenue attributable to every Roster Referral, for as long as that Roster Referral remains an Active Client.

**4.2 Automatic calculation.** The share is calculated automatically from `payment_events` records in the operating brain's Supabase schema. The `calculate_revenue_share()` function creates a `revenue_share_ledger` entry for every qualifying payment. No manual reconciliation is required.

**4.3 What triggers a share entry:**

  a. The athlete's `leads.source` is one of `roster_referral`, `alumni_network`, or `direct_margin_intro` at the time of package purchase.

  b. The athlete has an active package (any tier: STL Membership, STL Cohort, Prospect Edge, CBH Apex).

  c. A payment for that package has successfully processed (Stripe event: `payment_intent.succeeded` or `invoice.payment_succeeded`).

**4.4 What does NOT trigger a share entry:**

  a. New Acquisition clients (source: `cold_inbound`, `paid_ad`, `client_referral` from non-roster clients).

  b. Trainer Blueprint sales (`packages.tier = 'trainer_blueprint'`), which are governed by separate commercial terms.

  c. Athletes Margin was actively training as paying clients **before** this Agreement's Effective Date, unless they sign a **new** package post-Effective Date (a renewal or new package after Effective Date qualifies; the pre-existing engagement does not).

  d. One-off consultations, evaluations, or ad-hoc engagements that do not become a recurring package.

**4.5 Reversals.** Refunds, chargebacks, and partial refunds create a `reversal` entry in the ledger that offsets the corresponding accrual. Net owed for any period equals accruals minus reversals plus adjustments.

**4.6 Payout cadence.** A monthly statement is auto-generated on the first business day of each month covering the prior month's activity. Payout to TOJ is due within `[REVIEW: 15 or 30]` calendar days of statement issuance. Payout method: `[REVIEW: ACH · wire · Stripe transfer]`.

**4.7 Statement contents.** Each monthly statement includes: gross qualified revenue, total share accrued, reversals in period, net owed, per-client breakdown, per-package breakdown, and running ledger balance. Statement is delivered as PDF plus machine-readable JSON per the `revenue_share_statements` schema.

**4.8 Rate adjustment.** The 10% rate is fixed for the initial term. Rate revisions require written amendment signed by both parties and take effect prospectively only.

---

## 5. Intellectual Property

**5.1 TOJ ownership.** TOJ owns, and retains all right, title, and interest in:
  a. The Operating Brain codebase and specifications (all files in the `hooks-os` repository authored by TOJ or under TOJ's direction).
  b. The skill format, altitude framework, cross-skill integration pattern, and operating-brain architecture as a methodology.
  c. Agent prompts, voice-drift check logic, and generation templates.
  d. Analytics dashboards, reporting layer, and derived metrics infrastructure.
  e. The right to apply the Operating Brain methodology to other clients (non-competing verticals) so long as no client-specific data or Margin-specific voice signals leak between customers.

**5.2 Margin ownership.** Margin owns, and retains all right, title, and interest in:
  a. All coaching content, training methodology, drill progressions, grading standards, and instructional IP (the coaching craft).
  b. All athlete relationships, client rosters, and referral networks that pre-existed this Agreement.
  c. All footage, film, video content, and photography featuring Margin personally or featuring Margin's client athletes captured in Margin's programs.
  d. The Sky's The Limit WR, Coached by Hooks, and Margin Hooks brand assets, trademarks (registered or common-law), domain names, and social handles.
  e. The record book, credential, and personal reputation that attracts inbound in the first place.

**5.3 Client data.** All client data (leads, clients, sessions, communications) belongs to Margin's business as data controller. TOJ acts as data processor and infrastructure operator, with obligations to protect and not exfiltrate this data.

**5.4 Improvements.** Improvements to the Operating Brain developed during this Agreement belong to TOJ (methodology) unless they are Margin-specific customizations (voice patterns, brand-specific templates), which belong to Margin.

**5.5 Termination license-back.** Upon termination of this Agreement, TOJ shall provide Margin, at Margin's request and expense, a snapshot of the Operating Brain configuration specific to Margin's business (schemas, workflow specs, custom fields) sufficient for Margin to rebuild or transition the operating infrastructure. This snapshot does not include TOJ's general methodology or non-Margin-specific templates.

---

## 6. Confidentiality

**6.1 Definition.** "Confidential Information" means: client data, revenue figures, roster composition, unreleased content plans, agent prompts, private repository contents, and any information marked confidential or that a reasonable person would understand to be confidential.

**6.2 Obligation.** Each party shall protect the other's Confidential Information with the same care it uses for its own confidential information (and no less than reasonable care). Confidential Information may be used only for the purposes of this Agreement.

**6.3 Exclusions.** Information that is or becomes public through no breach of this Agreement, was rightfully known before disclosure, is independently developed, or is required to be disclosed by law is not subject to confidentiality obligations (though the receiving party will notify the disclosing party of any legally-compelled disclosure, where legally permitted).

**6.4 Client PII.** All client personally-identifiable information is treated as Confidential Information at the highest sensitivity. Neither party may sell, license, share, or use client PII outside the operation of Margin's business.

**6.5 Survival.** Confidentiality obligations survive termination of this Agreement for `[REVIEW: 3 or 5]` years, and indefinitely for client PII and trade secrets.

---

## 7. Term and Termination

**7.1 Initial term.** This Agreement runs for an initial term of `[REVIEW: 12 or 24]` months from the Effective Date.

**7.2 Renewal.** After the initial term, the Agreement auto-renews for successive `[REVIEW: 12]`-month periods unless either party provides written notice of non-renewal at least `[REVIEW: 60 or 90]` days before the current term ends.

**7.3 Termination for cause.** Either party may terminate this Agreement immediately by written notice if the other party:
  a. materially breaches this Agreement and fails to cure within 30 days of written notice specifying the breach;
  b. becomes insolvent, files for bankruptcy, or ceases business operations;
  c. is convicted of a crime that materially harms the reputation of the other party.

**7.4 Termination for convenience.** After the initial term, either party may terminate this Agreement without cause on `[REVIEW: 90]` days' prior written notice.

**7.5 Effect of termination.**
  a. TOJ shall provide the license-back snapshot per Section 5.5.
  b. Revenue-share obligations continue for any Roster Referrals converted **before** the termination effective date, for as long as those athletes remain Active Clients, subject to the tail cap in Section 7.6.
  c. Each party returns or destroys the other's Confidential Information within 30 days.
  d. Any accrued but unpaid amounts become due within 15 days of termination.

**7.6 Revenue-share tail cap.** Post-termination revenue-share obligations continue for a maximum of `[REVIEW: 24 or 36]` months from the termination effective date, after which all share obligations for previously-converted Roster Referrals cease. This cap is intended to prevent perpetual entanglement while honoring the value of infrastructure TOJ built.

---

## 8. Audit and Dispute Resolution

**8.1 Ledger transparency.** The `revenue_share_ledger` in the operating brain is the authoritative accounting record. Both parties have read access to the ledger and its statements.

**8.2 Audit right.** Once per calendar year, TOJ may, at its own expense, engage an independent auditor to inspect Margin's payment records and CRM tag classifications relating to Roster Referrals. Margin shall cooperate reasonably. If the audit reveals an underpayment of more than `[REVIEW: 5%]`, Margin shall bear the audit cost and pay the shortfall plus `[REVIEW: interest at prime + 2%]` within 30 days.

**8.3 Classification disputes.** Any dispute over whether a given athlete qualifies as a Roster Referral shall be resolved as follows:
  a. Party raising the dispute logs a written note on the `leads` record within 30 days of the first payment.
  b. Both parties confer in good faith.
  c. If unresolved within 15 days, Margin's classification stands **for the current billing cycle** and the matter is escalated per Section 8.4.

**8.4 General disputes.** Any other dispute shall first be submitted to good-faith negotiation between principals. If unresolved within 30 days, disputes shall be resolved by binding arbitration in `[REVIEW: state · e.g. Colorado]` under the rules of `[REVIEW: AAA Commercial Arbitration]`, with a single arbitrator, in English. Judgment on the award may be entered in any court of competent jurisdiction.

---

## 9. Non-Compete and Non-Solicitation

**9.1 TOJ non-compete boundary.** During the term of this Agreement and for `[REVIEW: 12]` months thereafter, TOJ shall not build or operate a competing wide-receiver training operating brain for a directly-competing WR trainer of similar credential and market. TOJ may operate the same methodology in adjacent verticals (e.g., other positions, other sports, other categories of professional).

**9.2 Margin non-solicitation.** During the term and for `[REVIEW: 12]` months thereafter, Margin shall not solicit or hire TOJ's employees or contractors without TOJ's written consent.

**9.3 No client poaching.** Neither party shall solicit the other party's clients for services outside the scope of this Agreement during the term and for `[REVIEW: 12]` months thereafter.

**9.4 Roster relationships preserved.** For clarity: Margin's coaching relationships with roster athletes, alumni, and coach network are Margin's own. This Agreement does not restrict Margin's operation of those relationships outside the STL/CBH commercial tiers.

---

## 10. Representations and Warranties

**10.1 Mutual.** Each party represents that: (a) it has full authority to enter this Agreement; (b) execution does not conflict with any other agreement; (c) it will comply with all applicable laws in performing its obligations.

**10.2 TOJ represents:** the Operating Brain does not knowingly infringe any third-party IP; TOJ has the right to license the methodology as described; the infrastructure meets commercially reasonable standards of security and reliability.

**10.3 Margin represents:** Margin has the right to engage TOJ for the described services; Margin will not knowingly misclassify athletes to reduce revenue-share obligations; Margin will maintain the coaching quality and credential that underpins the athlete demand this system depends on.

**10.4 Disclaimer.** EXCEPT AS EXPRESSLY STATED, NEITHER PARTY MAKES ANY WARRANTY, EXPRESS OR IMPLIED. TOJ SPECIFICALLY DISCLAIMS ANY WARRANTY OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR UNINTERRUPTED OPERATION. `[REVIEW: attorney to strengthen or soften]`

---

## 11. Limitation of Liability and Indemnification

**11.1 Cap on liability.** EXCEPT FOR BREACHES OF CONFIDENTIALITY, IP INDEMNIFICATION, OR GROSS NEGLIGENCE / WILLFUL MISCONDUCT, EACH PARTY'S TOTAL LIABILITY UNDER THIS AGREEMENT SHALL NOT EXCEED THE AMOUNT PAID OR PAYABLE BY OR TO THE OTHER PARTY UNDER THIS AGREEMENT IN THE 12 MONTHS PRECEDING THE CLAIM. `[REVIEW]`

**11.2 No consequential damages.** NEITHER PARTY SHALL BE LIABLE FOR INDIRECT, CONSEQUENTIAL, INCIDENTAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, EVEN IF ADVISED OF THE POSSIBILITY.

**11.3 IP indemnification.** TOJ shall indemnify Margin against third-party claims that the Operating Brain infringes IP rights. Margin shall indemnify TOJ against third-party claims arising from Margin's coaching content, athlete relationships, or brand.

**11.4 Insurance.** Each party shall maintain commercially reasonable liability insurance. `[REVIEW: specific coverage minimums]`

---

## 12. General Provisions

**12.1 Independent contractors.** The parties are independent contractors. Nothing in this Agreement creates a partnership, joint venture, agency, or employment relationship.

**12.2 Assignment.** Neither party may assign this Agreement without the other's written consent, except that either party may assign to an affiliate or successor in a merger, acquisition, or sale of substantially all assets, on written notice.

**12.3 Notices.** All notices shall be in writing and delivered to the addresses set forth below (or updated by written notice) by email with confirmation of receipt, or by certified mail. Email notice to `[REVIEW: TOJ notice email]` and `[REVIEW: Margin notice email]`.

**12.4 Governing law.** This Agreement is governed by the laws of `[REVIEW: state]`, without regard to conflicts of law principles.

**12.5 Entire agreement.** This Agreement is the entire agreement between the parties on this subject matter and supersedes all prior agreements, discussions, and understandings, whether written or oral. Any prior arrangement naming a different entity as revenue-share partner in connection with roster referrals is expressly superseded and of no force or effect.

**12.6 Amendments.** Amendments must be in writing and signed by both parties.

**12.7 Severability.** If any provision is held unenforceable, the remainder continues in effect, and the unenforceable provision shall be reformed to the minimum extent needed to make it enforceable.

**12.8 Waiver.** No waiver is effective unless in writing. A waiver on one occasion does not waive on future occasions.

**12.9 Counterparts and e-signature.** This Agreement may be executed in counterparts, including via DocuSign or equivalent, each of which is deemed an original.

**12.10 Force majeure.** Neither party is liable for delay or failure to perform due to causes beyond reasonable control (natural disasters, war, pandemic, government action). Revenue-share obligations continue against Collected Revenue regardless.

---

## 13. Signatures

**TRAIL OF JOY PLAYER MANAGEMENT GROUP**

By: _______________________________
Name: Kyron Cumby
Title: Principal
Date: _______________

Address: `[REVIEW]`
Email: `[REVIEW]`

---

**MARGIN HOOKS / SKY'S THE LIMIT WR / COACHED BY HOOKS**

By: _______________________________
Name: Margin Hooks
Title: Principal
Date: _______________

Address: `[REVIEW]`
Email: `[REVIEW]`

---

## Appendix A · Roster Source Tag Reference

For clarity on Section 4.3(a), the following `leads.source` tag values qualify as Roster Referrals under this Agreement:

| Tag | Meaning |
|---|---|
| `roster_referral` | Athlete referred by an existing Margin roster client · e.g. current STL member's cousin |
| `alumni_network` | Athlete referred by a Margin alumni (former client now at college or NFL) · e.g. Marvin's high-school-junior neighbor |
| `direct_margin_intro` | Athlete Margin personally introduces to the STL/CBH intake — from Margin's coaching-circle, event contacts, or camp encounters |

The following tags do **not** qualify:

| Tag | Meaning |
|---|---|
| `cold_inbound` | Website or social contact with no attribution |
| `paid_ad` | Landing page from an ad campaign |
| `client_referral` | Client-to-client referral through `athlete-referral-program` **from a non-roster client** |
| `unknown` | Attribution not set |

Classification is set at intake by `lead-capture-automation` and may be corrected by Margin within 30 days of first payment per Section 8.3.

---

## Appendix B · Excluded Categories

The following are expressly excluded from revenue-share calculation under Section 4.4:

- Trainer Blueprint packages (`packages.tier = 'trainer_blueprint'`)
- Speaking engagements, camps, and events run outside the recurring package structure
- Book sales, course sales, and digital-product sales that operate outside the CRM's package system
- Sponsorship, brand deals, and media revenue paid to Margin personally
- Any revenue collected before the Effective Date of this Agreement

---

## Appendix C · Reference Schema

For technical reference, the ledger schema is defined in [`infra/supabase/migrations/004_revenue_share.sql`](../infra/supabase/migrations/004_revenue_share.sql). Key tables:

- `payment_events` — Stripe webhook events (source of truth for collected revenue)
- `revenue_share_ledger` — every accrual, reversal, adjustment, and payout entry
- `revenue_share_statements` — monthly rollup delivered to TOJ

The `calculate_revenue_share()` plpgsql function fires from the `stripe-webhook` Edge Function on every qualifying payment event. The share rate is stored as a column (`share_rate`) on each ledger entry, so historical entries remain calculable if the rate is ever amended prospectively.

---

## Appendix D · Change Log

- **v0.1 · 2026-07-25** — Initial draft. Codifies the arrangement as documented in `skills/roster-revenue-share/` and the `hooks-os` infrastructure. **Requires attorney review before execution.**

---

> **Attorney-review checklist (for reviewing counsel):**
>
> 1. State selection for governing law + arbitration seat (§8.4, §12.4)
> 2. Payout cadence and method (§4.6)
> 3. Initial term length and non-renewal notice window (§7.1, §7.2)
> 4. Termination-for-convenience notice period (§7.4)
> 5. Post-termination revenue-share tail cap (§7.6)
> 6. Confidentiality survival period (§6.5)
> 7. Non-compete and non-solicitation scope + duration (§9)
> 8. Liability cap sizing (§11.1)
> 9. Insurance minimums (§11.4)
> 10. Notice addresses and emails (§12.3)
> 11. Audit interest rate (§8.2)
> 12. Any state-specific consumer-protection or franchise-law considerations
>
> Reviewing counsel should also confirm that no provision here inadvertently triggers franchise, securities, or MLM regulatory frameworks given the revenue-share structure.
