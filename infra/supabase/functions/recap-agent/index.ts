/**
 * hooks-os · Edge Function · recap-agent
 *
 * Implements skills/post-session-recap-agent/ — the highest-leverage retention lever.
 *
 * Trigger: session_notes row inserted (Supabase Realtime → this function)
 * SLA: deliver recap to athlete + parent within 4-6h of session
 *
 * Pipeline:
 *   1. Load session + client + segment + note
 *   2. Determine recipient per segment rules
 *   3. Generate recap (Claude · outcome-first prompt)
 *   4. Voice-drift check (3 retries)
 *   5. Write to `recaps` table
 *   6. Enqueue delivery via GHL
 *   7. Register webhook for open/click → writes to recap_events
 */

import { createClient } from "npm:@supabase/supabase-js@2";
import Anthropic from "npm:@anthropic-ai/sdk@0.30.0";
import { generateWithDriftGuard, MAX_RETRIES } from "../_shared/voice-drift-check.ts";

type SessionNoteInsert = {
  id: string;
  session_id: string;
  raw_note: string;
  wins: string[];
  focus_areas: string[];
  film_timestamps: Array<{ ts: string; label: string }>;
};

Deno.serve(async (req) => {
  const payload = await req.json();
  const noteId = payload.record?.id as string;
  if (!noteId) return json({ error: "no note id" }, 400);

  const supa = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // 1. Load full context
  const { data: note } = await supa.from("session_notes")
    .select("*, session:sessions(*, client:clients(*, lead:leads(*)))")
    .eq("id", noteId)
    .single();

  if (!note?.session?.client) {
    return json({ error: "context load failed" }, 500);
  }

  const client = note.session.client;
  const segment = client.segment as "youth_hs" | "college_bound" | "alumni_pro";

  // 2. Recipient per segment
  const recipient = pickRecipient(segment);

  // 3-4. Generate + drift-check with retries
  const result = await generateWithDriftGuard(
    async (correctiveFeedback) =>
      draftRecap(note as SessionNoteInsert, client, segment, recipient, correctiveFeedback),
    { segment, recipient: recipient === "athlete_and_parent" ? "combined" : recipient.replace("_only", "") as "athlete" | "parent", content_type: "recap" },
  );

  // 5. Persist recap row
  const { data: recap } = await supa.from("recaps").insert({
    session_id: note.session_id,
    session_note_id: note.id,
    client_id: client.id,
    status: result.passed ? "ready_to_send" : "voice_check_failed",
    recipient,
    generation_attempts: result.attempts,
    voice_check_attempts: result.attempts,
    voice_drift_failures: result.passed ? null : { failures: result.finalFailures },
    subject_line: result.meta.subject,
    body_combined: result.text,
    primary_cta_label: result.meta.cta_label,
    primary_cta_url: result.meta.cta_url,
  }).select().single();

  // 6. Enqueue delivery if passed
  if (result.passed && recap) {
    await enqueueGhlDelivery(recap.id);
  }

  return json({
    recap_id: recap?.id,
    status: recap?.status,
    attempts: result.attempts,
  });
});

function pickRecipient(segment: string): "athlete_only" | "parent_only" | "athlete_and_parent" {
  switch (segment) {
    case "youth_hs":
      return "parent_only";
    case "college_bound":
      return "athlete_and_parent";
    case "alumni_pro":
      return "athlete_only";
    default:
      return "athlete_and_parent";
  }
}

async function draftRecap(
  note: SessionNoteInsert,
  client: { lead: { athlete_first_name: string } },
  segment: string,
  recipient: string,
  correctiveFeedback: string,
): Promise<{ text: string; meta: { subject: string; cta_label: string; cta_url: string } }> {
  const anthropic = new Anthropic({
    apiKey: Deno.env.get("ANTHROPIC_API_KEY")!,
  });

  const systemPrompt = buildRecapSystemPrompt(segment, recipient, correctiveFeedback);
  const userPrompt = `Athlete first name: ${client.lead.athlete_first_name}
Wins this session: ${JSON.stringify(note.wins)}
Focus areas: ${JSON.stringify(note.focus_areas)}
Film timestamps: ${JSON.stringify(note.film_timestamps)}

Coach's raw note:
${note.raw_note}

Output JSON only:
{
  "subject": "email subject (short, specific, no hype)",
  "body": "the recap message body",
  "cta_label": "primary CTA label",
  "cta_url": "primary CTA target"
}`;

  const res = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 1000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = (res.content[0] as { type: "text"; text: string }).text;
  const parsed = JSON.parse(text) as {
    subject: string;
    body: string;
    cta_label: string;
    cta_url: string;
  };

  return {
    text: parsed.body,
    meta: {
      subject: parsed.subject,
      cta_label: parsed.cta_label,
      cta_url: parsed.cta_url,
    },
  };
}

function buildRecapSystemPrompt(
  segment: string,
  recipient: string,
  correctiveFeedback: string,
): string {
  return `You are drafting a post-session recap for a Margin Hooks / Sky's The Limit WR client.

VOICE: Coach-direct. Plain English. Outcome-first. No marketing filler. No false hype.
Sound like Margin actually watching the film — specific, concrete, honest about what worked and what didn't.

SEGMENT: ${segment}
RECIPIENT: ${recipient}

REGISTER RULES:
- youth_hs → speak to the parent. Reference athlete in third person by first name.
- college_bound → speak to both. Athlete-first sentences · parent-visible context.
- alumni_pro → speak to the athlete directly. Peer-to-peer coach tone.

STRUCTURE:
1. One sentence: what the session was about (concrete drill/theme).
2. Two-three sentences: wins this session (the specific reps that stood out).
3. Two-three sentences: focus for next session (what to lock in · film cue if applicable).
4. One sentence: what the athlete should do BEFORE the next session (film review, drill, mindset).
5. One CTA line (film review link · book next session · etc.).

DO NOT USE:
- "comprehensive", "holistic", "world-class", "premier", "leading"
- "feel free to", "don't hesitate"
- "guaranteed", "unlock your potential", "next level"

${correctiveFeedback ? `\n\nCORRECTIVE FEEDBACK FROM LAST ATTEMPT:\n${correctiveFeedback}` : ""}`;
}

async function enqueueGhlDelivery(recapId: string): Promise<void> {
  // GHL API call · pushes recap into the appropriate lifecycle workflow
  const ghlApiKey = Deno.env.get("GHL_API_KEY")!;
  const locationId = Deno.env.get("GHL_LOCATION_ID")!;

  await fetch(`https://services.leadconnectorhq.com/hooks-os/recap-enqueue`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${ghlApiKey}`,
      "Content-Type": "application/json",
      "Version": "2021-07-28",
    },
    body: JSON.stringify({ locationId, recap_id: recapId }),
  });
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
