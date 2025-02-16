"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/authContext";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  DocumentData,
  Query,
  Timestamp,
} from "firebase/firestore";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import TeacherSelector from "@/components/TeacherSelector";
import AdminSelector, { Admin } from "@/components/AdminSelector";
import EvaluationDocument from "@/components/EvaluationDocument";

interface EvaluationScores {
  overallScore: number;
  planningScore: number;
  scientificCompetencyScore: number;
  strategiesScore: number;
  managementScore: number;
  assessmentScore: number;
  qualityScore: number;
}

interface MainInformation {
  schoolName?: string;
  teacherName?: string;
}

interface Evaluation {
  id: string;
  teacherId: string;
  evaluatorId: string;
  date: Timestamp;
  cycle: string;
  evaluationScores: EvaluationScores;
  teacherName: string;
  evaluatorName: string;
  pdfURL: string;
  mainInformation?: MainInformation;
}

export default function EvaluationsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [selectedTeacherName, setSelectedTeacherName] = useState<string>("");
  const [selectedAdminId, setSelectedAdminId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [allTeachers, setAllTeachers] = useState<
    { id: string; arabicName: string; cycle: string }[]
  >([]);

  useEffect(() => {
    if (!user) return;
    const fetchAllTeachers = async () => {
      try {
        const teachersRef = collection(db, "users", user.uid, "teachers");
        const teachersSnapshot = await getDocs(teachersRef);
        const teachersData = teachersSnapshot.docs.map((doc) => ({
          id: doc.id,
          arabicName: doc.data().arabicName || "غير معروف",
          cycle: doc.data().cycle || "",
        }));
        setAllTeachers(teachersData);
      } catch (error) {
        console.error("Error fetching all teachers:", error);
      }
    };
    fetchAllTeachers();
  }, [user]);

  useEffect(() => {
    const fetchEvaluations = async () => {
      if (!user) return;
      setLoading(true);
      let evaluationsData: Evaluation[] = [];

      try {
        if (selectedTeacherId) {
          const teacherId = selectedTeacherId;
          const teacherName = selectedTeacherName;
          const evaluationsQuery: Query<DocumentData> = collection(
            db,
            "users",
            user.uid,
            "teachers",
            teacherId,
            "evaluations"
          );
          const evalSnapshot = await getDocs(evaluationsQuery);
          const evals = evalSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              teacherId,
              evaluatorId: data.createdBy,
              date: data.date,
              cycle: data.cycle,
              evaluationScores: data.evaluationScores || {
                overallScore: 0,
                planningScore: 0,
                scientificCompetencyScore: 0,
                strategiesScore: 0,
                managementScore: 0,
                assessmentScore: 0,
                qualityScore: 0,
              },
              teacherName: data.mainInformation?.teacherName || teacherName,
              evaluatorName: data.evaluatorName || "غير معروف",
              pdfURL: data.pdfURL || "",
              mainInformation: data.mainInformation,
            } as Evaluation;
          });
          evaluationsData.push(...evals);
        } else {
          for (const teacher of allTeachers) {
            const teacherId = teacher.id;
            const teacherName = teacher.arabicName;
            const evaluationsQuery: Query<DocumentData> = collection(
              db,
              "users",
              user.uid,
              "teachers",
              teacherId,
              "evaluations"
            );
            const evalSnapshot = await getDocs(evaluationsQuery);
            const evals = evalSnapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                teacherId,
                evaluatorId: data.createdBy,
                date: data.date,
                cycle: data.cycle,
                evaluationScores: data.evaluationScores || {
                  overallScore: 0,
                  planningScore: 0,
                  scientificCompetencyScore: 0,
                  strategiesScore: 0,
                  managementScore: 0,
                  assessmentScore: 0,
                  qualityScore: 0,
                },
                teacherName: data.mainInformation?.teacherName || teacherName,
                evaluatorName: data.evaluatorName || "غير معروف",
                pdfURL: data.pdfURL || "",
                mainInformation: data.mainInformation,
              } as Evaluation;
            });
            evaluationsData.push(...evals);
          }
        }

        if (selectedAdminId) {
          evaluationsData = evaluationsData.filter(
            (evaluation) => evaluation.evaluatorId === selectedAdminId
          );
        }

        if (selectedDate !== "") {
          evaluationsData = evaluationsData.filter((evaluation) => {
            const evalDate = new Date(evaluation.date.toMillis())
              .toISOString()
              .split("T")[0];
            return evalDate === selectedDate;
          });
        }

        evaluationsData.sort((a, b) => b.date.toMillis() - a.date.toMillis());
        setEvaluations(evaluationsData);
      } catch (error) {
        console.error("Error fetching evaluations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [
    user,
    selectedTeacherId,
    selectedAdminId,
    selectedDate,
    allTeachers,
    selectedTeacherName,
  ]);

  const formatDate = (date: Timestamp) => {
    if (!date) return "N/A";
    return new Date(date.toMillis()).toLocaleDateString("en-GB");
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Sidebar />
      <main className="p-4 md:mr-64">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold">سجل التقييمات</h1>
          <Button onClick={() => router.push("/add-eval")}>
            إضافة تقييم جديد
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>الفلترة</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TeacherSelector
              onSelectTeacher={(teacherId: string, cycle: string, teacherName: string) => {
                setSelectedTeacherId(teacherId);
                setSelectedTeacherName(teacherName);
              }}
            />
            <AdminSelector
              onSelect={(admin: Admin) => {
                setSelectedAdminId(admin.id);
              }}
            />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>المعلم</TableHead>
                    <TableHead>المقيّم</TableHead>
                    <TableHead>الحلقة</TableHead>
                    <TableHead>الدرجة الكلية</TableHead>
                    <TableHead>التخطيط</TableHead>
                    <TableHead>الكفاءة العلمية</TableHead>
                    <TableHead>الاستراتيجيات</TableHead>
                    <TableHead>الإدارة</TableHead>
                    <TableHead>التقييم</TableHead>
                    <TableHead>الجودة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-4">
                        جارِ التحميل...
                      </TableCell>
                    </TableRow>
                  ) : evaluations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-4">
                        لا يوجد تقييمات
                      </TableCell>
                    </TableRow>
                  ) : (
                    evaluations.map((evaluation) => (
                      <TableRow
                        key={evaluation.id}
                        className="hover:bg-gray-100 cursor-pointer"
                        onClick={() => setSelectedEvaluation(evaluation)}
                      >
                        <TableCell>{formatDate(evaluation.date)}</TableCell>
                        <TableCell>{evaluation.teacherName}</TableCell>
                        <TableCell>{evaluation.evaluatorName}</TableCell>
                        <TableCell>
                          {evaluation.cycle === "cycle3"
                            ? "الحلقة الثالثة"
                            : evaluation.cycle === "cycle2"
                            ? "الحلقة الثانية"
                            : evaluation.cycle === "cycle1"
                            ? "الحلقة الأولى"
                            : evaluation.cycle === "kg"
                            ? "رياض الأطفال"
                            : "غير معروف"}
                        </TableCell>
                        <TableCell className="font-bold">
                          {evaluation.evaluationScores.overallScore}
                        </TableCell>
                        <TableCell>{evaluation.evaluationScores.planningScore}</TableCell>
                        <TableCell>{evaluation.evaluationScores.scientificCompetencyScore}</TableCell>
                        <TableCell>{evaluation.evaluationScores.strategiesScore}</TableCell>
                        <TableCell>{evaluation.evaluationScores.managementScore}</TableCell>
                        <TableCell>{evaluation.evaluationScores.assessmentScore}</TableCell>
                        <TableCell>{evaluation.evaluationScores.qualityScore}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>      </main>

      {selectedEvaluation && (
        <EvaluationDocument
          evaluation={selectedEvaluation}
          onClose={() => setSelectedEvaluation(null)}
        />
      )}
    </div>
  );
}