// add-eval/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminSelector, { Admin } from "@/components/AdminSelector";
import TeacherSelector from "@/components/TeacherSelector";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/lib/authContext";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import EvaluationForm from "@/components/EvaluationForm";
import MainInformationForm, { MainInformationFormData } from "@/components/MainInformationForm";
import CoreForm, { CoreFormData } from "@/components/CoreForm";
import { generateAndSavePDF } from "@/components/PdfGenerator"; // Import the PDF generator
import { Loader2 } from "lucide-react"; // Import loading spinner
import Send2Email from "@/components/Send2Mail"; // Import the Send2Email component

interface TeacherInfo {
  name: string;
  subject: string;
  oracle: string;
}

interface EvaluationScores {
  overallScore: number;
  planningScore: number;
  scientificCompetencyScore: number;
  strategiesScore: number;
  managementScore: number;
  assessmentScore: number;
  qualityScore: number;
}

const AddEvaluation = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedCycle, setSelectedCycle] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo>({
    name: "",
    subject: "",
    oracle: "",
  });

  // Form data state
  const [mainInfoData, setMainInfoData] = useState<MainInformationFormData>({
    schoolName: "",
    clusterManager: "",
    evaluatorJobTitle: "",
    schoolNumber: "",
    teacherName: "",
    oracle: "",
    gradeAndSection: "",
    period: "",
    subject: "",
    day: "",
    lesson: "",
    date: "",
    attendanceNumber: "",
    absentNumber: "",
    specialNeedsStudents: "",
  });

  const [coreFormData, setCoreFormData] = useState<CoreFormData>({
    strengths: "",
    improvements: "",
    teacherFeedback: "",
  });

  const [evaluationScores, setEvaluationScores] = useState<EvaluationScores>({
    overallScore: 0,
    planningScore: 0,
    scientificCompetencyScore: 0,
    strategiesScore: 0,
    managementScore: 0,
    assessmentScore: 0,
    qualityScore: 0,
  });

  // Local state to store the generated PDF URL
  const [generatedPDFUrl, setGeneratedPDFUrl] = useState<string>("");

  // Update scores handler
  const handleScoresUpdate = (scores: EvaluationScores) => {
    setEvaluationScores(scores);
  };

  // Teacher selection handler
  const handleTeacherSelect = async (teacherId: string, cycle: string) => {
    setSelectedTeacher(teacherId);
    setSelectedCycle(cycle);

    if (!user) return;

    try {
      const teacherDoc = await getDoc(doc(db, "users", user.uid, "teachers", teacherId));
      if (teacherDoc.exists()) {
        const teacherData = teacherDoc.data();
        setTeacherInfo({
          name: teacherData.arabicName || "",
          subject: teacherData.subject || "",
          oracle: teacherData.oracle || "",
        });

        // Update main information form with teacher data
        setMainInfoData(prev => ({
          ...prev,
          teacherName: teacherData.arabicName || "",
          subject: teacherData.subject || "",
          oracle: teacherData.oracle || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching teacher info:", error);
    }
  };

  // Form validation
  const validateForm = () => {
    if (!selectedTeacher || !selectedAdmin || !selectedCycle) {
      alert("الرجاء تعبئة جميع البيانات المطلوبة");
      return false;
    }

    if (!mainInfoData.schoolName || !mainInfoData.date) {
      alert("الرجاء تعبئة معلومات المدرسة والتاريخ");
      return false;
    }

    if (evaluationScores.overallScore === 0) {
      alert("الرجاء إكمال التقييم");
      return false;
    }

    return true;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;
    
    setIsSubmitting(true);
  
    try {
      // Generate and save the PDF
      const pdfURL = await generateAndSavePDF({
        mainInformation: mainInfoData,
        coreForm: coreFormData,
        evaluatorName: selectedAdmin.arabicName,
        teacherId: selectedTeacher,
        cycle: selectedCycle,
      });
  
      if (!pdfURL) {
        throw new Error("PDF URL generation failed.");
      }
      
      // Store the PDF URL locally so we can pass it to the email component
      setGeneratedPDFUrl(pdfURL);
  
      // Create evaluation object with the PDF link
      const evaluation = {
        teacherId: selectedTeacher,
        evaluatorName: selectedAdmin.arabicName,
        mainInformation: mainInfoData,
        coreForm: coreFormData,
        evaluationScores,
        pdfURL, // Store the PDF link
        date: serverTimestamp(),
        cycle: selectedCycle,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      };
  
      await addDoc(
        collection(db, "users", user.uid, "teachers", selectedTeacher, "evaluations"),
        evaluation
      );
  
      alert("تم حفظ التقييم بنجاح");
      // Optionally, you can redirect if needed:
      // router.push("/evaluations");
    } catch (error) {
      console.error("Error saving evaluation:", error);
      alert("حدث خطأ في حفظ التقييم");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Sidebar />
      <main className="p-4 md:p-8 transition-all duration-300 md:mr-64">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">إضافة تقييم جديد</h1>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 max-w-3xl mx-auto">
          {/* Teacher Selection */}
          <Card className="shadow-sm">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">اختر المعلم</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <TeacherSelector onSelectTeacher={handleTeacherSelect} />
            </CardContent>
          </Card>

          {/* Main Information Form */}
          <Card className="shadow-sm">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">معلومات المعلم</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <MainInformationForm
                name={teacherInfo.name}
                subject={teacherInfo.subject}
                oracle={teacherInfo.oracle}
                onInfoChange={setMainInfoData}
              />
            </CardContent>
          </Card>

          {/* Admin Selection */}
          <Card className="shadow-sm">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">اختر المقيّم</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <AdminSelector onSelect={setSelectedAdmin} />
            </CardContent>
          </Card>

          {/* Evaluation Form */}
          <div className="bg-white rounded-lg shadow-sm">
            <EvaluationForm onScoresUpdate={handleScoresUpdate} />
          </div>

          {/* Core Form */}
          <Card className="shadow-sm">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">معلومات التغذية الراجعة</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <CoreForm onCoreChange={setCoreFormData} />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full md:w-auto md:min-w-[200px] md:mx-auto block"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جارٍ الحفظ...
              </>
            ) : (
              'حفظ التقييم'
            )}
          </Button>
        </form>

        {/* Render the Send2Email component if a PDF URL has been generated */}
        {generatedPDFUrl && (
          <div className="mt-4">
            <Send2Email 
              pdfURL={generatedPDFUrl} 
              cycle={selectedCycle} 
              schoolName={mainInfoData.schoolName} 
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default AddEvaluation;
