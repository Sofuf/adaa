"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebaseConfig";
import { deleteDoc, doc, Timestamp } from "firebase/firestore";
import { useAuth } from "@/lib/authContext";

interface Evaluation {
  id: string;
  teacherId: string;
  evaluatorId: string;
  date: Timestamp;
  cycle: string;
  evaluationScores: {
    overallScore: number;
    planningScore: number;
    scientificCompetencyScore: number;
    strategiesScore: number;
    managementScore: number;
    assessmentScore: number;
    qualityScore: number;
  };
  teacherName: string;
  evaluatorName: string;
  pdfURL: string;
  mainInformation?: {
    schoolName?: string;
  };
}

interface EvaluationDocumentProps {
  evaluation: Evaluation;
  onClose: () => void;
}

const EvaluationDocument: React.FC<EvaluationDocumentProps> = ({ evaluation, onClose }) => {
  const router = useRouter();
  const { user } = useAuth();

  const convertTo4PointScale = (score: number) => {
    // Assuming the original score is out of 150
    return ((score / 150) * 4).toFixed(2);
  };

  const handleViewPDF = () => {
    window.open(evaluation.pdfURL, "_blank");
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent("تقرير التغذية الراجعة / Feedback Report");
    
    // Split the body into Arabic and English parts
    const arabicBody = `السلام عليكم،

أسعد الله أوقاتكم بكل خير، مُرفق إليكم تقرير التغذية الراجعة للحصة التي تمت مشاهدتها مؤخرًا. نأمل أن تجدوا التقرير مفيدًا في تسليط الضوء على نقاط القوة والمجالات التي بحاجة إلى تحسين، وذلك لتحقيق أفضل أداء في المستقبل.

يرجى الاطلاع على التقرير وعدم التردد بإرسال أية ملاحظات أو استفسارات لديكم بشأنه. إن تعاونكم يساعد بالارتقاء بمستوى الأداء الأكاديمي وتقديم بيئة تعليمية متميزة.

رابط التقرير:
${evaluation.pdfURL}

شاكرين لكم حسن تعاونكم، ونسأل الله تعالى لكم دوام التوافيق والنجاح.
مع كامل الاحترام والتقدير،
إدارة ${evaluation.cycle} – ${evaluation.mainInformation?.schoolName || "المدرسة"}`;

    const englishBody = `

Greetings,

Attached is the feedback report for the session that was recently observed. We hope you find the report useful in highlighting the strengths and areas that need improvement, to achieve the best performance in the future.

Please review the report and do not hesitate to send any comments or inquiries you may have regarding it. Your cooperation greatly contributes to enhancing academic performance and providing an exceptional learning environment.

Report Link:
${evaluation.pdfURL}

We wish you ongoing success and prosperity.
Sincerely,
${evaluation.mainInformation?.schoolName || "School"} Administration.`;

    const body = encodeURIComponent(arabicBody + englishBody);

    try {
      // Try using window.open first
      const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
      const emailWindow = window.open(mailtoUrl);
      
      // If window.open returns null or undefined, try location.href as fallback
      if (!emailWindow) {
        window.location.href = mailtoUrl;
      }
    } catch (error) {
      console.error('Error opening email client:', error);
      
      // As a last resort, try creating and clicking a link
      const link = document.createElement('a');
      link.href = `mailto:?subject=${subject}&body=${body}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا التقييم؟");
    if (!confirmDelete) return;
    try {
      await deleteDoc(
        doc(
          db,
          "users",
          user.uid,
          "teachers",
          evaluation.teacherId,
          "evaluations",
          evaluation.id
        )
      );
      alert("تم حذف التقييم بنجاح");
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Error deleting evaluation:", error);
      alert("حدث خطأ أثناء حذف التقييم");
    }
  };

  const handleEdit = () => {
    router.push(`/edit-evaluation?id=${evaluation.id}&teacherId=${evaluation.teacherId}`);
  };

  const getCycleName = (cycle: string) => {
    switch (cycle) {
      case "cycle3":
        return "الحلقة الثالثة";
      case "cycle2":
        return "الحلقة الثانية";
      case "cycle1":
        return "الحلقة الأولى";
      case "kg":
        return "رياض الأطفال";
      default:
        return "غير معروف";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4" dir="rtl">
        <h2 className="text-xl font-bold">تفاصيل التقييم</h2>
        <div className="space-y-2">
          <p>
            <strong>المعلم:</strong> {evaluation.teacherName}
          </p>
          <p>
            <strong>المقيّم:</strong> {evaluation.evaluatorName}
          </p>
          <p>
            <strong>التاريخ:</strong>{" "}
            {new Date(evaluation.date.toMillis()).toLocaleDateString("ar-EG")}
          </p>
          <p>
            <strong>الحلقة:</strong> {getCycleName(evaluation.cycle)}
          </p>
          <p>
            <strong>الدرجة الكلية من 150:</strong> {evaluation.evaluationScores?.overallScore || 0}
          </p>
          <p>
            <strong>الدرجة الكلية من 4:</strong> {convertTo4PointScale(evaluation.evaluationScores?.overallScore || 0)}
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <Button onClick={handleViewPDF}>عرض التقرير</Button>
          <Button onClick={handleSendEmail}>إرسال بالبريد</Button>
          <Button onClick={handleEdit}>تعديل التقييم</Button>
          <Button onClick={handleDelete} variant="destructive">
            حذف التقييم
          </Button>
          <Button onClick={onClose} variant="outline">
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationDocument;