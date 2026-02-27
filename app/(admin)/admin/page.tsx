import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminHomePage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">Admin console</h1>
      <p className="mt-2 text-muted-foreground">
        Phase 1 placeholder. Role-based protection and management tooling are added in Phase 2+.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          "Members",
          "Cases & referrals",
          "Courses",
          "Analytics",
        ].map((title) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Configuration and management workspace coming in subsequent phases.
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
