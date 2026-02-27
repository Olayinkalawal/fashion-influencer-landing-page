import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PortalHomePage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Member portal</h1>
      <p className="mt-2 text-muted-foreground">
        Phase 1 placeholder. Authentication and role-protected access land in Phase 2.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Policy status widget</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Will show live status: Quotation, On Cover, NTU, Lapsed.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Document vault</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Will list policy documents sourced from internal Nexus Core document URLs.
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
