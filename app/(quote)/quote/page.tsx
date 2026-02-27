import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormHelpText, FormLabel } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

export default function QuoteStartPage() {
  return (
    <PageShell>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Quote journey</h1>
        <p className="text-muted-foreground">
          Phase 1 placeholder for the full 6-step EYA quote journey.
        </p>
      </div>

      <Card className="mt-8 max-w-2xl">
        <CardHeader>
          <CardTitle>Step 1 preview: Your details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField>
            <FormLabel htmlFor="first_name">First name</FormLabel>
            <Input id="first_name" placeholder="Jane" />
          </FormField>
          <FormField>
            <FormLabel htmlFor="last_name">Last name</FormLabel>
            <Input id="last_name" placeholder="Doe" />
          </FormField>
          <FormField>
            <FormLabel htmlFor="email">Email address</FormLabel>
            <Input id="email" type="email" placeholder="jane@example.com" />
            <FormHelpText>
              Full underwriting fields and validation are implemented in Phase 3/4.
            </FormHelpText>
          </FormField>
          <Button>Continue to full flow (coming next)</Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}
