"use client";

import Link from "next/link";
import { useState } from "react";
import type { QuoteApplicationPayload } from "@/lib/domain/quote";
import { getQuoteDraft, saveQuoteDraft } from "@/lib/quote/draft-storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectField, TextField } from "@/components/quote/field-controls";

export function Step1YourDetailsForm() {
  const [draft, setDraft] = useState<QuoteApplicationPayload>(() => getQuoteDraft());

  const yourDetails = draft.your_details;

  function update(value: Partial<typeof yourDetails>) {
    const next = {
      ...draft,
      your_details: { ...draft.your_details, ...value },
    };
    setDraft(next);
    saveQuoteDraft(next);
  }

  function updateAddress(
    addressValue: Partial<typeof yourDetails.correspondence_address>,
  ) {
    update({
      correspondence_address: {
        ...yourDetails.correspondence_address,
        ...addressValue,
      },
    });
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Step 1 — Your Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <SelectField
          id="is_new_or_renewing"
          label="Membership status"
          value={yourDetails.is_new_or_renewing}
          onChange={(value) =>
            update({
              is_new_or_renewing: value as QuoteApplicationPayload["your_details"]["is_new_or_renewing"],
            })
          }
          options={[
            "Joining for first time",
            "Renewing membership/insurance",
          ]}
        />
        <TextField
          id="title"
          label="Title"
          value={yourDetails.title}
          onChange={(value) => update({ title: value })}
        />
        <TextField
          id="first_name"
          label="First name"
          value={yourDetails.first_name}
          onChange={(value) => update({ first_name: value })}
        />
        <TextField
          id="last_name"
          label="Last name"
          value={yourDetails.last_name}
          onChange={(value) => update({ last_name: value })}
        />
        <TextField
          id="org_name"
          label="Organisation name"
          value={yourDetails.org_name ?? ""}
          onChange={(value) => update({ org_name: value })}
        />
        <SelectField
          id="job_role"
          label="Job role"
          value={yourDetails.job_role}
          onChange={(value) =>
            update({ job_role: value as QuoteApplicationPayload["your_details"]["job_role"] })
          }
          options={[
            "Manager",
            "Owner",
            "Administrator",
            "Committee Member",
            "Childminder",
            "Other",
          ]}
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          value={yourDetails.email}
          onChange={(value) => update({ email: value })}
        />
        <TextField
          id="email_confirm"
          label="Confirm email"
          type="email"
          value={yourDetails.email_confirm}
          onChange={(value) => update({ email_confirm: value })}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          value={yourDetails.password}
          onChange={(value) => update({ password: value })}
        />
        <TextField
          id="password_confirm"
          label="Confirm password"
          type="password"
          value={yourDetails.password_confirm}
          onChange={(value) => update({ password_confirm: value })}
        />
        <TextField
          id="mobile_number"
          label="Mobile number"
          type="tel"
          value={yourDetails.mobile_number}
          onChange={(value) => update({ mobile_number: value })}
        />
        <TextField
          id="alternative_number"
          label="Alternative number"
          type="tel"
          value={yourDetails.alternative_number ?? ""}
          onChange={(value) => update({ alternative_number: value })}
        />
        <TextField
          id="start_date"
          label="Policy start date"
          type="date"
          value={yourDetails.start_date}
          onChange={(value) => update({ start_date: value })}
        />
        <TextField
          id="correspondence_postcode"
          label="Correspondence postcode"
          value={yourDetails.correspondence_address.postcode}
          onChange={(value) => updateAddress({ postcode: value })}
        />
        <TextField
          id="correspondence_line1"
          label="Address line 1"
          value={yourDetails.correspondence_address.line1}
          onChange={(value) => updateAddress({ line1: value })}
        />
        <TextField
          id="correspondence_line2"
          label="Address line 2"
          value={yourDetails.correspondence_address.line2 ?? ""}
          onChange={(value) => updateAddress({ line2: value })}
        />
        <TextField
          id="correspondence_town"
          label="Town"
          value={yourDetails.correspondence_address.town}
          onChange={(value) => updateAddress({ town: value })}
        />
        <TextField
          id="correspondence_county"
          label="County"
          value={yourDetails.correspondence_address.county ?? ""}
          onChange={(value) => updateAddress({ county: value })}
        />
        <div className="md:col-span-2 flex justify-end">
          <Button asChild>
            <Link href="/quote/general">Continue to Step 2</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
