# GHL ↔ Supabase Field Mapping

**Purpose:** every custom field in GHL maps to a Supabase column. This is the contract that keeps CRM and source-of-truth in sync.

**Direction convention:**
- `GHL → SB` = GHL writes it, Supabase reads it (webhook payload)
- `SB → GHL` = Supabase writes it, GHL reads it (API push)
- `bi` = bi-directional (write in either, sync to the other)

---

## Contact (GHL) ↔ leads / clients (Supabase)

| GHL custom field | Supabase column | Direction | Notes |
|---|---|---|---|
| `contact.firstName` | `leads.athlete_first_name` OR `leads.parent_first_name` | bi | Direction depends on segment · resolved at insert |
| `contact.lastName` | `leads.athlete_last_name` OR `leads.parent_last_name` | bi | Same segment resolution |
| `contact.email` | `leads.parent_email` OR `leads.athlete_email` | bi | Youth/HS → parent · else athlete |
| `contact.phone` | `leads.parent_phone` OR `leads.athlete_phone` | bi | Same rule as email |
| `hooks_segment` | `leads.segment` / `clients.segment` | bi | Values: youth_hs · college_bound · alumni_pro · unclassified |
| `hooks_source` | `leads.source` / `clients.source` | bi | Values: cold_inbound · paid_ad · client_referral · roster_referral · alumni_network · direct_margin_intro · unknown |
| `hooks_source_detail` | `leads.source_detail` | bi | Freeform · e.g. "Marvin cousin", "IG ad · release-drill campaign" |
| `hooks_lead_stage` | `leads.stage` | bi | Values: first_contact · consult_booked · consult_attended · deciding · active_client · renewal · churned · closed_no_fit |
| `hooks_athlete_first_name` | `leads.athlete_first_name` | bi | Explicit athlete-only field (avoids overload) |
| `hooks_athlete_position` | `leads.athlete_position` | bi | Default: WR |
| `hooks_athlete_grad_year` | `leads.athlete_grad_year` | bi | 4-digit year |
| `hooks_athlete_hs` | `leads.athlete_high_school` | bi | |
| `hooks_film_url` | `leads.athlete_film_url` | bi | Hudl / YouTube / other |
| `hooks_goal` | `leads.goal` | bi | Freeform |
| `hooks_referring_client_id` | `leads.referring_client_id` | GHL → SB | Set when created from a referral link |
| `hooks_referral_code` | (referrals.referral_code) | GHL → SB | Feeds athlete-referral-program tracking |
| `hooks_supabase_lead_id` | `leads.id` | SB → GHL | Supabase writes back after lead insert |
| `hooks_supabase_client_id` | `clients.id` | SB → GHL | Set at conversion |
| `hooks_active_package_tier` | `packages.tier` (latest active) | SB → GHL | For segmenting workflows by tier |
| `hooks_package_expires_at` | `packages.expires_at` (latest active) | SB → GHL | Drives 30/14/7 renewal workflow |
| `hooks_is_roster_referral` | `leads.is_roster_referral` | SB → GHL | Boolean · marks TOJ revenue-share qualifying |

---

## Opportunity (GHL) ↔ consults / packages (Supabase)

| GHL opportunity field | Supabase | Direction | Notes |
|---|---|---|---|
| Opportunity name | `consults.id` (as tag) | SB → GHL | Naming convention: "Consult · {athlete_name} · {date}" |
| Pipeline stage | `consults.outcome` | bi | Signed → signed_package · Attended-undecided → attended_undecided · etc. |
| Value | `packages.price_cents / 100` | SB → GHL | Populated at consult booking based on tier interest |

---

## Note (GHL) ↔ session_notes (Supabase)

| GHL note field | Supabase | Direction | Notes |
|---|---|---|---|
| Note body | `session_notes.raw_note` | bi | Coach can drop a text note in GHL · webhook fires recap-agent |
| Note tags | `session_notes.wins` / `focus_areas` | GHL → SB | Tags parsed by regex · e.g. `[win: hands mid-route]` |
| Session date | `sessions.scheduled_at` (matched by proximity) | GHL → SB | Note-to-session matcher runs in webhook handler |

---

## Message (GHL) ↔ recap_events / engagement_events (Supabase)

| GHL event | Supabase table | Notes |
|---|---|---|
| `message.delivered` | `recap_events` (event_type = 'delivered') | GHL webhook fires · maps by ghl_message_id → recaps.ghl_message_id |
| `message.opened` | `recap_events` (event_type = 'opened') | Email open pixel · GHL fires the webhook |
| `message.clicked` | `recap_events` (event_type = 'link_clicked') | With link_url in payload |
| `message.replied` | `recap_events` (event_type = 'replied') | With reply_text |
| `message.bounced` | `recap_events` (event_type = 'bounced') | With bounce_reason |

---

## Tag conventions

All hooks-os tags in GHL are prefixed `hooks:` to avoid collision with other workflows.

| Tag | Meaning | Set by |
|---|---|---|
| `hooks:segment:youth_hs` | Youth/HS segment | qual-agent / manual intake |
| `hooks:segment:college_bound` | College-bound segment | qual-agent / manual intake |
| `hooks:segment:alumni_pro` | Alumni/pro segment | qual-agent / manual intake |
| `hooks:source:roster` | Margin roster referral | manual OR intake form option |
| `hooks:source:alumni_net` | Alumni-network referral | manual OR intake form option |
| `hooks:source:margin_intro` | Direct Margin introduction | manual |
| `hooks:health:yellow` | Yellow-severity flag open | health-agent (via API) |
| `hooks:health:orange` | Orange-severity flag open | health-agent |
| `hooks:health:red` | Red-severity flag open · needs Margin attention | health-agent |
| `hooks:renewal:30d` / `hooks:renewal:14d` / `hooks:renewal:7d` | Renewal window tags | package-renewal cron |
| `hooks:consult:booked` | Discovery call on the books | GHL calendar workflow |
| `hooks:consult:noshow` | Missed consult · recovery flow triggered | GHL calendar workflow |
| `hooks:release_room:candidate` | Client is a Release Room Friday feature candidate | manual · from content_briefs |

---

## What is NOT mirrored

- PII stays out of this repo. Field NAMES live here · actual values live in each system.
- GHL keeps the SMS/email thread bodies for messages · Supabase only stores metadata (delivered/opened/clicked/replied), not the message body itself (except for recaps · which Supabase generated in the first place).
- Stripe payment method details never touch GHL · Stripe → Supabase → GHL only sees "hooks_active_package_tier" and "hooks_package_expires_at".

---

*This mapping is the contract. Any new field must be added to both sides simultaneously · never one-side-only.*
