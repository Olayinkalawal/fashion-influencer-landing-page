import { bindQuote } from "@/lib/nexus/service";
import { hasProcessedEvent, markEventProcessed } from "@/lib/integrations/stripe/idempotency-store";

export interface CheckoutCompletedInput {
  eventId: string;
  quoteRef: string;
}

export function processCheckoutCompleted({ eventId, quoteRef }: CheckoutCompletedInput) {
  if (!quoteRef) {
    throw new Error("Missing quote reference in checkout session metadata");
  }

  if (hasProcessedEvent(eventId)) {
    return {
      idempotent: true,
      bindResult: null,
    };
  }

  const bindResult = bindQuote(quoteRef);
  markEventProcessed(eventId);

  return {
    idempotent: false,
    bindResult,
  };
}
