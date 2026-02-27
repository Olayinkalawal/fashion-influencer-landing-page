#!/usr/bin/env node

import Stripe from "stripe";
import { fetchWithRetry } from "./utils/http.mjs";

const stagingUrl = process.env.STAGING_URL;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stagingUrl) {
  console.error("Missing STAGING_URL.");
  process.exit(1);
}

if (!webhookSecret) {
  console.error("Missing STRIPE_WEBHOOK_SECRET.");
  process.exit(1);
}

const normalizedUrl = stagingUrl.endsWith("/")
  ? stagingUrl.slice(0, -1)
  : stagingUrl;

async function createQuote() {
  const response = await fetchWithRetry(`${normalizedUrl}/api/nexus/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      your_details: {
        is_new_or_renewing: "Joining for first time",
        title: "Ms",
        first_name: "Webhook",
        last_name: "Verifier",
        org_name: "Staging Org",
        correspondence_address: {
          postcode: "SW1A1AA",
          line1: "1 Test Street",
          line2: "",
          town: "London",
          county: "London",
        },
        email: "webhook.verifier@example.com",
        email_confirm: "webhook.verifier@example.com",
        password: "StrongPass#1",
        password_confirm: "StrongPass#1",
        mobile_number: "07123456789",
        alternative_number: "",
        job_role: "Manager",
        start_date: "2026-04-01",
      },
      general: {
        main_site: {
          setting_main_activity: "Full-year day care provision",
          setting_address: {
            postcode: "SW1A1AA",
            line1: "1 Test Street",
            line2: "",
            town: "London",
            county: "London",
          },
          is_domestic_premises: "Non-domestic",
          legal_status: "Limited Company",
          ofsted_number: "OF123456",
        },
        additional_services: {
          has_wraparound_provision: false,
          has_holiday_club: false,
          has_baby_toddler: false,
          has_forest_school: false,
        },
        accepts_membership_declaration: true,
        wants_insurance_quote: true,
        insurance_questions: {
          is_outdoor_provision: false,
          ages_0_3: true,
          ages_3_5: true,
          ages_5_11: false,
          ages_12_plus: false,
          annual_turnover: 150000,
          contents_equipment_value: 20000,
          wants_extra_public_liability_10m: false,
          professional_indemnity_level: "None",
          wants_wraparound_cover: false,
          wants_holiday_club_cover: false,
          wants_shed_outbuildings_cover: "None",
          wants_computer_cover_10k: false,
          wants_childrens_parties_cover: false,
          wants_outside_play_equipment_cover: true,
          wants_abuse_cover: false,
          wants_terrorism_cover: false,
          wants_fidelity_cover: false,
          wants_main_building_insurance: false,
          wants_additional_building_insurance: false,
          claims_last_5_years: "0",
        },
        additional_sites: [],
      },
      assumptions: {
        assumption_bankrupt: false,
        assumption_receiver: false,
        assumption_disqualified: false,
        assumption_criminal: false,
        assumption_insurance_cancelled: false,
        assumption_claim_circumstances: false,
        assumption_employee_warning: false,
      },
      declaration: {
        agrees_demands_needs: true,
        agrees_declaration: true,
      },
      ern: {
        is_ern_exempt: false,
        ern_number: "123/AB4567",
      },
      payment_method: "Credit Card",
    }),
  }, { attempts: 1 });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Unable to create quote for webhook verification: ${body}`);
  }

  return response.json();
}

async function verifyWebhook() {
  const quote = await createQuote();
  const eventPayload = {
    id: `evt_verify_${Date.now()}`,
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        id: `cs_test_${Date.now()}`,
        object: "checkout.session",
        metadata: {
          quote_ref: quote.quote_ref,
          case_ref: quote.case_ref,
        },
      },
    },
  };

  const payloadString = JSON.stringify(eventPayload);
  const signature = Stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret: webhookSecret,
  });

  const response = await fetchWithRetry(`${normalizedUrl}/api/stripe/webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": signature,
    },
    body: payloadString,
  }, { attempts: 3 });

  const bodyText = await response.text();
  console.log("Webhook verification response status:", response.status);
  console.log("Webhook verification response body:", bodyText);

  if (!response.ok) {
    process.exit(1);
  }
}

verifyWebhook().catch((error) => {
  console.error(error);
  process.exit(1);
});
