import { NextResponse } from "next/server";
import { getStripeServerClient } from "@/lib/integrations/stripe/client";
import { getQuoteStatusWithFallback } from "@/lib/nexus/service";
import { env } from "@/lib/config/env";

interface CheckoutRequestBody {
  quote_ref: string;
  success_url?: string;
  cancel_url?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as CheckoutRequestBody;

  if (!body.quote_ref) {
    return NextResponse.json({ message: "quote_ref is required" }, { status: 400 });
  }

  const quote = await getQuoteStatusWithFallback(body.quote_ref);
  if (!quote) {
    return NextResponse.json({ message: "Quote not found" }, { status: 404 });
  }

  const stripe = getStripeServerClient();

  if (!stripe) {
    return NextResponse.json({
      mode: "mock",
      quote_ref: body.quote_ref,
      message: "Stripe not configured. Use webhook simulation to complete payment.",
    });
  }

  const origin =
    request.headers.get("origin") ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000";
  const successUrl = body.success_url ?? `${origin}/quote/success`;
  const cancelUrl = body.cancel_url ?? `${origin}/quote/payment`;

  const amountInMinorUnits = Math.round(quote.premium.total_gbp * 100);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: env.STRIPE_CURRENCY,
          unit_amount: amountInMinorUnits,
          product_data: {
            name: `EYA Quote ${quote.quote_ref}`,
            description: `Case ${quote.case_ref}`,
          },
        },
      },
    ],
    metadata: {
      quote_ref: quote.quote_ref,
      case_ref: quote.case_ref,
    },
  });

  return NextResponse.json({
    mode: "stripe",
    quote_ref: quote.quote_ref,
    session_id: session.id,
    checkout_url: session.url,
  });
}
