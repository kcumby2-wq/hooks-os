# Workflow 10 · hooks-recap-delivery

**Purpose:** deliver the agent-generated post-session recap to the right recipient(s) per segment · track opens/clicks.

**Skill:** [`post-session-recap-agent/`](../../../skills/post-session-recap-agent/SKILL.md)

**SLA:** recap must land in the inbox within 4-6h of session end.

---

## Trigger

**Type:** Webhook received from Supabase Edge Function `recap-agent/`

**Payload the workflow reads:**
```json
{
  "contactId": "<ghl-contact-id>",
  "recap_id": "<supabase-recap-uuid>",
  "recipient": "athlete_only" | "parent_only" | "athlete_and_parent",
  "subject": "session subject line",
  "body": "the recap body text",
  "cta_label": "…",
  "cta_url": "…",
  "segment": "youth_hs" | "college_bound" | "alumni_pro"
}
```

The webhook adds the contact to this workflow via API and sets custom fields on the contact for the workflow to use.

---

## Filters

None at workflow entry (`recap-agent/` already applied all filters). Workflow trusts the payload.

---

## Steps

### 1. Set custom fields on contact
- `contact.hooks_active_recap_id` ← `{{ webhook.recap_id }}`
- `contact.hooks_active_recap_subject` ← `{{ webhook.subject }}`
- `contact.hooks_active_recap_body` ← `{{ webhook.body }}`
- `contact.hooks_active_recap_cta_url` ← `{{ webhook.cta_url }}`
- `contact.hooks_active_recap_cta_label` ← `{{ webhook.cta_label }}`

### 2. If/else on `webhook.recipient`

#### Branch A · `parent_only` (segment = youth_hs default)
- Send email to `contact.parent_email` (fallback: `contact.email` if that field lookup routes)
  - Subject: `{{ contact.hooks_active_recap_subject }}`
  - Body template: `templates/recap-parent.html` · injects `{{ contact.hooks_active_recap_body }}` + CTA button
- Also send SMS to `contact.parent_phone`:
  - Body: `Recap from {{ contact.hooks_athlete_first_name }}'s session is in your inbox — {{ contact.hooks_active_recap_cta_label }}: {{ contact.hooks_active_recap_cta_url }}`

#### Branch B · `athlete_only` (alumni_pro default)
- Send email to `contact.athlete_email`
  - Subject: `{{ contact.hooks_active_recap_subject }}`
  - Body template: `templates/recap-athlete-direct.html`
- SMS to `contact.athlete_phone` with same short pointer

#### Branch C · `athlete_and_parent` (college_bound default)
- Fire both branches concurrently
- Small delay (2 min) between parent and athlete send so the parent sees it first

### 3. Wait 30 minutes

### 4. On `message.opened` webhook fired → do nothing (that's the goal)
### 5. On no `message.opened` after 48h → tag contact `hooks:recap:unopened_streak_1`

### 6. Callback to Supabase
- Webhook `POST /functions/v1/recap-delivery-ack` with:
  ```json
  { "recap_id": "…", "ghl_message_id": "…", "sent_at": "…" }
  ```

### 7. Exit workflow

---

## Exit conditions

- Message successfully delivered → automatic exit after 48h wait window
- Contact tagged `hooks:pause` (manual pause) → immediate exit
- Contact unsubscribes → immediate exit + tag `hooks:recap:opt_out`

---

## Success signal

- **Delivery rate:** > 98% of triggered recaps land in the inbox
- **Open rate baseline:** target ≥ 60% for Youth/HS parents, ≥ 50% for College-bound, ≥ 45% for Alumni/Pro (per Growth Plan norms · adjust after 90 days of data)
- **Click-through:** ≥ 25% clicks on the CTA when film timestamps are included

Rolls up to `recap_delivery_stats` view in Supabase for weekly review.

---

## Message templates (kept lean · outcome-first · per outcomes-based-communication/)

**Parent email header:**
```
Subject: {{ subject }}

Hey {{ parent_first_name }} —

{{ body }}

{{ cta_button }}

— Margin & the STL team
```

**Athlete-direct email header:**
```
Subject: {{ subject }}

{{ athlete_first_name }} —

{{ body }}

{{ cta_button }}

— M
```

---

*This is workflow #10 · the delivery half of the post-session-recap-agent skill. The generation half lives in the Edge Function. Together they are the highest-leverage retention lever in the whole operating brain.*
