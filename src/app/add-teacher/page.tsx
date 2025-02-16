'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import * as XLSX from 'xlsx';
import Sidebar from '@/components/Sidebar';
import { processExcelData } from '@/utils/excelParser';

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

const AddTeacher = () => {
  const router = useRouter();
  const [selectedCycle, setSelectedCycle] = useState<string>("");
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

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!selectedCycle) {
      alert('الرجاء اختيار الحلقة أولاً');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        // Process the Excel data using our parser
        const teachers = processExcelData(jsonData);
        
        // Process each teacher
        for (const teacher of teachers) {
          try {
            // Format the data to match your TeacherData interface
            const formattedTeacher = {
              arabicName: teacher.arabicName,
              englishName: teacher.englishName,
              oracle: teacher.oracle,
              jobTitle: teacher.jobTitle,
              qualification: teacher.qualification,
              grade: teacher.grade,
              nationality: teacher.nationality,
              maritalStatus: teacher.maritalStatus,
              experienceYears: teacher.experienceYears,
              birthDay: teacher.birthDate.day.toString(),
              birthMonth: teacher.birthDate.month.toString(),
              birthYear: teacher.birthDate.year.toString(),
              ministryDay: teacher.ministryDate.day.toString(),
              ministryMonth: teacher.ministryDate.month.toString(),
              ministryYear: teacher.ministryDate.year.toString(),
              idNumber: teacher.idNumber,
              email: teacher.email,
              phone: teacher.phone,
              emirate: teacher.emirate,
              residentialArea: teacher.residentialArea,
              notes: teacher.notes
            };

            // Add your API call here to save each teacher
            console.log('Processing teacher:', {
              cycle: selectedCycle,
              ...formattedTeacher
            });

            // You can add your API call here:
            // await saveTeacher({ cycle: selectedCycle, ...formattedTeacher });

          } catch (error) {
            console.error('Error processing teacher:', error);
            alert(`حدث خطأ في معالجة بيانات المعلم: ${teacher.arabicName}`);
          }
        }

        alert(`تم معالجة ${teachers.length} معلم بنجاح`);
        
      } catch (error) {
        console.error('Error processing Excel file:', error);
        alert('حدث خطأ في معالجة الملف');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCycle) {
      alert('الرجاء اختيار الحلقة أولاً');
      return;
    }

    try {
      // Add your API call here to save the teacher data
      console.log('Submitting teacher data:', {
        cycle: selectedCycle,
        ...teacherData
      });
      
      // Reset form after successful submission
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
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('حدث خطأ في حفظ البيانات');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Sidebar />
      <main className="mr-64 p-8">
        <h1 className="text-3xl font-bold mb-8">إضافة معلم</h1>

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
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">إضافة يدوية</TabsTrigger>
              <TabsTrigger value="excel">تحميل ملف إكسل</TabsTrigger>
            </TabsList>

            <TabsContent value="manual">
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
            </TabsContent>

            <TabsContent value="excel">
              <Card>
                <CardHeader>
                  <CardTitle>تحميل ملف إكسل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleExcelUpload}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-500">
                      <p>يرجى التأكد من أن الملف يحتوي على البيانات بالترتيب الصحيح</p>
                      <p>يجب أن تكون البيانات مرتبة كالتالي:</p>
                      <ul className="list-disc list-inside mt-2">
                        <li>العمود A: الرقم التسلسلي</li>
                        <li>العمود B: الاسم بالعربية</li>
                        <li>العمود C: الاسم بالإنجليزية</li>
                        <li>العمود D: رقم الأوراكل</li>
                        <li>العمود E: المسمى الوظيفي</li>
                        <li>العمود F: المؤهل العلمي</li>
                        <li>العمود G: الدرجة الوظيفية</li>
                        <li>العمود H: الجنسية</li>
                        <li>العمود I: الحالة الاجتماعية</li>
                        <li>العمود J: سنوات الخبرة</li>
                        <li>الأعمدة K, L, M: تاريخ الميلاد (يوم، شهر، سنة)</li>
                        <li>الأعمدة N, O, P: تاريخ التعيين (يوم، شهر، سنة)</li>
                        <li>العمود Q: رقم الهوية</li>
                        <li>العمود R: البريد الإلكتروني</li>
                        <li>العمود S: رقم الهاتف</li>
                        <li>العمود T: الإمارة</li>
                        <li>العمود U: منطقة السكن</li>
                        <li>العمود V: الملاحظات</li>
                      </ul>
                    </div>
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-yellow-700 font-medium">تنبيهات مهمة:</p>
                      <ul className="list-disc list-inside mt-2 text-yellow-600 text-sm">
                        <li>تأكد من أن الصف الأول فارغ</li>
                        <li>تأكد من عدم وجود أعمدة إضافية</li>
                        <li>تأكد من صحة تنسيق التواريخ (يوم، شهر، سنة في أعمدة منفصلة)</li>
                        <li>يجب أن يكون الاسم بالعربية موجوداً لكل معلم</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default AddTeacher;