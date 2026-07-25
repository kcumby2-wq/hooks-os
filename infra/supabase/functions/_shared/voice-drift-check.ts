/**
 * hooks-os · Shared · Voice-drift check
 *
 * Runs INSIDE every AI Edge Function as a post-generation guardrail.
 * Enforces outcomes-based-communication/ + margin-voice/ before delivery.
 *
 * Flow:
 *   1. Generate output
 *   2. Run drift check
 *   3. If pass → return
 *   4. If fail → regenerate with corrective prompt (up to 3 retries)
 *   5. If still fail → escalate to human review queue
 */

import Anthropic from "npm:@anthropic-ai/sdk@0.30.0";

export type DriftCheckResult = {
  passed: boolean;
  failures: string[];   // list of failing check names
  suggestions: string;  // corrective feedback for retry
};

export type DriftCheckContext = {
  segment: "youth_hs" | "college_bound" | "alumni_pro";
  recipient: "athlete" | "parent" | "combined";
  content_type: "recap" | "qualification_reply" | "intervention" | "outreach";
};

const BANNED_LANGUAGE = [
  // feature-language flags · per outcomes-based-communication/
  /\b(comprehensive|holistic|world-class|premier|leading|innovative|cutting-edge)\b/i,
  // sales-y softeners
  /\b(feel free to|don't hesitate|please don't hesitate)\b/i,
  // hype without proof
  /\b(guaranteed|proven method|unlock your potential|next level)\b/i,
];

const REQUIRED_OUTCOME_MARKERS = [
  // must lead with something concrete the athlete does
  /\b(you|your|Athlete)\b/i,
];

export async function runDriftCheck(
  draft: string,
  ctx: DriftCheckContext,
): Promise<DriftCheckResult> {
  const failures: string[] = [];

  // fast structural checks (no API call)
  for (const pattern of BANNED_LANGUAGE) {
    if (pattern.test(draft)) {
      failures.push(`banned_language:${pattern.source}`);
    }
  }

  const opensWithOutcome = REQUIRED_OUTCOME_MARKERS.some((p) =>
    p.test(draft.slice(0, 200))
  );
  if (!opensWithOutcome) {
    failures.push("no_outcome_lead_in_first_paragraph");
  }

  // segment/recipient register check
  if (ctx.segment === "youth_hs" && ctx.recipient === "athlete") {
    failures.push("segment_mismatch:youth_hs_athlete_direct");
  }
  if (ctx.segment === "alumni_pro" && ctx.recipient === "parent") {
    failures.push("segment_mismatch:alumni_addressing_parent");
  }

  // deeper voice check via Claude (only if structural checks pass)
  if (failures.length === 0) {
    const voiceScore = await callVoiceCritic(draft, ctx);
    if (!voiceScore.matches_margin_voice) {
      failures.push(`voice_mismatch:${voiceScore.mismatch_reason}`);
    }
  }

  return {
    passed: failures.length === 0,
    failures,
    suggestions: buildCorrectiveFeedback(failures),
  };
}

async function callVoiceCritic(
  draft: string,
  ctx: DriftCheckContext,
): Promise<{ matches_margin_voice: boolean; mismatch_reason?: string }> {
  const anthropic = new Anthropic({
    apiKey: Deno.env.get("ANTHROPIC_API_KEY")!,
  });

  const res = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 200,
    system:
      "You judge whether a draft matches Margin's voice: coach-direct, plain English, outcome-first, no marketing filler, no false hype. Return JSON only: {matches_margin_voice: bool, mismatch_reason?: string}.",
    messages: [{
      role: "user",
      content:
        `Segment: ${ctx.segment}\nRecipient: ${ctx.recipient}\nContent type: ${ctx.content_type}\n\nDraft:\n${draft}`,
    }],
  });

  const text = (res.content[0] as { type: "text"; text: string }).text;
  try {
    return JSON.parse(text);
  } catch {
    return { matches_margin_voice: true }; // fail-open on parse error
  }
}

function buildCorrectiveFeedback(failures: string[]): string {
  if (failures.length === 0) return "";
  return `Previous draft failed voice checks: ${failures.join("; ")}. ` +
    `Rewrite: lead with what the athlete actually did or will do (outcome-first). ` +
    `Cut marketing filler. Keep it plain and specific. Match Margin's coach-direct voice.`;
}

export const MAX_RETRIES = 3;

export async function generateWithDriftGuard<T>(
  generate: (correctiveFeedback: string) => Promise<{ text: string; meta: T }>,
  ctx: DriftCheckContext,
): Promise<{
  text: string;
  meta: T;
  passed: boolean;
  attempts: number;
  finalFailures: string[];
}> {
  let feedback = "";
  let lastResult: { text: string; meta: T } | null = null;
  let lastCheck: DriftCheckResult = { passed: false, failures: [], suggestions: "" };

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    lastResult = await generate(feedback);
    lastCheck = await runDriftCheck(lastResult.text, ctx);
    if (lastCheck.passed) {
      return {
        text: lastResult.text,
        meta: lastResult.meta,
        passed: true,
        attempts: attempt,
        finalFailures: [],
      };
    }
    feedback = lastCheck.suggestions;
  }

  return {
    text: lastResult!.text,
    meta: lastResult!.meta,
    passed: false,
    attempts: MAX_RETRIES,
    finalFailures: lastCheck.failures,
  };
}
