import { bindQuote } from "@/lib/nexus/service";
import { hasProcessedEvent, markEventProcessed } from "@/lib/integrations/stripe/idempotency-store";
import {
  hasPersistedPaymentEvent,
  persistPaymentCompletion,
} from "@/lib/nexus/persistence";

export interface CheckoutCompletedInput {
  eventId: string;
  quoteRef: string;
}

export async function processCheckoutCompleted({ eventId, quoteRef }: CheckoutCompletedInput) {
  if (!quoteRef) {
    throw new Error("Missing quote reference in checkout session metadata");
  }

  if (hasProcessedEvent(eventId) || (await hasPersistedPaymentEvent(eventId))) {
    markEventProcessed(eventId);
    return {
      idempotent: true,
      bindResult: null,
    };
  }

  const bindResult = await bindQuote(quoteRef);
  await persistPaymentCompletion({ quoteRef, eventId });
  markEventProcessed(eventId);

  return {
    idempotent: false,
    bindResult,
  };
}
