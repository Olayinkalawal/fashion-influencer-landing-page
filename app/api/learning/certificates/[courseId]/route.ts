import { NextResponse } from "next/server";
import { generateCertificatePdf } from "@/lib/certificates/pdf";
import { mockCourses } from "@/lib/learning/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: { courseId: string } },
) {
  const course = mockCourses.find((item) => item.id === params.courseId);
  if (!course) {
    return NextResponse.json({ message: "Course not found" }, { status: 404 });
  }

  const pdfBytes = await generateCertificatePdf({
    memberName: "EYA Member",
    courseTitle: course.title,
    cpdHours: course.cpd_hours,
    issuedOn: new Date().toISOString().slice(0, 10),
  });

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="eya-certificate-${course.id}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
