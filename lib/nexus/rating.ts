import type {
  QuoteApplicationPayload,
  QuoteInsuranceQuestions,
  SettingMainActivity,
} from "@/lib/domain/quote";
import type { PremiumBreakdown, PremiumBreakdownLine } from "@/lib/domain/nexus";

const IPT_RATE = 0.12;

const BASE_ACTIVITY_RATES: Record<SettingMainActivity, number> = {
  Affiliate: 180,
  "Baby & Toddler (multiple locations)": 265,
  "Childminding professional": 215,
  "Crèche": 290,
  "Full-year day care provision": 340,
  "Holiday club": 240,
  Individual: 140,
  International: 420,
  "Local authority": 410,
  School: 390,
  "Single-site baby and toddler group": 210,
  Student: 95,
  "Term-time provision": 250,
  "Wraparound provision (before and after school)": 275,
};

const EXTENSION_PRICES = {
  wants_extra_public_liability_10m: 103.15,
  wants_wraparound_cover: 52.03,
  wants_holiday_club_cover: 52.03,
  wants_computer_cover_10k: 54.81,
  professional_indemnity_250000: 56.8,
  professional_indemnity_500000: 80.14,
  wants_abuse_cover: 250,
  wants_terrorism_cover: 50,
  wants_fidelity_cover: 34,
  wants_childrens_parties_cover: 29,
  wants_main_building_insurance: 220,
  wants_additional_building_insurance: 125,
  shed_level_1: 32,
  shed_level_2: 58,
};

function addLine(lines: PremiumBreakdownLine[], code: string, label: string, amount: number) {
  if (amount <= 0) return;
  lines.push({ code, label, amount_gbp: Number(amount.toFixed(2)) });
}

function ageBandLoad(insurance: QuoteInsuranceQuestions): number {
  let load = 0;
  if (insurance.ages_0_3) load += 0.2;
  if (insurance.ages_3_5) load += 0.1;
  if (insurance.ages_5_11) load += 0.08;
  if (insurance.ages_12_plus) load += 0.05;
  return load;
}

export function calculatePremium(payload: QuoteApplicationPayload): PremiumBreakdown {
  const lines: PremiumBreakdownLine[] = [];
  const activityBase = BASE_ACTIVITY_RATES[payload.general.main_site.setting_main_activity];
  const domesticModifier =
    payload.general.main_site.is_domestic_premises === "Domestic" ? 0.9 : 1;

  let subtotal = activityBase * domesticModifier;
  addLine(lines, "base", "Base premium", subtotal);

  const additionalSiteCount = payload.general.additional_sites.length;
  if (additionalSiteCount > 0) {
    const additionalSitesCost = additionalSiteCount * 65;
    subtotal += additionalSitesCost;
    addLine(lines, "additional_sites", "Additional sites", additionalSitesCost);
  }

  if (!payload.general.wants_insurance_quote) {
    const membershipOnly = 95;
    subtotal = membershipOnly;
    lines.length = 0;
    addLine(lines, "membership_only", "Membership only", membershipOnly);
  } else if (payload.general.insurance_questions) {
    const insurance = payload.general.insurance_questions;
    const turnoverLoad = Math.min(insurance.annual_turnover / 500000, 1.2);
    const contentsLoad = Math.min(insurance.contents_equipment_value / 250000, 0.5);
    const bandsLoad = ageBandLoad(insurance);
    const riskLoadPct = turnoverLoad * 0.15 + contentsLoad * 0.12 + bandsLoad;
    const riskLoadAmount = subtotal * riskLoadPct;

    subtotal += riskLoadAmount;
    addLine(lines, "risk_load", "Risk loading", riskLoadAmount);

    if (insurance.wants_extra_public_liability_10m) {
      subtotal += EXTENSION_PRICES.wants_extra_public_liability_10m;
      addLine(
        lines,
        "extra_public_liability_10m",
        "Extra Public Liability (£10m)",
        EXTENSION_PRICES.wants_extra_public_liability_10m,
      );
    }

    if (insurance.professional_indemnity_level === "250000") {
      subtotal += EXTENSION_PRICES.professional_indemnity_250000;
      addLine(
        lines,
        "professional_indemnity_250000",
        "Professional Indemnity (£250,000)",
        EXTENSION_PRICES.professional_indemnity_250000,
      );
    } else if (insurance.professional_indemnity_level === "500000") {
      subtotal += EXTENSION_PRICES.professional_indemnity_500000;
      addLine(
        lines,
        "professional_indemnity_500000",
        "Professional Indemnity (£500,000)",
        EXTENSION_PRICES.professional_indemnity_500000,
      );
    }

    if (insurance.wants_wraparound_cover) {
      subtotal += EXTENSION_PRICES.wants_wraparound_cover;
      addLine(lines, "wraparound_cover", "Wraparound cover", EXTENSION_PRICES.wants_wraparound_cover);
    }

    if (insurance.wants_holiday_club_cover) {
      subtotal += EXTENSION_PRICES.wants_holiday_club_cover;
      addLine(lines, "holiday_club_cover", "Holiday club cover", EXTENSION_PRICES.wants_holiday_club_cover);
    }

    if (insurance.wants_shed_outbuildings_cover === "Level 1") {
      subtotal += EXTENSION_PRICES.shed_level_1;
      addLine(lines, "shed_outbuildings_level_1", "Shed & outbuildings level 1", EXTENSION_PRICES.shed_level_1);
    }
    if (insurance.wants_shed_outbuildings_cover === "Level 2") {
      subtotal += EXTENSION_PRICES.shed_level_2;
      addLine(lines, "shed_outbuildings_level_2", "Shed & outbuildings level 2", EXTENSION_PRICES.shed_level_2);
    }

    if (insurance.wants_computer_cover_10k) {
      subtotal += EXTENSION_PRICES.wants_computer_cover_10k;
      addLine(lines, "computer_cover_10k", "Computer cover (£10,000)", EXTENSION_PRICES.wants_computer_cover_10k);
    }

    if (insurance.wants_childrens_parties_cover) {
      subtotal += EXTENSION_PRICES.wants_childrens_parties_cover;
      addLine(lines, "childrens_parties_cover", "Children's parties cover", EXTENSION_PRICES.wants_childrens_parties_cover);
    }

    if (insurance.wants_fidelity_cover) {
      subtotal += EXTENSION_PRICES.wants_fidelity_cover;
      addLine(lines, "fidelity_cover", "Fidelity guarantee cover", EXTENSION_PRICES.wants_fidelity_cover);
    }

    if (insurance.wants_main_building_insurance) {
      subtotal += EXTENSION_PRICES.wants_main_building_insurance;
      addLine(lines, "main_building_insurance", "Main building insurance", EXTENSION_PRICES.wants_main_building_insurance);
    }

    if (insurance.wants_additional_building_insurance) {
      subtotal += EXTENSION_PRICES.wants_additional_building_insurance;
      addLine(
        lines,
        "additional_building_insurance",
        "Additional building insurance",
        EXTENSION_PRICES.wants_additional_building_insurance,
      );
    }

    if (insurance.wants_abuse_cover) {
      subtotal += EXTENSION_PRICES.wants_abuse_cover;
      addLine(lines, "abuse_cover", "Abuse cover (referral)", EXTENSION_PRICES.wants_abuse_cover);
    }

    if (insurance.wants_terrorism_cover) {
      subtotal += EXTENSION_PRICES.wants_terrorism_cover;
      addLine(lines, "terrorism_cover", "Terrorism cover (referral)", EXTENSION_PRICES.wants_terrorism_cover);
    }
  }

  subtotal = Number(subtotal.toFixed(2));
  const ipt = Number((subtotal * IPT_RATE).toFixed(2));
  const total = Number((subtotal + ipt).toFixed(2));

  return {
    subtotal_gbp: subtotal,
    ipt_gbp: ipt,
    total_gbp: total,
    lines,
  };
}

export function evaluateReferralReasons(payload: QuoteApplicationPayload) {
  const reasons: string[] = [];

  if (payload.general.insurance_questions?.wants_abuse_cover) {
    reasons.push("Abuse cover requires manual referral.");
  }

  if (payload.general.insurance_questions?.wants_terrorism_cover) {
    reasons.push("Terrorism cover requires manual referral.");
  }

  const hasAssumptionYes = Object.values(payload.assumptions).some(Boolean);
  if (hasAssumptionYes) {
    reasons.push("One or more assumptions require manual underwriter review.");
  }

  return reasons;
}
