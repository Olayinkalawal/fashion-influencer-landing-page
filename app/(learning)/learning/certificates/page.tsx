import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCourses } from "@/lib/learning/mock-data";

const mockCertificates = mockCourses.map((course, index) => ({
  id: `cert-${course.id}`,
  course_id: course.id,
  course_title: course.title,
  issued_on: `2026-02-${10 + index}`,
  cpd_hours: course.cpd_hours,
}));

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
              <a
                href={`/api/learning/certificates/${certificate.course_id}`}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-2"
              >
                Download certificate PDF (template)
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
