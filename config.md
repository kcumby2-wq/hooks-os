# config.md — hooks-os (Margin Hooks / Coached by Hooks × Sky's The Limit)

**Status:** Scaffold. Values marked `_____` get locked during the pre-August walkthrough with Margin. This file is the single source of truth for per-client choices — the agent reads it alongside `CLAUDE.md` every session.

---

## Network Positioning

```yaml
network_positioning: peer_brand   # peer_brand (default) — never hierarchy
margin_as_multiplier: not_applicable  # Margin IS the network's most-developed brand
cross_brand_relationships:
  - client: youngblood-os
    relationship: "Margin's cohort participant + Trainer Blueprint graduate-equivalent"
    content_preapproved: true
  - client: patterson-os
    relationship: "Margin's cohort participant + Trainer Blueprint graduate-equivalent"
    content_preapproved: true
```

## Trainer Tier Classification

```yaml
trainer_tier: apex
classified_date: 2026-06-25
classification_basis:
  - "Decades of credentials: 26 NFL players, 160+ D1, 28 HS All-Americans, 11 College All-Americans, 6 Five-Stars, 1 Pro Bowler"
  - "Signed elite athletes under long-term player management: 6 NFL + 30+ Power 4, sustained relationship (many since middle school) — far exceeds the 12-month/3-athlete eligibility floor"
  - "Productized Trainer Blueprint as seller: Coached by Hooks Trainer Blueprint, $3,500-5,000, own lineage (STL Certified Trainer network)"
defaults_template: toj-network-brain/shared-standards/apex-tier-defaults.md
graduation_watch: not_applicable  # Margin is the founding apex trainer — no graduation path needed, this IS the ceiling tier
```

---

## Invoicing (see `toj-network-brain/shared-standards/automated-invoicing.md`)

```yaml
invoicing:
  default_delivery_mode: _____   # email_invoice | payment_link
  revenue_streams:
    - name: "in_person_training_dfw"
      delivery_mode: _____
      reminder_cadence: standard
    - name: "cbh_intensive_block"
      delivery_mode: email_invoice
      reminder_cadence: firm       # high-ticket
    - name: "cbh_annual_program"
      delivery_mode: email_invoice
      reminder_cadence: firm
    - name: "trainer_blueprint"
      delivery_mode: email_invoice
      reminder_cadence: firm       # high-ticket, $3.5-5K
    - name: "stl_cohort_enrollment"
      delivery_mode: payment_link
      reminder_cadence: gentle
    - name: "stl_community_membership"
      delivery_mode: payment_link
      reminder_cadence: standard   # $99/mo recurring
    - name: "prospect_edge_evaluation"
      delivery_mode: payment_link
      reminder_cadence: standard
    - name: "coach_database_subscription"
      delivery_mode: email_invoice
      reminder_cadence: standard
  late_fee_policy: _____
  payment_methods_accepted: [card, ach]
  currency: USD
```

---

## Communications (see `toj-network-brain/shared-standards/automated-communications.md`)

```yaml
communications:
  transactional: auto
  nurture_sequences:
    default_mode: auto
    new_sequence_review_cycles: 1
  cold_outreach:
    cold_email: manual_review
    cold_sms: manual_review
    ig_dm: manual_review
    tiktok_dm: manual_review
    coach_partner_outreach: manual_review_always
  relationship_critical: human_only
  escalation_contact: kyron
  rate_caps:
    ig_dm_per_day: _____   # tune to Margin's actual audience scale
    tiktok_dm_per_day: _____
  compliance_region: [US]
```

---

## Language Set

```yaml
language:
  default_content_language: en
  parent_comms_language: en
  de_layer: not_applicable
```

---

## Cohort Cadence

```yaml
cohort:
  cadence: quarterly
  size_target_min: 15
  size_target_max: 25
  pricing_tiers: _____   # lock at walkthrough
```

---

## Events & Camps

```yaml
events:
  primary_pattern: "training_session_is_the_camp"   # per season campaign plan insight
  discrete_event_archetypes: _____   # lock per skills/event-campaign-design/SKILL.md once built
```

---

## Evaluation Provider

```yaml
evaluation:
  provider: prospect_edge
  affiliate: toj_x_optimum_grading
  position_specialization: [WR, broad_athlete_management]
  ac_flag_threshold: 4.0
  ac_outreach_mode: manual_review_always
```

---

## Athlete-Brand & NIL Pipeline (hooks-os-specific — no equivalent in other client repos)

```yaml
athlete_brand_pipeline:
  roster_lockdown_status: _____   # pending — confirm v1.0 cohort from 6 NFL + 30+ P4
  weekly_cadence_active_for: _____   # list of athlete_ids once roster locks
  stats_sources: see data/stats-sources.md
  nil_compliance_review: required_every_deal
```

---

## CBH Advocacy

```yaml
cbh_advocacy:
  log_every_call: true
  pre_call_brief_required: true
  weekly_report_to_margin: true
```

---

## Feedback Channels

```yaml
feedback:
  primary_channel: _____   # text | voice memo | email | Slack — Margin's preference
  reads_inbound_email: true
  reads_engagement: true
```

---

## Approval Gates

```yaml
approval_gates:
  cbh_content: margin_required_always
  stl_content: kyron_approval_default
  athlete_brand_content: athlete_approval_required_always
  parent_emails_first_30_days: review_required
  parent_emails_after_30_days: auto_if_clean
```

---

## Engagement Monitoring Weight

```yaml
engagement_monitoring:
  weight: elevated   # Margin's audience scale justifies this from day one
  monday_review_cadence: every_monday
  conversion_read_section: true
```

---

*Populate the `_____` fields during the pre-August walkthrough. This file is signed off the same way the Identity Blueprint is — in writing, before the system runs in production for season.*
