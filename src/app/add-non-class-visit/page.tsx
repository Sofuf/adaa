// add-non-class-visit/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from '@/components/Sidebar';
import { useAuth } from "@/lib/authContext";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AddNonClassVisit = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    visitNumber: '',
    date: '',
    clusterManager: '',
    school: '',
    schoolNo: '',
    targetedByVisit: '',
    teachingSubject: '',
    noOfAttendees: '',
    absentees: '',
    visitor1: '',
    visitor2: '',
    namesOfAttendees: ['', '', ''],
    visitAims: {
      continuousAssessment: false,
      curriculumFollowUp: false,
    },
    notes: '',
    recommendations: '',
    followUpParty: '',
    expectedFollowUpDate: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // For checkboxes related to visitAims:
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        visitAims: { ...prev.visitAims, [name]: checked },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('يجب تسجيل الدخول لحفظ البيانات');
      return;
    }

    try {
      const visitData = {
        ...formData,
        date: serverTimestamp(),
      };
      
      await addDoc(collection(db, "users", user.uid, "nonClassVisits"), visitData);
      alert('تم حفظ الزيارة بنجاح');
      router.push('/visits');
    } catch (error) {
      console.error('Error saving visit:', error);
      alert('حدث خطأ أثناء حفظ البيانات');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Sidebar />
      <main className="p-4 md:p-8 transition-all duration-300 md:mr-64">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">إضافة زيارة ذات هدف لاصفي</h1>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
          {/* تفاصيل الزيارة الأساسية */}
          <Card className="shadow-sm">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">تفاصيل الزيارة</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-4">
              <label>زيارة ذات هدف لاصفي رقم:</label>
              <input 
                type="number" 
                name="visitNumber" 
                value={formData.visitNumber} 
                onChange={handleChange} 
                className="border p-2 w-full" 
              />

              <label>اليوم والتاريخ:</label>
              <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleChange} 
                className="border p-2 w-full" 
              />

              <label>مدير النطاق:</label>
              <input 
                type="text" 
                name="clusterManager" 
                value={formData.clusterManager} 
                onChange={handleChange} 
                className="border p-2 w-full" 
              />

              <label>المدرسة:</label>
              <input 
                type="text" 
                name="school" 
                value={formData.school} 
                onChange={handleChange} 
                className="border p-2 w-full" 
              />

              <label>رقم المدرسة:</label>
              <input 
                type="text" 
                name="schoolNo" 
                value={formData.schoolNo} 
                onChange={handleChange} 
                className="border p-2 w-full" 
              />

              <label>التاريخ المتوقع لمتابعة التوصيات:</label>
              <input 
                type="date" 
                name="expectedFollowUpDate" 
                value={formData.expectedFollowUpDate} 
                onChange={handleChange} 
                className="border p-2 w-full" 
              />
            </CardContent>
          </Card>

          {/* بيانات الحضور والزوار */}
          <Card className="shadow-sm">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">تفاصيل الحضور والزوار</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-4">
              <label>المستهدفون بالزيارة:</label>
              <input 
                type="text" 
                name="targetedByVisit" 
                value={formData.targetedByVisit} 
                onChange={handleChange} 
                className="border p-2 w-full" 
              />

              <label>مادة / مواد التدريس:</label>
              <input 
                type="text" 
                name="teachingSubject" 
                value={formData.teachingSubject} 
                onChange={handleChange} 
                className="border p-2 w-full" 
              />

              <label>عدد الحضور:</label>
              <input 
                type="number" 
                name="noOfAttendees" 
                value={formData.noOfAttendees} 
                onChange={handleChange} 
                className="border p-2 w-full" 
              />

              <label>عدد المتغيبين:</label>
              <input 
                type="number" 
                name="absentees" 
                value={formData.absentees} 
                onChange={handleChange} 
                className="border p-2 w-full" 
              />

              <label>اسم الزائر 1:</label>
              <input 
                type="text" 
                name="visitor1" 
                value={formData.visitor1} 
                onChange={handleChange} 
                className="border p-2 w-full" 
              />

              <label>اسم الزائر 2:</label>
              <input 
                type="text" 
                name="visitor2" 
                value={formData.visitor2} 
                onChange={handleChange} 
                className="border p-2 w-full" 
              />

              <label>أسماء الحضور:</label>
              {formData.namesOfAttendees.map((name, index) => (
                <input
                  key={index}
                  type="text"
                  name={`namesOfAttendees-${index}`}
                  value={name}
                  onChange={(e) => {
                    const updatedNames = [...formData.namesOfAttendees];
                    updatedNames[index] = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      namesOfAttendees: updatedNames,
                    }));
                  }}
                  className="border p-2 w-full mb-2"
                  placeholder={`اسم الحاضر ${index + 1}`}
                />
              ))}
            </CardContent>
          </Card>

          {/* أهداف الزيارة، الملحوظات والتوصيات */}
          <Card className="shadow-sm">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">أهداف الزيارة، الملحوظات والتوصيات</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-4">
              <label>أهداف الزيارة:</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-1">
                  <input 
                    type="checkbox" 
                    name="continuousAssessment" 
                    checked={formData.visitAims.continuousAssessment} 
                    onChange={handleChange} 
                    className="form-checkbox"
                  />
                  <span>التقويم المستمر</span>
                </label>
                <label className="flex items-center space-x-1">
                  <input 
                    type="checkbox" 
                    name="curriculumFollowUp" 
                    checked={formData.visitAims.curriculumFollowUp} 
                    onChange={handleChange} 
                    className="form-checkbox"
                  />
                  <span>متابعة المنهج</span>
                </label>
              </div>

              <label>الملحوظات:</label>
              <textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange} 
                className="border p-2 w-full"
              />

              <label>التوصيات:</label>
              <textarea 
                name="recommendations" 
                value={formData.recommendations} 
                onChange={handleChange} 
                className="border p-2 w-full"
              />

              <label>جهة المتابعة:</label>
              <input 
                type="text" 
                name="followUpParty" 
                value={formData.followUpParty} 
                onChange={handleChange} 
                className="border p-2 w-full"
              />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full md:w-auto md:min-w-[200px] md:mx-auto block">
            حفظ الزيارة
          </Button>
        </form>
      </main>
    </div>
  );
};

export default AddNonClassVisit;
