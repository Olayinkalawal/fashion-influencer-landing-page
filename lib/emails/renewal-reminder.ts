interface RenewalReminderEmailInput {
  policyNumber: string;
  daysUntilExpiry: number;
}

export function buildRenewalReminderHtml({
  policyNumber,
  daysUntilExpiry,
}: RenewalReminderEmailInput) {
  return `
    <div style="font-family: Arial, sans-serif; color: #172033;">
      <h2 style="margin-bottom: 8px;">EYA Renewal Reminder</h2>
      <p>Your policy <strong>${policyNumber}</strong> is due to expire in <strong>${daysUntilExpiry} day(s)</strong>.</p>
      <p>Please sign in to your member portal to review details and submit your renewal.</p>
      <p style="margin-top: 20px;">— EYA Member Services</p>
    </div>
  `;
}

export function buildRenewalReminderText({
  policyNumber,
  daysUntilExpiry,
}: RenewalReminderEmailInput) {
  return `EYA Renewal Reminder: Policy ${policyNumber} expires in ${daysUntilExpiry} day(s). Sign in to your member portal to renew.`;
}
