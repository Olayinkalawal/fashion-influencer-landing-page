import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MarketingHomePage() {
  return (
    <PageShell>
      <section className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            EYA Insurance & Learning Platform
          </h1>
          <p className="max-w-3xl text-muted-foreground">
            A unified digital journey for quotes, policy servicing, member
            support, and CPD delivery—powered by an internal Nexus Core.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/quote">Start a quote</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/portal">Open member portal</Link>
          </Button>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Quote Journey</CardTitle>
            <CardDescription>6-step underwriting flow</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Full customer payload capture with draft persistence and referrals.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nexus Core</CardTitle>
            <CardDescription>Internal underwriting engine</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Pricing matrix, case statuses, bind, policy records, and documents.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Member Portal</CardTitle>
            <CardDescription>Policy self-service</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Policy status, document vault, renewals, profile updates and claims
            guidance.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>CPD Learning</CardTitle>
            <CardDescription>Courses + live sessions</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Member learning catalogue, progress tracking and certificate output.
          </CardContent>
        </Card>
      </section>
    </PageShell>
  );
}
