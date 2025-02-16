'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminSelector, { Admin } from '@/components/AdminSelector';
import TeacherSelector from '@/components/TeacherSelector';
import Sidebar from '@/components/Sidebar';
import { useAuth } from "@/lib/authContext";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import SpecialAimClassEvaluationForm, { SpecialAimClassEvaluationData } from '@/components/SpecialAimClassEvaluationForm';

const AddSpecialAimEvaluation = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState<SpecialAimClassEvaluationData | null>(null);

  const handleFormDataChange = (data: SpecialAimClassEvaluationData) => {
    setFormData(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedTeacher || !selectedAdmin || !formData) {
      alert('الرجاء تعبئة جميع البيانات المطلوبة');
      return;
    }

    try {
      const visitData = {
        type: 'special-aim-class',
        teacherId: selectedTeacher,
        evaluatorName: selectedAdmin.arabicName,
        ...formData,
        date: serverTimestamp(),
      };

      await addDoc(
        collection(db, "users", user.uid, "teachers", selectedTeacher, "visits"),
        visitData
      );

      alert('تم حفظ الزيارة بنجاح');
      router.push('/evaluations');
    } catch (error) {
      console.error('Error saving visit data:', error);
      alert('حدث خطأ في حفظ الزيارة');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Sidebar />
      <main className="p-4 md:p-8 transition-all duration-300 md:mr-64">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">
          إضافة تقييم زيارة صفية ذات هدف
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
          {/* Admin Selection */}
          <Card className="shadow-sm">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">اختر المقيّم</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <AdminSelector onSelect={setSelectedAdmin} />
            </CardContent>
          </Card>

          {/* Teacher Selection */}
          <Card className="shadow-sm">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">اختر المعلم</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <TeacherSelector 
                onSelectTeacher={(teacherId, cycle) => {
                  setSelectedTeacher(teacherId);
                  // Optionally, you can also handle the cycle if needed
                }} 
              />
            </CardContent>
          </Card>

          {/* Special Aim Class Evaluation Form */}
          <div className="bg-white rounded-lg shadow-sm">
            <SpecialAimClassEvaluationForm onFormDataChange={handleFormDataChange} />
          </div>

          <Button 
            type="submit" 
            className="w-full md:w-auto md:min-w-[200px] md:mx-auto block"
          >
            حفظ الزيارة
          </Button>
        </form>
      </main>
    </div>
  );
};

export default AddSpecialAimEvaluation;
