import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getStripeServerClient } from "@/lib/integrations/stripe/client";
import { processCheckoutCompleted } from "@/lib/integrations/stripe/process-checkout-completed";
import { log } from "@/lib/logger";

interface MockWebhookBody {
  event_id: string;
  quote_ref: string;
}

export async function POST(request: Request) {
  const stripe = getStripeServerClient();
  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  if (!stripe || !signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    const mock = JSON.parse(rawBody || "{}") as MockWebhookBody;
    if (!mock.event_id || !mock.quote_ref) {
      return NextResponse.json(
        {
          message:
            "Missing Stripe configuration. Provide mock body with event_id and quote_ref.",
        },
        { status: 400 },
      );
    }

    const processed = await processCheckoutCompleted({
      eventId: mock.event_id,
      quoteRef: mock.quote_ref,
    });
    log("info", "Processed mock checkout completion webhook", {
      eventId: mock.event_id,
      quoteRef: mock.quote_ref,
      idempotent: processed.idempotent,
    });

    return NextResponse.json({
      mode: "mock",
      ...processed,
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    log("warn", "Rejected Stripe webhook due to signature failure", {
      error: String(error),
    });
    return NextResponse.json(
      { message: "Invalid Stripe signature", error: String(error) },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const quoteRef = session.metadata?.quote_ref;
    const result = await processCheckoutCompleted({
      eventId: event.id,
      quoteRef: quoteRef ?? "",
    });
    log("info", "Processed Stripe checkout completion webhook", {
      eventId: event.id,
      quoteRef: quoteRef ?? "",
      idempotent: result.idempotent,
    });

    return NextResponse.json({
      mode: "stripe",
      handled: true,
      ...result,
    });
  }

  log("info", "Ignored unsupported Stripe webhook event", {
    eventType: event.type,
    eventId: event.id,
  });
  return NextResponse.json({
    mode: "stripe",
    handled: false,
    message: `Unhandled event type: ${event.type}`,
  });
}
