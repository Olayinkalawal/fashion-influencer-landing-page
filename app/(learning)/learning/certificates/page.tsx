import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockCertificates = [
  {
    id: "cert-1",
    course_title: "Safeguarding Refresher 2026",
    issued_on: "2026-02-10",
    cpd_hours: 2.5,
  },
];

export default function CertificatesPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">CPD certificates</h1>
      <p className="mt-2 text-muted-foreground">
        Course completion certificates are listed here for download and evidence.
      </p>

      <div className="mt-8 space-y-4">
        {mockCertificates.map((certificate) => (
          <Card key={certificate.id}>
            <CardHeader>
              <CardTitle>{certificate.course_title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Issued on: {certificate.issued_on}</p>
              <p>CPD hours: {certificate.cpd_hours}</p>
              <a href="#" className="text-primary underline underline-offset-2">
                Download certificate PDF (template)
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
