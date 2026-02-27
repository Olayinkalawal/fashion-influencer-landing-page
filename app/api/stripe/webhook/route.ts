import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getStripeServerClient } from "@/lib/integrations/stripe/client";
import { processCheckoutCompleted } from "@/lib/integrations/stripe/process-checkout-completed";

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

    const processed = processCheckoutCompleted({
      eventId: mock.event_id,
      quoteRef: mock.quote_ref,
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
    return NextResponse.json(
      { message: "Invalid Stripe signature", error: String(error) },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const quoteRef = session.metadata?.quote_ref;
    const result = processCheckoutCompleted({
      eventId: event.id,
      quoteRef: quoteRef ?? "",
    });

    return NextResponse.json({
      mode: "stripe",
      handled: true,
      ...result,
    });
  }

  return NextResponse.json({
    mode: "stripe",
    handled: false,
    message: `Unhandled event type: ${event.type}`,
  });
}
