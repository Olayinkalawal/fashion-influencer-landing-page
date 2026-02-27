"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormHelpText, FormLabel } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { QuoteApplicationPayload } from "@/lib/domain/quote";
import type { QuoteResponse } from "@/lib/domain/nexus";

export function QuoteDemoForm() {
  const [firstName, setFirstName] = useState("Jane");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("jane@example.com");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);

  const basePayload = useMemo<QuoteApplicationPayload>(
    () => ({
      your_details: {
        is_new_or_renewing: "Joining for first time",
        title: "Ms",
        first_name: firstName,
        last_name: lastName,
        org_name: "Acorn Nursery",
        correspondence_address: {
          postcode: "SW1A1AA",
          line1: "1 Westminster House",
          line2: "",
          town: "London",
          county: "Greater London",
        },
        email,
        email_confirm: email,
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
            line1: "1 Westminster House",
            line2: "",
            town: "London",
            county: "Greater London",
          },
          is_domestic_premises: "Non-domestic",
          legal_status: "Limited Company",
          ofsted_number: "OF123456",
        },
        additional_services: {
          has_wraparound_provision: true,
          has_holiday_club: false,
          has_baby_toddler: true,
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
          annual_turnover: 220000,
          contents_equipment_value: 45000,
          wants_extra_public_liability_10m: true,
          professional_indemnity_level: "500000",
          wants_wraparound_cover: true,
          wants_holiday_club_cover: false,
          wants_shed_outbuildings_cover: "Level 1",
          wants_computer_cover_10k: true,
          wants_childrens_parties_cover: false,
          wants_outside_play_equipment_cover: true,
          wants_abuse_cover: false,
          wants_terrorism_cover: false,
          wants_fidelity_cover: true,
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
    [email, firstName, lastName],
  );

  async function handleQuoteSubmit() {
    setError(null);
    setIsSubmitting(true);
    setQuote(null);

    try {
      const response = await fetch("/api/nexus/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(basePayload),
      });

      if (!response.ok) {
        const body = (await response.json()) as { message?: string };
        throw new Error(body.message ?? "Failed to create quote");
      }

      const body = (await response.json()) as QuoteResponse;
      setQuote(body);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to generate quote",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mt-8 max-w-2xl">
      <CardHeader>
        <CardTitle>Step 1 preview: Your details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField>
          <FormLabel htmlFor="first_name">First name</FormLabel>
          <Input
            id="first_name"
            placeholder="Jane"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor="last_name">Last name</FormLabel>
          <Input
            id="last_name"
            placeholder="Doe"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor="email">Email address</FormLabel>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <FormHelpText>
            This preview submits a complete canonical underwriting payload to internal
            <code className="mx-1 rounded bg-muted px-1 py-0.5">/api/nexus/quote</code>.
          </FormHelpText>
        </FormField>
        <Button onClick={handleQuoteSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Generating quote..." : "Generate sample quote"}
        </Button>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {quote ? (
          <div className="space-y-1 rounded-md border border-border bg-muted/40 p-4 text-sm">
            <p>
              <strong>Case Ref:</strong> {quote.case_ref}
            </p>
            <p>
              <strong>Quote Ref:</strong> {quote.quote_ref}
            </p>
            <p>
              <strong>Status:</strong> {quote.status}
            </p>
            <p>
              <strong>Subtotal:</strong> £{quote.premium.subtotal_gbp.toFixed(2)}
            </p>
            <p>
              <strong>IPT:</strong> £{quote.premium.ipt_gbp.toFixed(2)}
            </p>
            <p>
              <strong>Total:</strong> £{quote.premium.total_gbp.toFixed(2)}
            </p>
            {quote.referral_required ? (
              <p className="pt-1 text-amber-700">
                Referral: {quote.referral_reasons.join(" ")}
              </p>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
