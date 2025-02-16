'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Sidebar from '@/components/Sidebar';
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/authContext";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface TeacherData {
  arabicName: string;
  englishName: string;
  oracle: string;
  jobTitle: string;
  qualification: string;
  grade: string;
  nationality: string;
  maritalStatus: string;
  experienceYears: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  ministryDay: string;
  ministryMonth: string;
  ministryYear: string;
  idNumber: string;
  email: string;
  phone: string;
  emirate: string;
  residentialArea: string;
  notes: string;
}

const AddTeacherManual = () => {
  const { user } = useAuth();
  const [selectedCycle, setSelectedCycle] = useState<string>('');
  const [teacherData, setTeacherData] = useState<TeacherData>({
    arabicName: '',
    englishName: '',
    oracle: '',
    jobTitle: '',
    qualification: '',
    grade: '',
    nationality: '',
    maritalStatus: '',
    experienceYears: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    ministryDay: '',
    ministryMonth: '',
    ministryYear: '',
    idNumber: '',
    email: '',
    phone: '',
    emirate: '',
    residentialArea: '',
    notes: ''
  });

  const handleInputChange = (field: keyof TeacherData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTeacherData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!selectedCycle) {
      alert('الرجاء اختيار الحلقة أولاً');
      return;
    }

    try {
      // Save teacher data to Firestore under the user's "teachers" subcollection
      await addDoc(collection(db, "users", user.uid, "teachers"), {
        ...teacherData,
        cycle: selectedCycle,
        createdAt: serverTimestamp()
      });
      
      // Reset the form after successful submission
      setTeacherData({
        arabicName: '',
        englishName: '',
        oracle: '',
        jobTitle: '',
        qualification: '',
        grade: '',
        nationality: '',
        maritalStatus: '',
        experienceYears: '',
        birthDay: '',
        birthMonth: '',
        birthYear: '',
        ministryDay: '',
        ministryMonth: '',
        ministryYear: '',
        idNumber: '',
        email: '',
        phone: '',
        emirate: '',
        residentialArea: '',
        notes: ''
      });
      
      alert('تم إضافة المعلم بنجاح');
    } catch (error) {
      console.error('Error saving teacher data:', error);
      alert('حدث خطأ في حفظ البيانات');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Sidebar />
      <main className="mr-64 p-8">
        <h1 className="text-3xl font-bold mb-8">إضافة معلم - الإضافة اليدوية</h1>
        
        {/* Cycle Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>اختر الحلقة</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCycle} onValueChange={setSelectedCycle}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر الحلقة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cycle3">الحلقة الثالثة</SelectItem>
                <SelectItem value="cycle2">الحلقة الثانية</SelectItem>
                <SelectItem value="cycle1">الحلقة الأولى</SelectItem>
                <SelectItem value="kg">رياض الأطفال</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedCycle && (
          <Card>
            <CardHeader>
              <CardTitle>إضافة معلم يدوياً</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="الاسم بالعربية"
                    value={teacherData.arabicName}
                    onChange={handleInputChange('arabicName')}
                  />
                  <Input
                    placeholder="الاسم بالإنجليزية"
                    value={teacherData.englishName}
                    onChange={handleInputChange('englishName')}
                  />
                  <Input
                    placeholder="الأوراكل"
                    value={teacherData.oracle}
                    onChange={handleInputChange('oracle')}
                  />
                  <Input
                    placeholder="المسمى الوظيفي"
                    value={teacherData.jobTitle}
                    onChange={handleInputChange('jobTitle')}
                  />
                  <Input
                    placeholder="المؤهل العلمي والتخصص"
                    value={teacherData.qualification}
                    onChange={handleInputChange('qualification')}
                  />
                  <Input
                    placeholder="الدرجة الوظيفية"
                    value={teacherData.grade}
                    onChange={handleInputChange('grade')}
                  />
                  <Input
                    placeholder="الجنسية"
                    value={teacherData.nationality}
                    onChange={handleInputChange('nationality')}
                  />
                  <Input
                    placeholder="الحالة الاجتماعية"
                    value={teacherData.maritalStatus}
                    onChange={handleInputChange('maritalStatus')}
                  />
                  <Input
                    placeholder="سنوات الخبرة"
                    value={teacherData.experienceYears}
                    onChange={handleInputChange('experienceYears')}
                  />
                  
                  {/* Birth Date Fields */}
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="يوم الميلاد"
                      value={teacherData.birthDay}
                      onChange={handleInputChange('birthDay')}
                    />
                    <Input
                      placeholder="شهر الميلاد"
                      value={teacherData.birthMonth}
                      onChange={handleInputChange('birthMonth')}
                    />
                    <Input
                      placeholder="سنة الميلاد"
                      value={teacherData.birthYear}
                      onChange={handleInputChange('birthYear')}
                    />
                  </div>

                  {/* Ministry Date Fields */}
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="يوم التعيين"
                      value={teacherData.ministryDay}
                      onChange={handleInputChange('ministryDay')}
                    />
                    <Input
                      placeholder="شهر التعيين"
                      value={teacherData.ministryMonth}
                      onChange={handleInputChange('ministryMonth')}
                    />
                    <Input
                      placeholder="سنة التعيين"
                      value={teacherData.ministryYear}
                      onChange={handleInputChange('ministryYear')}
                    />
                  </div>

                  <Input
                    placeholder="رقم الهوية"
                    value={teacherData.idNumber}
                    onChange={handleInputChange('idNumber')}
                  />
                  <Input
                    type="email"
                    placeholder="البريد الالكتروني"
                    value={teacherData.email}
                    onChange={handleInputChange('email')}
                  />
                  <Input
                    placeholder="رقم الهاتف"
                    value={teacherData.phone}
                    onChange={handleInputChange('phone')}
                  />
                  <Input
                    placeholder="الامارة"
                    value={teacherData.emirate}
                    onChange={handleInputChange('emirate')}
                  />
                  <Input
                    placeholder="منطقة السكن"
                    value={teacherData.residentialArea}
                    onChange={handleInputChange('residentialArea')}
                  />
                  <Textarea
                    placeholder="ملاحظات"
                    value={teacherData.notes}
                    onChange={handleInputChange('notes')}
                    className="col-span-2"
                  />
                </div>
                <Button type="submit" className="w-full">إضافة المعلم</Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AddTeacherManual;
