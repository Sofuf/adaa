import jsPDF from 'jspdf';
import 'jspdf-autotable'; // For table generation
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { professorStorage } from '@/lib/professorFirebaseConfig';
import { CoreFormData } from './CoreForm';
import { MainInformationFormData } from './MainInformationForm';
import amiriFontBase64 from '@/assets/amiriFontBase64';
import moeLogo from '@/assets/logos/moe-logo.png';

// Import the arabic-reshaper package
import * as ArabicReshaper from 'arabic-reshaper';

interface PDFGeneratorProps {
  mainInformation: MainInformationFormData;
  coreForm: CoreFormData;
  evaluatorName: string;
  teacherId: string;
  cycle: string;
}

export async function generateAndSavePDF({
  mainInformation,
  coreForm,
  evaluatorName,
  teacherId,
  cycle,
}: PDFGeneratorProps): Promise<string> {
  // Create a new PDF document with compression enabled
  const doc = new jsPDF({ compress: true });

  // Add the Amiri font to the PDF for proper Arabic rendering
  doc.addFileToVFS("Amiri-Regular.ttf", amiriFontBase64);
  doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");

  // Get page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // --- Header Section ---
  // Adjusted logo size: width 25, height 20
  const logoWidth = 25;
  const logoHeight = 20;
  // Use moeLogo.src directly since moeLogo is a StaticImageData
  doc.addImage(
    moeLogo.src,
    'PNG',
    (pageWidth - logoWidth) / 2,
    5,
    logoWidth,
    logoHeight
  );

  // Draw header background (blue rectangle)
  doc.setFillColor(0, 102, 204);
  doc.rect(0, 35, pageWidth, 20, 'F');

  // Reshape and draw Arabic header text
  const arabicHeader = ArabicReshaper.convertArabic("تقرير تقييم المعلم");
  doc.setFont("Amiri", "normal");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(arabicHeader, pageWidth / 2, 40, { align: "center" });

  // Draw English header text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("Teacher Evaluation Report", pageWidth / 2, 50, { align: "center" });

  // --- Main Information Section ---
  let yPos = 70;
  const mainInfoHeight = 40;
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(10, yPos, pageWidth - 20, mainInfoHeight, 3, 3, 'F');
  doc.setFont("Amiri", "normal");
  doc.setFontSize(14);
  doc.setTextColor(0);

  // Reshape each Arabic string
  const schoolNameText = ArabicReshaper.convertArabic(`اسم المدرسة: ${mainInformation.schoolName}`);
  const teacherNameText = ArabicReshaper.convertArabic(`اسم المعلم: ${mainInformation.teacherName}`);
  const dateText = ArabicReshaper.convertArabic(`التاريخ: ${mainInformation.date}`);
  const oracleText = ArabicReshaper.convertArabic(`رقم الأوراكل: ${mainInformation.oracle}`);

  // Render Arabic main information starting from the right
  doc.text(schoolNameText, pageWidth - 15, yPos + 10, { align: "right" });
  doc.text(teacherNameText, pageWidth - 15, yPos + 18, { align: "right" });
  doc.text(dateText, pageWidth - 15, yPos + 26, { align: "right" });
  doc.text(oracleText, pageWidth - 15, yPos + 34, { align: "right" });

  // --- Feedback Section ---
  yPos += mainInfoHeight + 5;
  const feedbackHeader = ArabicReshaper.convertArabic("التغذية الراجعة");
  doc.setFontSize(16);
  doc.setTextColor(0, 102, 204);
  doc.text(feedbackHeader, pageWidth / 2, yPos, { align: "center" });

  // Feedback table data
  const feedbackData = [
    { category: "نقاط القوة / Strengths", detail: coreForm.strengths },
    { category: "نقاط التحسين / Areas for Improvement", detail: coreForm.improvements },
    { category: "ملاحظات المعلم / Teacher Feedback", detail: coreForm.teacherFeedback }
  ];

  yPos += 5;
  // Cast doc to any to bypass TypeScript errors for autoTable
  (doc as any).autoTable({
    startY: yPos,
    head: [["التفاصيل / Detail", "الفئة / Category"]],
    body: feedbackData.map(item => [item.detail, item.category]),
    styles: {
      font: "Amiri",
      fontSize: 12,
      halign: "right",
      cellPadding: 5,
      lineColor: [0, 102, 204],
      lineWidth: 0.5
    },
    headStyles: {
      fillColor: [0, 102, 204],
      textColor: 255,
      halign: "center"
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 40, fontStyle: "bold" }
    },
    margin: { left: 10, right: 10 },
    tableLineColor: [0, 102, 204],
    tableLineWidth: 0.5,
  });

  // Use optional chaining to avoid undefined errors
  const finalY = (doc as any).lastAutoTable?.finalY || yPos + 40;

  // --- Evaluator Information Section ---
  yPos = finalY + 20;
  const evaluatorInfoHeight = 20;
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(10, yPos, pageWidth - 20, evaluatorInfoHeight, 3, 3, 'F');
  doc.setFontSize(14);
  doc.setTextColor(0);

  const evaluatorText = ArabicReshaper.convertArabic(`اسم المقيّم: ${evaluatorName}`);
  const cycleText = ArabicReshaper.convertArabic(`الحلقة: ${cycle}`);
  doc.text(evaluatorText, pageWidth - 15, yPos + 10, { align: "right" });
  doc.text(cycleText, pageWidth - 15, yPos + 18, { align: "right" });

  // --- Footer Section ---
  const creationDateArabic = new Date().toLocaleDateString("ar-SA");
  const creationDateEnglish = new Date().toLocaleDateString("en-US");
  const footerArabic = ArabicReshaper.convertArabic(`تاريخ الإنشاء: ${creationDateArabic}`);
  doc.setFont("Amiri", "normal");
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(footerArabic, pageWidth / 2, pageHeight - 20, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text(`Creation Date: ${creationDateEnglish}`, pageWidth / 2, pageHeight - 10, { align: "center" });

  // Output the PDF as a blob for uploading
  const pdfBlob = doc.output("blob");

  try {
    const filename = `evaluation_${teacherId}_${new Date().getTime()}.pdf`;
    const storageRef = ref(professorStorage, `evaluations/${filename}`);
    await uploadBytes(storageRef, pdfBlob);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw error;
  }
}
