import { getResendClient } from "@/lib/integrations/resend/client";
import { getSupabaseAdminClient } from "@/lib/integrations/supabase/admin";
import { buildRenewalReminderHtml, buildRenewalReminderText } from "@/lib/emails/renewal-reminder";
import { log } from "@/lib/logger";

const REMINDER_DAYS = [30, 14, 7, 1];

function daysBetween(from: Date, to: Date) {
  const millis = to.getTime() - from.getTime();
  return Math.ceil(millis / (1000 * 60 * 60 * 24));
}

export async function runRenewalRemindersJob() {
  const supabase = getSupabaseAdminClient() as any;
  if (!supabase) {
    return { sent: 0, skipped: 0, mode: "no-supabase" as const };
  }

  const { data: policies, error } = await supabase
    .from("policies")
    .select("id, policy_number, term_end_date, case_id");

  if (error || !policies) {
    throw new Error(`Unable to load policies: ${error?.message ?? "unknown error"}`);
  }

  let sent = 0;
  let skipped = 0;
  const today = new Date();
  const resend = getResendClient();
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "notifications@example.com";

  for (const policy of policies as Array<{
    policy_number: string;
    term_end_date: string;
    case_id: string;
  }>) {
    const expiry = new Date(policy.term_end_date);
    const daysUntilExpiry = daysBetween(today, expiry);

    if (!REMINDER_DAYS.includes(daysUntilExpiry)) {
      skipped += 1;
      continue;
    }

    const { data: caseRow } = await supabase
      .from("cases")
      .select("member_id")
      .eq("id", policy.case_id)
      .single();

    const memberId = (caseRow as any)?.member_id as string | null;
    if (!memberId) {
      skipped += 1;
      continue;
    }

    const { data: memberRow } = await supabase
      .from("members")
      .select("email")
      .eq("id", memberId)
      .single();

    const memberEmail = (memberRow as any)?.email as string | null;
    if (!memberEmail) {
      skipped += 1;
      continue;
    }

    if (!resend) {
      log("info", "Resend not configured, skipping email send", {
        policyNumber: policy.policy_number,
        memberEmail,
        daysUntilExpiry,
      });
      skipped += 1;
      continue;
    }

    await resend.emails.send({
      from: fromEmail,
      to: memberEmail,
      subject: `EYA renewal reminder: ${daysUntilExpiry} day(s) remaining`,
      html: buildRenewalReminderHtml({
        policyNumber: policy.policy_number,
        daysUntilExpiry,
      }),
      text: buildRenewalReminderText({
        policyNumber: policy.policy_number,
        daysUntilExpiry,
      }),
    });

    sent += 1;
  }

  return { sent, skipped, mode: resend ? ("resend" as const) : ("no-resend" as const) };
}
