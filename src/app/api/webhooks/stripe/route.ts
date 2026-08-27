import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { fail, ok } from "@/lib/api";

/**
 * POST /api/webhooks/stripe
 *
 * Handles subscription lifecycle events. The signature check below mirrors
 * Stripe's scheme so the verification path is real; swap the handler bodies for
 * Prisma writes when the database is connected.
 *
 * Note: the raw body must be read as text — parsing it as JSON first would
 * change the bytes the signature was computed over.
 */
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const rawBody = await request.text();

  if (!secret) {
    return fail("not_configured", "STRIPE_WEBHOOK_SECRET is not set.", 503);
  }
  if (!signature) {
    return fail("missing_signature", "Missing stripe-signature header.", 400);
  }
  if (!verifyStripeSignature(rawBody, signature, secret)) {
    return fail("invalid_signature", "Signature verification failed.", 400);
  }

  let event: { id?: string; type?: string; data?: { object?: Record<string, unknown> } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return fail("invalid_json", "Webhook body was not valid JSON.", 400);
  }

  switch (event.type) {
    case "checkout.session.completed":
      // Activate the licence: set subscriptionEndsAt, clear grace, restore
      // capabilities, and emit license.subscription_activated. Data is preserved
      // unless the licence had already reached the purged state.
      break;

    case "invoice.paid":
      // Extend currentPeriodEnd and mark the invoice paid.
      break;

    case "invoice.payment_failed":
      // Move the subscription to PAST_DUE. The licence does not lapse yet —
      // dunning runs first, and grace only starts when the period actually ends.
      break;

    case "customer.subscription.deleted":
      // Start the grace period from the end of the paid term and materialise
      // the reminder schedule from the organisation policy.
      break;

    case "customer.subscription.updated":
      // Plan or cycle change: re-resolve the licensing policy from the new plan.
      break;

    default:
      // Unhandled events are acknowledged so Stripe stops retrying them.
      break;
  }

  return ok({ received: true, type: event.type ?? "unknown", id: event.id ?? null });
}

/** Verifies Stripe's `t=…,v1=…` signature header against the raw body. */
function verifyStripeSignature(rawBody: string, header: string, secret: string, toleranceSeconds = 300): boolean {
  const parts = Object.fromEntries(
    header.split(",").map((piece) => {
      const [key, value] = piece.split("=");
      return [key?.trim(), value?.trim()];
    }),
  ) as { t?: string; v1?: string };

  if (!parts.t || !parts.v1) return false;

  const timestamp = Number(parts.t);
  if (!Number.isFinite(timestamp)) return false;
  if (Math.abs(Date.now() / 1000 - timestamp) > toleranceSeconds) return false;

  const expected = createHmac("sha256", secret).update(`${parts.t}.${rawBody}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(parts.v1);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET() {
  return NextResponse.json({ error: { code: "method_not_allowed", message: "Use POST." } }, { status: 405 });
}
