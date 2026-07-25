/**
 * hooks-os · Edge Function · stripe-webhook
 *
 * Receives Stripe payment events · writes to payment_events · fires
 * calculate_revenue_share() for qualifying source_tag clients (skills/roster-revenue-share/).
 *
 * Also drives package state transitions: succeeded → package active, failed →
 * flag account-health, renewal succeeded → close renewal flow.
 *
 * Trigger: Stripe webhook endpoint · verified via STRIPE_WEBHOOK_SECRET
 */

import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@14";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
});

Deno.serve(async (req) => {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("no signature", { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
    );
  } catch (err) {
    return new Response(`bad signature: ${(err as Error).message}`, { status: 400 });
  }

  const supa = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const eventType = mapStripeEvent(event.type);
  if (!eventType) {
    return new Response("ignored event type", { status: 200 });
  }

  // Idempotency · payment_events.stripe_event_id has unique constraint
  const { data: existing } = await supa.from("payment_events")
    .select("id")
    .eq("stripe_event_id", event.id)
    .maybeSingle();
  if (existing) return new Response("already processed", { status: 200 });

  // Load context from event
  const ctx = await extractContext(event, supa);
  if (!ctx) return new Response("no matching client · dropped", { status: 200 });

  // 1. Insert payment_event row
  const { data: pe } = await supa.from("payment_events").insert({
    client_id: ctx.client_id,
    package_id: ctx.package_id,
    event_type: eventType,
    stripe_event_id: event.id,
    stripe_payment_intent_id: ctx.stripe_pi,
    stripe_charge_id: ctx.stripe_ch,
    stripe_refund_id: ctx.stripe_re,
    amount_cents: ctx.amount_cents,
    currency: ctx.currency,
    source_tag_at_time: ctx.source_tag,
    is_roster_referral_at_time: ctx.is_roster_referral,
    occurred_at: new Date(event.created * 1000).toISOString(),
    raw_stripe_payload: event as unknown as Record<string, unknown>,
  }).select().single();

  // 2. Fire revenue-share calc (idempotent · returns null if not roster)
  await supa.rpc("calculate_revenue_share", { p_payment_event_id: pe!.id });

  // 3. Package state transitions
  await updatePackageState(supa, ctx, eventType);

  // 4. Payment_failed → open account-health signal
  if (eventType === "failed") {
    await supa.from("signals").insert({
      client_id: ctx.client_id,
      signal_type: "payment_failed",
      payload: {
        amount_cents: ctx.amount_cents,
        stripe_pi: ctx.stripe_pi,
      },
    });
  }

  return new Response(JSON.stringify({ received: eventType, event_id: event.id }), {
    headers: { "Content-Type": "application/json" },
  });
});

function mapStripeEvent(type: string): string | null {
  switch (type) {
    case "payment_intent.succeeded":
    case "invoice.payment_succeeded":
    case "charge.succeeded":
      return "succeeded";
    case "charge.refunded":
      return "refunded";
    case "charge.refund.updated":
      return "partial_refunded";
    case "charge.dispute.created":
      return "chargeback";
    case "invoice.payment_failed":
    case "payment_intent.payment_failed":
      return "failed";
    default:
      return null;
  }
}

type PaymentCtx = {
  client_id: string | null;
  package_id: string | null;
  stripe_pi: string | null;
  stripe_ch: string | null;
  stripe_re: string | null;
  amount_cents: number;
  currency: string;
  source_tag: string | null;
  is_roster_referral: boolean;
};

async function extractContext(
  event: Stripe.Event,
  supa: ReturnType<typeof createClient>,
): Promise<PaymentCtx | null> {
  // The exact accessor differs by event type · this covers the common cases
  const obj = event.data.object as Record<string, unknown>;

  const pi = (obj.payment_intent as string) ?? (obj.id as string);
  const ch = (obj.latest_charge as string) ?? (obj.charge as string) ?? null;
  const re = (obj.refund as string) ?? null;
  const amount = ((obj.amount as number) ?? (obj.amount_paid as number) ?? 0);
  const currency = ((obj.currency as string) ?? "usd");

  // Resolve client by stripe_subscription_id or stripe_payment_intent_id on packages
  const subId = (obj.subscription as string) ?? null;

  const { data: pkg } = await supa.from("packages")
    .select("id, client_id, client:clients(source, is_roster_referral)")
    .or(`stripe_subscription_id.eq.${subId ?? ""},stripe_payment_intent_id.eq.${pi ?? ""}`)
    .maybeSingle();

  if (!pkg) return null;

  const client = pkg.client as { source: string; is_roster_referral: boolean } | null;

  return {
    client_id: pkg.client_id as string,
    package_id: pkg.id as string,
    stripe_pi: pi,
    stripe_ch: ch,
    stripe_re: re,
    amount_cents: amount,
    currency,
    source_tag: client?.source ?? null,
    is_roster_referral: client?.is_roster_referral ?? false,
  };
}

async function updatePackageState(
  supa: ReturnType<typeof createClient>,
  ctx: PaymentCtx,
  eventType: string,
): Promise<void> {
  if (!ctx.package_id) return;

  if (eventType === "succeeded") {
    // Extend expires_at by whatever cadence the package uses · placeholder: +30 days on renewal
    // Real logic reads packages.tier and applies the correct cycle
    await supa.from("packages").update({
      status: "active",
    }).eq("id", ctx.package_id);
  }

  if (eventType === "refunded" || eventType === "chargeback") {
    await supa.from("packages").update({
      status: "cancelled",
    }).eq("id", ctx.package_id);
  }
}
