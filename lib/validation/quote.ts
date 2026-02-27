import { z } from "zod";
import type { QuoteApplicationPayload } from "@/lib/domain/quote";

const postcodeSchema = z.string().trim().min(3).max(12);

const addressSchema = z.object({
  postcode: postcodeSchema,
  line1: z.string().trim().min(2).max(140),
  line2: z.string().trim().max(140).optional().or(z.literal("")),
  town: z.string().trim().min(2).max(100),
  county: z.string().trim().max(100).optional().or(z.literal("")),
});

const siteSchema = z.object({
  setting_main_activity: z.enum([
    "Affiliate",
    "Baby & Toddler (multiple locations)",
    "Childminding professional",
    "Crèche",
    "Full-year day care provision",
    "Holiday club",
    "Individual",
    "International",
    "Local authority",
    "School",
    "Single-site baby and toddler group",
    "Student",
    "Term-time provision",
    "Wraparound provision (before and after school)",
  ]),
  setting_address: addressSchema,
  is_domestic_premises: z.enum(["Domestic", "Non-domestic"]),
  legal_status: z.enum([
    "Sole Trader",
    "Partnership",
    "Limited Company",
    "Charity",
    "Local Authority",
    "Other",
  ]),
  ofsted_number: z.string().trim().max(50).optional().or(z.literal("")),
});

const insuranceQuestionsSchema = z
  .object({
    is_outdoor_provision: z.boolean(),
    ages_0_3: z.boolean(),
    ages_3_5: z.boolean(),
    ages_5_11: z.boolean(),
    ages_12_plus: z.boolean(),
    annual_turnover: z.number().nonnegative(),
    contents_equipment_value: z.number().nonnegative(),
    wants_extra_public_liability_10m: z.boolean(),
    professional_indemnity_level: z.enum(["None", "250000", "500000"]),
    wants_wraparound_cover: z.boolean(),
    wants_holiday_club_cover: z.boolean(),
    wants_shed_outbuildings_cover: z.enum(["None", "Level 1", "Level 2"]),
    wants_computer_cover_10k: z.boolean(),
    wants_childrens_parties_cover: z.boolean(),
    wants_outside_play_equipment_cover: z.boolean(),
    wants_abuse_cover: z.boolean(),
    wants_terrorism_cover: z.boolean(),
    wants_fidelity_cover: z.boolean(),
    wants_main_building_insurance: z.boolean(),
    wants_additional_building_insurance: z.boolean(),
    claims_last_5_years: z.enum(["0", "1", "2", "3", "4+"]),
  })
  .superRefine((value, ctx) => {
    if (
      !value.ages_0_3 &&
      !value.ages_3_5 &&
      !value.ages_5_11 &&
      !value.ages_12_plus
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ages_0_3"],
        message: "At least one age range must be selected.",
      });
    }
  });

export const quoteApplicationSchema = z
  .object({
    your_details: z
      .object({
        is_new_or_renewing: z.enum([
          "Joining for first time",
          "Renewing membership/insurance",
        ]),
        title: z.string().trim().min(2).max(20),
        first_name: z.string().trim().min(2).max(80),
        last_name: z.string().trim().min(2).max(80),
        org_name: z.string().trim().max(120).optional().or(z.literal("")),
        correspondence_address: addressSchema,
        email: z.string().trim().email(),
        email_confirm: z.string().trim().email(),
        password: z
          .string()
          .min(10)
          .regex(/[A-Z]/, "Password must include one capital letter")
          .regex(/[0-9]/, "Password must include one number")
          .regex(/[^A-Za-z0-9]/, "Password must include one special character"),
        password_confirm: z.string().min(10),
        mobile_number: z.string().trim().min(8).max(20),
        alternative_number: z.string().trim().max(20).optional().or(z.literal("")),
        job_role: z.enum([
          "Manager",
          "Owner",
          "Administrator",
          "Committee Member",
          "Childminder",
          "Other",
        ]),
        start_date: z.string().date(),
      })
      .superRefine((value, ctx) => {
        if (value.email !== value.email_confirm) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["email_confirm"],
            message: "Email confirmation must match.",
          });
        }
        if (value.password !== value.password_confirm) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["password_confirm"],
            message: "Password confirmation must match.",
          });
        }
      }),
    general: z
      .object({
        main_site: siteSchema,
        additional_services: z.object({
          has_wraparound_provision: z.boolean(),
          has_holiday_club: z.boolean(),
          has_baby_toddler: z.boolean(),
          has_forest_school: z.boolean(),
        }),
        accepts_membership_declaration: z.boolean(),
        wants_insurance_quote: z.boolean(),
        insurance_questions: insuranceQuestionsSchema.optional(),
        additional_sites: z.array(siteSchema),
      })
      .superRefine((value, ctx) => {
        if (!value.accepts_membership_declaration) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["accepts_membership_declaration"],
            message: "Membership declaration must be accepted.",
          });
        }
        if (value.wants_insurance_quote && !value.insurance_questions) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["insurance_questions"],
            message: "Insurance questions are required for insurance quotes.",
          });
        }
      }),
    assumptions: z.object({
      assumption_bankrupt: z.boolean(),
      assumption_receiver: z.boolean(),
      assumption_disqualified: z.boolean(),
      assumption_criminal: z.boolean(),
      assumption_insurance_cancelled: z.boolean(),
      assumption_claim_circumstances: z.boolean(),
      assumption_employee_warning: z.boolean(),
    }),
    declaration: z.object({
      agrees_demands_needs: z.literal(true),
      agrees_declaration: z.literal(true),
    }),
    ern: z
      .object({
        is_ern_exempt: z.boolean(),
        ern_number: z.string().trim().max(40).optional().or(z.literal("")),
      })
      .superRefine((value, ctx) => {
        if (!value.is_ern_exempt && !value.ern_number) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["ern_number"],
            message: "ERN number is required when not exempt.",
          });
        }
      }),
    payment_method: z.enum([
      "Invoice",
      "Annual Direct Debit",
      "Credit Card",
      "Close Brothers Premium Finance",
    ]),
  })
  .strict();

export type QuoteApplicationInput = z.infer<typeof quoteApplicationSchema>;

export function validateQuoteApplication(payload: unknown): QuoteApplicationPayload {
  return quoteApplicationSchema.parse(payload);
}
