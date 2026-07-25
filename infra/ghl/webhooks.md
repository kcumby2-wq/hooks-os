# GHL Webhooks · Inbound Contracts

**Purpose:** every GHL webhook that fires a Supabase Edge Function. Endpoint URLs, payload contracts, and the Edge Function that handles each.

---

## Endpoint URL pattern

```
https://<project-ref>.supabase.co/functions/v1/<function-name>
```

All Edge Functions verify the request via the `X-GHL-Signature` header + shared `GHL_WEBHOOK_SECRET`.

---

## 1. New inbound message (SMS · Email · IG DM · FB DM · Web chat)

**GHL trigger:** `conversation.message.inbound`

**Handler:** `qual-agent/`

**Endpoint:** `POST /functions/v1/qual-agent`

**Payload shape:**
```json
{
  "type": "conversation.message.inbound",
  "locationId": "<ghl-location-id>",
  "conversationId": "<ghl-conv-id>",
  "contactId": "<ghl-contact-id>",
  "channel": "instagram" | "sms" | "email" | "fb_messenger" | "web_chat",
  "contact": {
    "id": "<ghl-contact-id>",
    "handle": "@theirhandle",
    "firstName": "…",
    "lastName": "…",
    "email": "…",
    "phone": "…",
    "tags": ["…"]
  },
  "message": {
    "id": "<ghl-msg-id>",
    "body": "the actual message text",
    "timestamp": "2026-07-25T14:33:12Z"
  }
}
```

**Response contract:** 200 = handled · anything else = GHL retries with exponential backoff (5 attempts over 30 min).

---

## 2. Consult booked (calendar event created)

**GHL trigger:** `appointment.created` on calendar `hooks-consult-15min`

**Handler:** `qual-agent/` (creates lead if new · attaches consult)

**Endpoint:** `POST /functions/v1/qual-agent` with header `X-Event-Kind: consult_booked`

**Payload shape:**
```json
{
  "type": "appointment.created",
  "calendarId": "<hooks-consult-15min>",
  "appointmentId": "<ghl-appt-id>",
  "contact": { ... same as above ... },
  "appointment": {
    "startTime": "2026-07-30T18:00:00Z",
    "endTime": "2026-07-30T18:15:00Z",
    "meetingUrl": "https://zoom.us/j/…",
    "status": "confirmed"
  }
}
```

Handler writes to `consults` table + updates `leads.stage = 'consult_booked'`.

---

## 3. Consult attended / no-show

**GHL trigger:** `appointment.status.updated`

**Handler:** `qual-agent/` (dispatches by status)

**Endpoint:** `POST /functions/v1/qual-agent` with header `X-Event-Kind: consult_status`

**Statuses handled:**
- `showed` → `consults.outcome = 'attended_undecided'` (unless signed_package fires from Stripe first)
- `noshow` → `consults.outcome = 'no_show'` · `consults.no_show_recovery_started_at = now()`
- `cancelled` → `consults.outcome = 'no_show'` with note

---

## 4. Session completed / no-show (booked training session)

**GHL trigger:** `appointment.status.updated` on calendar `hooks-training-session`

**Handler:** dedicated `session-webhook/` (thin · updates `sessions` table)

**Endpoint:** `POST /functions/v1/session-webhook`

Handler updates `sessions.status`:
- `showed` → `completed` · sets `attended_at`
- `noshow` → `no_show` · sets `no_show_recovery_started_at`
- `cancelled` → `cancelled_by_athlete` or `cancelled_by_coach` per note

If session status becomes `completed`, GHL fires a follow-up workflow that pings the coach to submit a session note (via GHL form). That form submission creates a `session_notes` row, which then triggers the `recap-agent/`.

---

## 5. Coach submitted session note

**GHL trigger:** Form `hooks-session-note` submitted

**Handler:** thin form-handler that writes to `session_notes` · that insert then triggers `recap-agent/` via Supabase Realtime

**Endpoint:** `POST /functions/v1/session-note-intake`

**Payload shape:**
```json
{
  "sessionId": "<supabase-session-uuid>",
  "coachId": "margin",
  "noteText": "…",
  "wins": ["hands mid-route", "second stack held pace"],
  "focusAreas": ["hip drop on comeback"],
  "filmTimestamps": [
    { "ts": "03:14", "label": "stack rep 3" }
  ]
}
```

**Realtime trigger:** `session_notes` insert fires `recap-agent/`.

---

## 6. Referral link click

**GHL trigger:** Custom trigger via short-link click event

**Handler:** thin `referral-click/` writes to `referrals` + sets first_click_at

**Endpoint:** `POST /functions/v1/referral-click`

**Payload shape:**
```json
{
  "referralCode": "abc123",
  "clickTimestamp": "…",
  "utm": { "source": "instagram", "medium": "story" }
}
```

---

## 7. Contact tag added (segment or health tag changes)

**GHL trigger:** `contact.tag.added`

**Handler:** thin `tag-sync/` mirrors tag changes back to Supabase (so manual GHL tag edits update source-of-truth)

**Endpoint:** `POST /functions/v1/tag-sync`

---

## Outbound (Supabase → GHL) endpoints called

| Purpose | GHL endpoint | Called by |
|---|---|---|
| Send message | `POST /conversations/messages` | qual-agent · recap-agent · health-agent |
| Update contact custom field | `PUT /contacts/{contactId}` | Any function updating derived state |
| Add contact to workflow | `POST /workflows/{workflowId}/subscribe` | recap-agent · health-agent |
| Create/update opportunity | `POST /opportunities` | qual-agent on consult booking |
| Add contact tag | `POST /contacts/{contactId}/tags` | health-agent on flag severity change |

Bearer token: `GHL_API_KEY` · location scope: `GHL_LOCATION_ID` · header `Version: 2021-07-28`.

---

## Retry + idempotency

- All Edge Function handlers use the GHL event/message id as an idempotency key where possible (dedup by `stripe_event_id`-style unique constraints).
- Errors return non-200 → GHL retries up to 5 times over 30 minutes.
- Persistent failure after 5 retries → GHL flags the workflow as "stuck" · alerts Kyron via configured Slack.

---

*Every webhook contract lives here. Any change to a GHL trigger requires a same-PR update to this file · otherwise Edge Function assumptions drift.*
