export type YesNo = "Yes" | "No";
export type NewOrRenewing = "Joining for first time" | "Renewing membership/insurance";
export type DomesticPremises = "Domestic" | "Non-domestic";

export type LegalStatus =
  | "Sole Trader"
  | "Partnership"
  | "Limited Company"
  | "Charity"
  | "Local Authority"
  | "Other";

export type SettingMainActivity =
  | "Affiliate"
  | "Baby & Toddler (multiple locations)"
  | "Childminding professional"
  | "Crèche"
  | "Full-year day care provision"
  | "Holiday club"
  | "Individual"
  | "International"
  | "Local authority"
  | "School"
  | "Single-site baby and toddler group"
  | "Student"
  | "Term-time provision"
  | "Wraparound provision (before and after school)";

export type JobRole =
  | "Manager"
  | "Owner"
  | "Administrator"
  | "Committee Member"
  | "Childminder"
  | "Other";

export type ProfessionalIndemnityLevel = "None" | "250000" | "500000";
export type ShedOutbuildingsLevel = "None" | "Level 1" | "Level 2";
export type ClaimsLastFiveYears = "0" | "1" | "2" | "3" | "4+";
export type PaymentMethod =
  | "Invoice"
  | "Annual Direct Debit"
  | "Credit Card"
  | "Close Brothers Premium Finance";

export interface QuoteAddress {
  postcode: string;
  line1: string;
  line2?: string;
  town: string;
  county?: string;
}

export interface QuoteYourDetails {
  is_new_or_renewing: NewOrRenewing;
  title: string;
  first_name: string;
  last_name: string;
  org_name?: string;
  correspondence_address: QuoteAddress;
  email: string;
  email_confirm: string;
  password: string;
  password_confirm: string;
  mobile_number: string;
  alternative_number?: string;
  job_role: JobRole;
  start_date: string;
}

export interface QuoteSiteGeneral {
  setting_main_activity: SettingMainActivity;
  setting_address: QuoteAddress;
  is_domestic_premises: DomesticPremises;
  legal_status: LegalStatus;
  ofsted_number?: string;
}

export interface QuoteAdditionalServices {
  has_wraparound_provision: boolean;
  has_holiday_club: boolean;
  has_baby_toddler: boolean;
  has_forest_school: boolean;
}

export interface QuoteInsuranceQuestions {
  is_outdoor_provision: boolean;
  ages_0_3: boolean;
  ages_3_5: boolean;
  ages_5_11: boolean;
  ages_12_plus: boolean;
  annual_turnover: number;
  contents_equipment_value: number;
  wants_extra_public_liability_10m: boolean;
  professional_indemnity_level: ProfessionalIndemnityLevel;
  wants_wraparound_cover: boolean;
  wants_holiday_club_cover: boolean;
  wants_shed_outbuildings_cover: ShedOutbuildingsLevel;
  wants_computer_cover_10k: boolean;
  wants_childrens_parties_cover: boolean;
  wants_outside_play_equipment_cover: boolean;
  wants_abuse_cover: boolean;
  wants_terrorism_cover: boolean;
  wants_fidelity_cover: boolean;
  wants_main_building_insurance: boolean;
  wants_additional_building_insurance: boolean;
  claims_last_5_years: ClaimsLastFiveYears;
}

export interface QuoteGeneralQuestions {
  main_site: QuoteSiteGeneral;
  additional_services: QuoteAdditionalServices;
  accepts_membership_declaration: boolean;
  wants_insurance_quote: boolean;
  insurance_questions?: QuoteInsuranceQuestions;
  additional_sites: QuoteSiteGeneral[];
}

export interface QuoteAssumptions {
  assumption_bankrupt: boolean;
  assumption_receiver: boolean;
  assumption_disqualified: boolean;
  assumption_criminal: boolean;
  assumption_insurance_cancelled: boolean;
  assumption_claim_circumstances: boolean;
  assumption_employee_warning: boolean;
}

export interface QuoteDeclaration {
  agrees_demands_needs: boolean;
  agrees_declaration: boolean;
}

export interface QuoteErn {
  is_ern_exempt: boolean;
  ern_number?: string;
}

export interface QuoteApplicationPayload {
  your_details: QuoteYourDetails;
  general: QuoteGeneralQuestions;
  assumptions: QuoteAssumptions;
  declaration: QuoteDeclaration;
  ern: QuoteErn;
  payment_method: PaymentMethod;
}
