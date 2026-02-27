#!/usr/bin/env node

import { fetchWithRetry } from "./utils/http.mjs";

const stagingUrl = process.env.STAGING_URL;

if (!stagingUrl) {
  console.error("Missing STAGING_URL environment variable.");
  process.exit(1);
}

const normalizedUrl = stagingUrl.endsWith("/")
  ? stagingUrl.slice(0, -1)
  : stagingUrl;

async function check(endpoint, options = {}) {
  const method = options.method ?? "GET";
  const attempts = method === "GET" ? 3 : 1;
  const response = await fetchWithRetry(`${normalizedUrl}${endpoint}`, options, { attempts });
  const text = await response.text();
  return {
    endpoint,
    status: response.status,
    ok: response.ok,
    bodyPreview: text.slice(0, 200),
  };
}

async function run() {
  const checks = [];

  checks.push(await check("/"));
  checks.push(await check("/quote"));
  checks.push(
    await check("/api/nexus/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        your_details: {
          is_new_or_renewing: "Joining for first time",
          title: "Ms",
          first_name: "Staging",
          last_name: "User",
          org_name: "Staging Org",
          correspondence_address: {
            postcode: "SW1A1AA",
            line1: "1 Test Street",
            line2: "",
            town: "London",
            county: "London",
          },
          email: "staging@example.com",
          email_confirm: "staging@example.com",
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
            annual_turnover: 100000,
            contents_equipment_value: 15000,
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
    }),
  );

  if (process.env.CRON_SECRET) {
    checks.push(
      await check("/api/cron/renewal-reminders", {
        method: "POST",
        headers: {
          "x-cron-secret": process.env.CRON_SECRET,
        },
      }),
    );
  }

  console.table(
    checks.map((item) => ({
      endpoint: item.endpoint,
      status: item.status,
      ok: item.ok,
      bodyPreview: item.bodyPreview,
    })),
  );

  const failed = checks.filter((item) => !item.ok);
  if (failed.length > 0) {
    process.exit(1);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
