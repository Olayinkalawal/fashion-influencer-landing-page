import { PageShell } from "@/components/layout/page-shell";
import { CertificatesClient } from "@/components/learning/certificates-client";

export default function CertificatesPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-semibold tracking-tight">CPD certificates</h1>
      <p className="mt-2 text-muted-foreground">
        Course completion certificates are listed here for download and evidence.
      </p>

      <div className="mt-8">
        <CertificatesClient />
      </div>
    </PageShell>
  );
}
