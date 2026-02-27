import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface CertificateInput {
  memberName: string;
  courseTitle: string;
  cpdHours: number;
  issuedOn: string;
}

export async function generateCertificatePdf({
  memberName,
  courseTitle,
  cpdHours,
  issuedOn,
}: CertificateInput) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  page.drawRectangle({
    x: 20,
    y: 20,
    width: 802,
    height: 555,
    borderColor: rgb(0.24, 0.31, 0.94),
    borderWidth: 2,
  });

  page.drawText("EYA PLATFORM", {
    x: 330,
    y: 525,
    size: 14,
    font: boldFont,
    color: rgb(0.24, 0.31, 0.94),
  });

  page.drawText("Certificate of CPD Completion", {
    x: 250,
    y: 470,
    size: 28,
    font: boldFont,
    color: rgb(0.11, 0.14, 0.22),
  });

  page.drawText("This certifies that", {
    x: 360,
    y: 420,
    size: 16,
    font,
    color: rgb(0.26, 0.29, 0.37),
  });

  page.drawText(memberName, {
    x: 240,
    y: 385,
    size: 30,
    font: boldFont,
    color: rgb(0.15, 0.2, 0.65),
  });

  page.drawText("has successfully completed", {
    x: 314,
    y: 345,
    size: 16,
    font,
    color: rgb(0.26, 0.29, 0.37),
  });

  page.drawText(courseTitle, {
    x: 140,
    y: 308,
    size: 24,
    font: boldFont,
    color: rgb(0.11, 0.14, 0.22),
  });

  page.drawText(`CPD hours awarded: ${cpdHours.toFixed(2)}`, {
    x: 320,
    y: 250,
    size: 15,
    font,
    color: rgb(0.26, 0.29, 0.37),
  });

  page.drawText(`Issued on: ${issuedOn}`, {
    x: 348,
    y: 225,
    size: 13,
    font,
    color: rgb(0.26, 0.29, 0.37),
  });

  page.drawText("EYA Learning Faculty", {
    x: 350,
    y: 120,
    size: 16,
    font: boldFont,
    color: rgb(0.11, 0.14, 0.22),
  });

  return pdfDoc.save();
}
