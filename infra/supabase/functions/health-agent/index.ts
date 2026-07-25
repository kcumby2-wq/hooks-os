/**
 * hooks-os · Edge Function · health-agent
 *
 * Implements skills/account-health-agent/ — daily signal-based drop-off detection.
 *
 * Trigger: Supabase cron · 09:00 CT daily
 *
 * Pipeline:
 *   1. Open scan_run row
 *   2. For each active client:
 *      - Compute all signals (attendance, recap engagement, comms, payment)
 *      - Insert signal rows for anything above threshold
 *   3. Derive flags from signals · one per (client · signal_type)
 *   4. Assign severity (watch/yellow/orange/red)
 *   5. Queue interventions per severity
 *   6. Close scan_run row
 */

import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2";
import Anthropic from "npm:@anthropic-ai/sdk@0.30.0";
import { generateWithDriftGuard } from "../_shared/voice-drift-check.ts";

// Thresholds per segment (days without session before signal fires)
const ATTENDANCE_GAP_THRESHOLDS: Record<string, number> = {
  youth_hs: 14,       // parent typically drives cadence · gap tolerated longer
  college_bound: 10,  // active in-season · shorter gap
  alumni_pro: 21,     // off-season heavy · looser
};

Deno.serve(async (_req) => {
  const supa = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // 1. Open scan run
  const { data: scanRun } = await supa.from("scan_runs").insert({
    scan_type: "account_health",
    started_at: new Date().toISOString(),
  }).select().single();

  const scanId = scanRun!.id as string;

  // 2. Load active clients
  const { data: clients } = await supa.from("clients")
    .select("id, segment")
    .eq("is_active", true);

  let signalsCreated = 0;
  let flagsOpened = 0;
  let flagsEscalated = 0;

  for (const client of clients ?? []) {
    const signals = await computeSignals(supa, client);
    for (const s of signals) {
      await supa.from("signals").insert({
        ...s,
        scan_run_id: scanId,
      });
      signalsCreated++;
    }

    // 3-4. Derive/update flag per (client · primary_signal_type)
    const flagChanges = await reconcileFlags(supa, client.id, signals);
    flagsOpened += flagChanges.opened;
    flagsEscalated += flagChanges.escalated;
  }

  // 5. Queue interventions for flags without one
  await queueInterventions(supa);

  await supa.from("scan_runs").update({
    completed_at: new Date().toISOString(),
    clients_scanned: clients?.length ?? 0,
    signals_created: signalsCreated,
    flags_opened: flagsOpened,
    flags_escalated: flagsEscalated,
  }).eq("id", scanId);

  return new Response(JSON.stringify({
    scan_id: scanId,
    clients: clients?.length ?? 0,
    signals: signalsCreated,
    flags_opened: flagsOpened,
  }), { headers: { "Content-Type": "application/json" } });
});

type ClientRow = { id: string; segment: string };
type ComputedSignal = {
  client_id: string;
  signal_type: string;
  payload: Record<string, unknown>;
  observed_at: string;
};

async function computeSignals(
  supa: SupabaseClient,
  client: ClientRow,
): Promise<ComputedSignal[]> {
  const signals: ComputedSignal[] = [];
  const now = new Date().toISOString();

  // -- attendance --
  const { data: recentSessions } = await supa.from("sessions")
    .select("scheduled_at, status")
    .eq("client_id", client.id)
    .order("scheduled_at", { ascending: false })
    .limit(10);

  if (recentSessions && recentSessions.length > 0) {
    const lastCompleted = recentSessions.find((s: { status: string }) => s.status === "completed");
    if (lastCompleted) {
      const daysSince = daysBetween(new Date(lastCompleted.scheduled_at as string), new Date());
      const threshold = ATTENDANCE_GAP_THRESHOLDS[client.segment] ?? 14;
      if (daysSince >= threshold) {
        signals.push({
          client_id: client.id,
          signal_type: "attendance_gap",
          payload: { days_since_last_session: daysSince, threshold },
          observed_at: now,
        });
      }
    }

    // no-show streak
    const recent2 = recentSessions.slice(0, 2);
    if (recent2.length === 2 && recent2.every((s: { status: string }) => s.status === "no_show")) {
      signals.push({
        client_id: client.id,
        signal_type: "no_show_streak",
        payload: { streak: 2 },
        observed_at: now,
      });
    }
  }

  // -- recap engagement --
  const { data: recapStats } = await supa.from("recap_delivery_stats")
    .select("*")
    .eq("client_id", client.id)
    .maybeSingle();

  if (recapStats && (recapStats.recaps_sent as number) >= 3) {
    const openRate = (recapStats.opens as number) / (recapStats.recaps_sent as number);
    if (openRate < 0.2) {
      signals.push({
        client_id: client.id,
        signal_type: "recap_open_streak_missed",
        payload: {
          recaps_sent: recapStats.recaps_sent,
          opens: recapStats.opens,
          open_rate: openRate,
        },
        observed_at: now,
      });
    }
  }

  // -- payment health --
  const { data: pkgs } = await supa.from("packages")
    .select("expires_at, status")
    .eq("client_id", client.id)
    .eq("status", "active");

  for (const pkg of pkgs ?? []) {
    const daysToExpiry = daysBetween(new Date(), new Date(pkg.expires_at as string));
    if (daysToExpiry <= 30 && daysToExpiry > 0) {
      // check whether there's been positive engagement recently
      const hasRecentEngagement = recapStats && (recapStats.last_open_at as string | null) &&
        daysBetween(new Date(recapStats.last_open_at as string), new Date()) < 14;
      if (!hasRecentEngagement) {
        signals.push({
          client_id: client.id,
          signal_type: "renewal_approaching_silent",
          payload: { days_to_expiry: daysToExpiry },
          observed_at: now,
        });
      }
    }
  }

  return signals;
}

async function reconcileFlags(
  supa: SupabaseClient,
  clientId: string,
  signals: ComputedSignal[],
): Promise<{ opened: number; escalated: number }> {
  let opened = 0;
  let escalated = 0;

  for (const s of signals) {
    const severity = assignSeverity(s);

    const { data: existing } = await supa.from("flags")
      .select("*")
      .eq("client_id", clientId)
      .eq("primary_signal_type", s.signal_type)
      .in("status", ["open", "intervention_queued", "intervention_sent"])
      .maybeSingle();

    if (!existing) {
      await supa.from("flags").insert({
        client_id: clientId,
        primary_signal_type: s.signal_type,
        severity,
        status: "open",
        rationale: `Auto-opened from daily scan · payload ${JSON.stringify(s.payload)}`,
      });
      opened++;
    } else if (severityRank(severity) > severityRank(existing.severity as string)) {
      await supa.from("flags").update({
        severity,
        rationale: `${existing.rationale}\n\nEscalated · new payload ${JSON.stringify(s.payload)}`,
      }).eq("id", existing.id);
      escalated++;
    }
  }

  return { opened, escalated };
}

function assignSeverity(s: ComputedSignal): string {
  if (s.signal_type === "no_show_streak") return "orange";
  if (s.signal_type === "attendance_gap") {
    const days = s.payload.days_since_last_session as number;
    if (days > 30) return "red";
    if (days > 21) return "orange";
    return "yellow";
  }
  if (s.signal_type === "renewal_approaching_silent") {
    const days = s.payload.days_to_expiry as number;
    if (days <= 7) return "red";
    if (days <= 14) return "orange";
    return "yellow";
  }
  if (s.signal_type === "recap_open_streak_missed") return "yellow";
  return "watch";
}

function severityRank(sev: string): number {
  return { watch: 0, yellow: 1, orange: 2, red: 3 }[sev] ?? 0;
}

async function queueInterventions(supa: SupabaseClient): Promise<void> {
  const { data: flags } = await supa.from("flags")
    .select("*, client:clients(*, lead:leads(*))")
    .eq("status", "open")
    .in("severity", ["yellow", "orange", "red"]);

  for (const flag of flags ?? []) {
    const interventionType = pickIntervention(flag.severity as string);

    // Draft intervention text if agent-authored
    if (interventionType === "agent_soft_touch") {
      const result = await generateWithDriftGuard(
        async (correctiveFeedback) => draftIntervention(flag, correctiveFeedback),
        {
          segment: (flag.client as { segment: "youth_hs" | "college_bound" | "alumni_pro" }).segment,
          recipient: "combined",
          content_type: "intervention",
        },
      );

      if (result.passed) {
        await supa.from("interventions").insert({
          flag_id: flag.id,
          client_id: flag.client_id,
          intervention_type: interventionType,
          message_body: result.text,
          drafted_by: "agent",
          scheduled_send_at: new Date().toISOString(),
        });
        await supa.from("flags").update({ status: "intervention_queued" }).eq("id", flag.id);
      }
    } else {
      // Human-authored intervention · queue empty draft for review
      await supa.from("interventions").insert({
        flag_id: flag.id,
        client_id: flag.client_id,
        intervention_type: interventionType,
        message_body: null,
        drafted_by: "pending_human",
      });
      await supa.from("flags").update({ status: "intervention_queued" }).eq("id", flag.id);
    }
  }
}

function pickIntervention(severity: string): string {
  switch (severity) {
    case "yellow": return "agent_soft_touch";
    case "orange": return "coach_personal_msg";
    case "red": return "margin_personal_msg";
    default: return "agent_soft_touch";
  }
}

async function draftIntervention(
  flag: Record<string, unknown>,
  correctiveFeedback: string,
): Promise<{ text: string; meta: Record<string, unknown> }> {
  const anthropic = new Anthropic({
    apiKey: Deno.env.get("ANTHROPIC_API_KEY")!,
  });

  const res = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 400,
    system: `Draft a warm, low-pressure check-in for a Margin Hooks / STL client showing early drop-off signals.

VOICE: Coach-direct. Not salesy. Not guilt-trippy. Ask a real question.

STRUCTURE:
- One sentence acknowledging what you noticed (concrete · not vague).
- One sentence framing it as a check on the athlete, not a chase for booking.
- One question the athlete or parent can answer easily.

Under 60 words. No CTA button · just a reply-friendly message.

${correctiveFeedback ? `\n\nCORRECTIVE FEEDBACK:\n${correctiveFeedback}` : ""}`,
    messages: [{
      role: "user",
      content: `Flag context: ${JSON.stringify({
        signal: flag.primary_signal_type,
        severity: flag.severity,
        rationale: flag.rationale,
      })}`,
    }],
  });

  const text = (res.content[0] as { type: "text"; text: string }).text;
  return { text, meta: {} };
}

function daysBetween(a: Date, b: Date): number {
  return Math.abs((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}
