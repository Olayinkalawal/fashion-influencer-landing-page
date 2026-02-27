"use client";

import Link from "next/link";
import { useState } from "react";
import type { QuoteApplicationPayload, QuoteSiteGeneral } from "@/lib/domain/quote";
import { getQuoteDraft, saveQuoteDraft } from "@/lib/quote/draft-storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckboxField,
  NumberField,
  SelectField,
  TextField,
} from "@/components/quote/field-controls";

const settingOptions = [
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
];

const legalStatusOptions = [
  "Sole Trader",
  "Partnership",
  "Limited Company",
  "Charity",
  "Local Authority",
  "Other",
];

function blankAdditionalSite(): QuoteSiteGeneral {
  return {
    setting_main_activity: "Full-year day care provision",
    setting_address: {
      postcode: "",
      line1: "",
      line2: "",
      town: "",
      county: "",
    },
    is_domestic_premises: "Non-domestic",
    legal_status: "Limited Company",
    ofsted_number: "",
  };
}

export function Step2GeneralForm() {
  const [draft, setDraft] = useState<QuoteApplicationPayload>(() => getQuoteDraft());

  const general = draft.general;
  const insurance = general.insurance_questions;
  type Insurance = NonNullable<QuoteApplicationPayload["general"]["insurance_questions"]>;

  function updateGeneral(value: Partial<typeof general>) {
    const next = {
      ...draft,
      general: { ...draft.general, ...value },
    };
    setDraft(next);
    saveQuoteDraft(next);
  }

  function updateMainSite(value: Partial<typeof general.main_site>) {
    updateGeneral({
      main_site: { ...general.main_site, ...value },
    });
  }

  function updateMainSiteAddress(value: Partial<typeof general.main_site.setting_address>) {
    updateMainSite({
      setting_address: {
        ...general.main_site.setting_address,
        ...value,
      },
    });
  }

  function updateInsurance(
    value: Partial<NonNullable<typeof draft.general.insurance_questions>>,
  ) {
    updateGeneral({
      insurance_questions: {
        ...general.insurance_questions!,
        ...value,
      },
    });
  }

  function addAdditionalSite() {
    updateGeneral({
      additional_sites: [...general.additional_sites, blankAdditionalSite()],
    });
  }

  function updateAdditionalSite(index: number, value: Partial<QuoteSiteGeneral>) {
    const nextSites = [...general.additional_sites];
    nextSites[index] = { ...nextSites[index], ...value };
    updateGeneral({ additional_sites: nextSites });
  }

  function updateAdditionalSiteAddress(
    index: number,
    value: Partial<QuoteSiteGeneral["setting_address"]>,
  ) {
    updateAdditionalSite(index, {
      setting_address: {
        ...general.additional_sites[index].setting_address,
        ...value,
      },
    });
  }

  function removeAdditionalSite(index: number) {
    const nextSites = general.additional_sites.filter((_, siteIndex) => siteIndex !== index);
    updateGeneral({ additional_sites: nextSites });
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Step 2 — General Questions & Extensions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <section className="grid gap-4 md:grid-cols-2">
          <SelectField
            id="setting_main_activity"
            label="Main activity"
            value={general.main_site.setting_main_activity}
            onChange={(value) =>
              updateMainSite({
                setting_main_activity:
                  value as QuoteApplicationPayload["general"]["main_site"]["setting_main_activity"],
              })
            }
            options={settingOptions}
          />
          <SelectField
            id="legal_status"
            label="Legal status"
            value={general.main_site.legal_status}
            onChange={(value) =>
              updateMainSite({
                legal_status:
                  value as QuoteApplicationPayload["general"]["main_site"]["legal_status"],
              })
            }
            options={legalStatusOptions}
          />
          <SelectField
            id="is_domestic_premises"
            label="Premises type"
            value={general.main_site.is_domestic_premises}
            onChange={(value) =>
              updateMainSite({
                is_domestic_premises:
                  value as QuoteApplicationPayload["general"]["main_site"]["is_domestic_premises"],
              })
            }
            options={["Domestic", "Non-domestic"]}
          />
          <TextField
            id="main_ofsted_number"
            label="Ofsted number"
            value={general.main_site.ofsted_number ?? ""}
            onChange={(value) => updateMainSite({ ofsted_number: value })}
          />
          <TextField
            id="main_postcode"
            label="Setting postcode"
            value={general.main_site.setting_address.postcode}
            onChange={(value) => updateMainSiteAddress({ postcode: value })}
          />
          <TextField
            id="main_line1"
            label="Address line 1"
            value={general.main_site.setting_address.line1}
            onChange={(value) => updateMainSiteAddress({ line1: value })}
          />
          <TextField
            id="main_line2"
            label="Address line 2"
            value={general.main_site.setting_address.line2 ?? ""}
            onChange={(value) => updateMainSiteAddress({ line2: value })}
          />
          <TextField
            id="main_town"
            label="Town"
            value={general.main_site.setting_address.town}
            onChange={(value) => updateMainSiteAddress({ town: value })}
          />
          <TextField
            id="main_county"
            label="County"
            value={general.main_site.setting_address.county ?? ""}
            onChange={(value) => updateMainSiteAddress({ county: value })}
          />
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold">Additional services</h3>
          <div className="grid gap-2 md:grid-cols-2">
            <CheckboxField
              id="has_wraparound_provision"
              label="Has wraparound provision"
              checked={general.additional_services.has_wraparound_provision}
              onChange={(checked) =>
                updateGeneral({
                  additional_services: {
                    ...general.additional_services,
                    has_wraparound_provision: checked,
                  },
                })
              }
            />
            <CheckboxField
              id="has_holiday_club"
              label="Has holiday club"
              checked={general.additional_services.has_holiday_club}
              onChange={(checked) =>
                updateGeneral({
                  additional_services: {
                    ...general.additional_services,
                    has_holiday_club: checked,
                  },
                })
              }
            />
            <CheckboxField
              id="has_baby_toddler"
              label="Has baby and toddler services"
              checked={general.additional_services.has_baby_toddler}
              onChange={(checked) =>
                updateGeneral({
                  additional_services: {
                    ...general.additional_services,
                    has_baby_toddler: checked,
                  },
                })
              }
            />
            <CheckboxField
              id="has_forest_school"
              label="Has forest school"
              checked={general.additional_services.has_forest_school}
              onChange={(checked) =>
                updateGeneral({
                  additional_services: {
                    ...general.additional_services,
                    has_forest_school: checked,
                  },
                })
              }
            />
          </div>
          <CheckboxField
            id="accepts_membership_declaration"
            label="I accept the membership declaration"
            checked={general.accepts_membership_declaration}
            onChange={(checked) => updateGeneral({ accepts_membership_declaration: checked })}
          />
          <CheckboxField
            id="wants_insurance_quote"
            label="I want an insurance quote (untick for membership only)"
            checked={general.wants_insurance_quote}
            onChange={(checked) => updateGeneral({ wants_insurance_quote: checked })}
          />
        </section>

        {general.wants_insurance_quote && insurance ? (
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Insurance-specific questions</h3>
            <div className="grid gap-2 md:grid-cols-2">
              <CheckboxField
                id="is_outdoor_provision"
                label="Solely outdoor provision"
                checked={insurance.is_outdoor_provision}
                onChange={(checked) => updateInsurance({ is_outdoor_provision: checked })}
              />
              <CheckboxField
                id="ages_0_3"
                label="Ages 0-3"
                checked={insurance.ages_0_3}
                onChange={(checked) => updateInsurance({ ages_0_3: checked })}
              />
              <CheckboxField
                id="ages_3_5"
                label="Ages 3-5"
                checked={insurance.ages_3_5}
                onChange={(checked) => updateInsurance({ ages_3_5: checked })}
              />
              <CheckboxField
                id="ages_5_11"
                label="Ages 5-11"
                checked={insurance.ages_5_11}
                onChange={(checked) => updateInsurance({ ages_5_11: checked })}
              />
              <CheckboxField
                id="ages_12_plus"
                label="Ages 12+"
                checked={insurance.ages_12_plus}
                onChange={(checked) => updateInsurance({ ages_12_plus: checked })}
              />
              <NumberField
                id="annual_turnover"
                label="Annual turnover (£)"
                value={insurance.annual_turnover}
                onChange={(value) => updateInsurance({ annual_turnover: value })}
              />
              <NumberField
                id="contents_equipment_value"
                label="Contents/equipment value (£)"
                value={insurance.contents_equipment_value}
                onChange={(value) => updateInsurance({ contents_equipment_value: value })}
              />
              <SelectField
                id="professional_indemnity_level"
                label="Professional indemnity level"
                value={insurance.professional_indemnity_level}
                onChange={(value) =>
                  updateInsurance({
                    professional_indemnity_level:
                      value as Insurance["professional_indemnity_level"],
                  })
                }
                options={["None", "250000", "500000"]}
              />
              <SelectField
                id="wants_shed_outbuildings_cover"
                label="Shed/outbuildings cover"
                value={insurance.wants_shed_outbuildings_cover}
                onChange={(value) =>
                  updateInsurance({
                    wants_shed_outbuildings_cover:
                      value as Insurance["wants_shed_outbuildings_cover"],
                  })
                }
                options={["None", "Level 1", "Level 2"]}
              />
              <SelectField
                id="claims_last_5_years"
                label="Claims in last 5 years"
                value={insurance.claims_last_5_years}
                onChange={(value) =>
                  updateInsurance({
                    claims_last_5_years:
                      value as Insurance["claims_last_5_years"],
                  })
                }
                options={["0", "1", "2", "3", "4+"]}
              />
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <CheckboxField
                id="wants_extra_public_liability_10m"
                label="Extra Public Liability £10m"
                checked={insurance.wants_extra_public_liability_10m}
                onChange={(checked) => updateInsurance({ wants_extra_public_liability_10m: checked })}
              />
              <CheckboxField
                id="wants_wraparound_cover"
                label="Wraparound cover"
                checked={insurance.wants_wraparound_cover}
                onChange={(checked) => updateInsurance({ wants_wraparound_cover: checked })}
              />
              <CheckboxField
                id="wants_holiday_club_cover"
                label="Holiday club cover"
                checked={insurance.wants_holiday_club_cover}
                onChange={(checked) => updateInsurance({ wants_holiday_club_cover: checked })}
              />
              <CheckboxField
                id="wants_computer_cover_10k"
                label="Computer cover £10k"
                checked={insurance.wants_computer_cover_10k}
                onChange={(checked) => updateInsurance({ wants_computer_cover_10k: checked })}
              />
              <CheckboxField
                id="wants_childrens_parties_cover"
                label="Children's parties cover"
                checked={insurance.wants_childrens_parties_cover}
                onChange={(checked) => updateInsurance({ wants_childrens_parties_cover: checked })}
              />
              <CheckboxField
                id="wants_outside_play_equipment_cover"
                label="Outside play equipment cover"
                checked={insurance.wants_outside_play_equipment_cover}
                onChange={(checked) =>
                  updateInsurance({ wants_outside_play_equipment_cover: checked })
                }
              />
              <CheckboxField
                id="wants_abuse_cover"
                label="Abuse cover (referral)"
                checked={insurance.wants_abuse_cover}
                onChange={(checked) => updateInsurance({ wants_abuse_cover: checked })}
              />
              <CheckboxField
                id="wants_terrorism_cover"
                label="Terrorism cover (referral)"
                checked={insurance.wants_terrorism_cover}
                onChange={(checked) => updateInsurance({ wants_terrorism_cover: checked })}
              />
              <CheckboxField
                id="wants_fidelity_cover"
                label="Fidelity cover"
                checked={insurance.wants_fidelity_cover}
                onChange={(checked) => updateInsurance({ wants_fidelity_cover: checked })}
              />
              <CheckboxField
                id="wants_main_building_insurance"
                label="Main building insurance"
                checked={insurance.wants_main_building_insurance}
                onChange={(checked) => updateInsurance({ wants_main_building_insurance: checked })}
              />
              <CheckboxField
                id="wants_additional_building_insurance"
                label="Additional building insurance"
                checked={insurance.wants_additional_building_insurance}
                onChange={(checked) =>
                  updateInsurance({ wants_additional_building_insurance: checked })
                }
              />
            </div>
          </section>
        ) : null}

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Additional sites</h3>
            <Button type="button" variant="outline" size="sm" onClick={addAdditionalSite}>
              Add site
            </Button>
          </div>
          {general.additional_sites.length === 0 ? (
            <p className="text-sm text-muted-foreground">No additional sites added.</p>
          ) : null}
          {general.additional_sites.map((site, index) => (
            <div key={index} className="rounded-md border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold">Site {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAdditionalSite(index)}
                >
                  Remove
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <SelectField
                  id={`site_${index}_activity`}
                  label="Main activity"
                  value={site.setting_main_activity}
                  onChange={(value) =>
                    updateAdditionalSite(index, {
                      setting_main_activity:
                        value as QuoteApplicationPayload["general"]["main_site"]["setting_main_activity"],
                    })
                  }
                  options={settingOptions}
                />
                <SelectField
                  id={`site_${index}_domestic`}
                  label="Premises type"
                  value={site.is_domestic_premises}
                  onChange={(value) =>
                    updateAdditionalSite(index, {
                      is_domestic_premises:
                        value as QuoteApplicationPayload["general"]["main_site"]["is_domestic_premises"],
                    })
                  }
                  options={["Domestic", "Non-domestic"]}
                />
                <TextField
                  id={`site_${index}_postcode`}
                  label="Postcode"
                  value={site.setting_address.postcode}
                  onChange={(value) => updateAdditionalSiteAddress(index, { postcode: value })}
                />
                <TextField
                  id={`site_${index}_line1`}
                  label="Address line 1"
                  value={site.setting_address.line1}
                  onChange={(value) => updateAdditionalSiteAddress(index, { line1: value })}
                />
                <TextField
                  id={`site_${index}_town`}
                  label="Town"
                  value={site.setting_address.town}
                  onChange={(value) => updateAdditionalSiteAddress(index, { town: value })}
                />
                <TextField
                  id={`site_${index}_ofsted`}
                  label="Ofsted number"
                  value={site.ofsted_number ?? ""}
                  onChange={(value) => updateAdditionalSite(index, { ofsted_number: value })}
                />
              </div>
            </div>
          ))}
        </section>

        <div className="flex justify-between">
          <Button asChild variant="outline">
            <Link href="/quote">Back</Link>
          </Button>
          <Button asChild>
            <Link href="/quote/assumptions">Continue to Step 3</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
