/**
 * hooks-os · Edge Function · qual-agent
 *
 * Implements skills/sales-qualification-agent/ — inbound DM/form classifier + responder.
 *
 * Trigger: GHL webhook (new inbound message from IG DM, website form, SMS)
 *          → this function is the webhook target
 *
 * Pipeline:
 *   1. Parse GHL payload
 *   2. Extract signal · classify by segment (client-segmentation/)
 *   3. Route:
 *      - Fit → draft consult-booking reply + create lead row
 *      - Sponsor/partnership → flag to Kyron
 *      - Non-fit → polite deflection
 *      - Complaint/legal → escalate to human queue
 *   4. Voice-drift check reply
 *   5. Send via GHL
 */

import { createClient } from "npm:@supabase/supabase-js@2";
import Anthropic from "npm:@anthropic-ai/sdk@0.30.0";
import { generateWithDriftGuard } from "../_shared/voice-drift-check.ts";

type Classification = {
  intent: "training_inquiry" | "sponsor" | "partnership" | "trainer_candidate" | "complaint" | "non_fit" | "spam";
  segment: "youth_hs" | "college_bound" | "alumni_pro" | "unclassified";
  confidence: number;
  escalate_reason?: string;
  extracted: {
    athlete_name?: string;
    grad_year?: number;
    position?: string;
    parent_name?: string;
    email?: string;
    phone?: string;
    goal?: string;
  };
};

Deno.serve(async (req) => {
  const payload = await req.json();

  const supa = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const rawMessage = payload.message?.body ?? payload.text ?? "";
  const senderHandle = payload.contact?.handle ?? payload.from ?? "unknown";
  const channel = payload.channel ?? "unknown";

  // 1-2. Classify
  const classification = await classify(rawMessage, senderHandle, channel);

  // Escalate anything sensitive · no auto-reply
  if (classification.intent === "complaint" || classification.intent === "sponsor" || classification.intent === "partnership") {
    await enqueueHumanReview(supa, {
      raw_message: rawMessage,
      sender: senderHandle,
      classification,
      reason: classification.escalate_reason ?? classification.intent,
    });
    return json({ status: "escalated", intent: classification.intent });
  }

  if (classification.intent === "spam" || classification.confidence < 0.5) {
    return json({ status: "ignored", intent: classification.intent });
  }

  // 3. Create lead row (if not existing by handle)
  const { data: existingLead } = await supa.from("leads")
    .select("id")
    .or(`parent_email.eq.${classification.extracted.email},athlete_email.eq.${classification.extracted.email}`)
    .maybeSingle();

  const leadId = existingLead?.id ?? (await createLead(supa, classification, senderHandle));

  // 4-5. Draft + voice-check + send reply
  const result = await generateWithDriftGuard(
    async (correctiveFeedback) => draftReply(classification, rawMessage, correctiveFeedback),
    {
      segment: classification.segment === "unclassified" ? "college_bound" : classification.segment,
      recipient: classification.segment === "youth_hs" ? "parent" : "athlete",
      content_type: "qualification_reply",
    },
  );

  if (result.passed) {
    await sendGhlReply({
      channel,
      to: senderHandle,
      body: result.text,
      leadId,
    });
    return json({
      status: "replied",
      lead_id: leadId,
      classification,
      attempts: result.attempts,
    });
  }

  // Fallback to human review if voice never passed
  await enqueueHumanReview(supa, {
    raw_message: rawMessage,
    sender: senderHandle,
    classification,
    reason: `voice_check_failed:${result.finalFailures.join(",")}`,
    drafted_reply: result.text,
  });
  return json({ status: "voice_check_failed", attempts: result.attempts });
});

async function classify(
  message: string,
  sender: string,
  channel: string,
): Promise<Classification> {
  const anthropic = new Anthropic({
    apiKey: Deno.env.get("ANTHROPIC_API_KEY")!,
  });

  const res = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 500,
    system: `You classify inbound messages for Margin Hooks / Sky's The Limit WR.

Return JSON matching this shape:
{
  "intent": "training_inquiry" | "sponsor" | "partnership" | "trainer_candidate" | "complaint" | "non_fit" | "spam",
  "segment": "youth_hs" | "college_bound" | "alumni_pro" | "unclassified",
  "confidence": 0.0-1.0,
  "escalate_reason": "optional string for complaint/legal escalations",
  "extracted": {
    "athlete_name": "optional",
    "grad_year": "optional int",
    "position": "optional (WR/DB/etc)",
    "parent_name": "optional",
    "email": "optional",
    "phone": "optional",
    "goal": "optional short string"
  }
}

Segment rules:
- youth_hs: pre-11th grade OR parent-authored inquiry OR mentions "my son"
- college_bound: 11th/12th grade OR transfer portal OR recruiting-focused
- alumni_pro: college roster OR NFL OR "former client"
- unclassified: not enough signal to tag

Escalate as complaint if: threatening language, legal terms, refund demands, do-not-contact requests.
Escalate as sponsor/partnership if: any offer of money/product/deal, brand outreach, agency inquiry.`,
    messages: [{
      role: "user",
      content: `Channel: ${channel}\nSender handle: ${sender}\n\nMessage:\n${message}`,
    }],
  });

  const text = (res.content[0] as { type: "text"; text: string }).text;
  return JSON.parse(text);
}

async function draftReply(
  classification: Classification,
  originalMessage: string,
  correctiveFeedback: string,
): Promise<{ text: string; meta: Record<string, unknown> }> {
  const anthropic = new Anthropic({
    apiKey: Deno.env.get("ANTHROPIC_API_KEY")!,
  });

  const systemPrompt = `You are drafting an inbound reply on behalf of the Margin Hooks / STL team.

VOICE: Coach-direct. Plain English. Outcome-first.

TASK for ${classification.intent}:
- training_inquiry (fit): confirm you got their message · one line about what STL does for their segment · one clear CTA to book a 15-min consult · one line asking for any missing intake info (athlete grad year · position · goal).
- training_inquiry (non-fit segment): honest deflection · suggest a better-fit resource if available · don't oversell.
- trainer_candidate: pointer to the Trainer Blueprint intake · Margin personally vets every relationship.

REGISTER: ${classification.segment} → ${classification.segment === "youth_hs" ? "speak to the parent" : "speak to the athlete directly"}.

Keep the reply under 90 words. One ask. No filler.

${correctiveFeedback ? `\n\nCORRECTIVE FEEDBACK:\n${correctiveFeedback}` : ""}`;

  const res = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 400,
    system: systemPrompt,
    messages: [{
      role: "user",
      content: `Their message:\n${originalMessage}\n\nExtracted: ${JSON.stringify(classification.extracted)}\n\nWrite the reply body only.`,
    }],
  });

  const text = (res.content[0] as { type: "text"; text: string }).text;
  return { text, meta: {} };
}

async function createLead(
  supa: ReturnType<typeof createClient>,
  classification: Classification,
  senderHandle: string,
): Promise<string> {
  const e = classification.extracted;
  const { data } = await supa.from("leads").insert({
    segment: classification.segment,
    source: "cold_inbound",
    source_detail: `qual-agent:${senderHandle}`,
    athlete_first_name: e.athlete_name?.split(" ")[0],
    athlete_last_name: e.athlete_name?.split(" ").slice(1).join(" "),
    parent_first_name: e.parent_name?.split(" ")[0],
    parent_last_name: e.parent_name?.split(" ").slice(1).join(" "),
    parent_email: classification.segment === "youth_hs" ? e.email : null,
    athlete_email: classification.segment !== "youth_hs" ? e.email : null,
    athlete_grad_year: e.grad_year,
    athlete_position: e.position,
    goal: e.goal,
    stage: "first_contact",
  }).select("id").single();
  return data!.id as string;
}

async function enqueueHumanReview(
  supa: ReturnType<typeof createClient>,
  entry: Record<string, unknown>,
): Promise<void> {
  // For now, write into signals table with a synthetic type so it shows up in reviewer dash
  await supa.from("signals").insert({
    client_id: null,
    signal_type: "comm_negative_sentiment", // best-fit enum · TODO: dedicated human-review table
    payload: entry,
  });
}

async function sendGhlReply(args: {
  channel: string;
  to: string;
  body: string;
  leadId: string;
}): Promise<void> {
  const ghlApiKey = Deno.env.get("GHL_API_KEY")!;
  const locationId = Deno.env.get("GHL_LOCATION_ID")!;

  await fetch("https://services.leadconnectorhq.com/conversations/messages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${ghlApiKey}`,
      "Content-Type": "application/json",
      "Version": "2021-07-28",
    },
    body: JSON.stringify({
      locationId,
      type: args.channel === "instagram" ? "IG" : args.channel === "sms" ? "SMS" : "Email",
      contactId: args.to,
      message: args.body,
    }),
  });
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
