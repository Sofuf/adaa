'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Sidebar from '@/components/Sidebar';
import { processExcelData } from '@/utils/excelParser';
import { useAuth } from "@/lib/authContext";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Define types for Excel data
type ExcelRow = (string | number | null)[];
type ExcelData = ExcelRow[];

const AddManagerExcel = () => {
  const { user } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user) {
      alert("يجب تسجيل الدخول أولاً");
      return;
    }

    if (!selectedDepartment) {
      alert('الرجاء اختيار القسم أولاً');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as ExcelData;

        // Process the Excel data using our parser
        const managers = processExcelData(jsonData);

        // Process each manager from the Excel file
        for (const manager of managers) {
          try {
            const formattedManager = {
              arabicName: manager.arabicName,
              englishName: manager.englishName,
              oracle: manager.oracle,
              jobTitle: manager.jobTitle,
              qualification: manager.qualification,
              grade: manager.grade,
              nationality: manager.nationality,
              maritalStatus: manager.maritalStatus,
              experienceYears: manager.experienceYears,
              birthDay: manager.birthDate.day.toString(),
              birthMonth: manager.birthDate.month.toString(),
              birthYear: manager.birthDate.year.toString(),
              ministryDay: manager.ministryDate.day.toString(),
              ministryMonth: manager.ministryDate.month.toString(),
              ministryYear: manager.ministryDate.year.toString(),
              idNumber: manager.idNumber,
              email: manager.email,
              phone: manager.phone,
              emirate: manager.emirate,
              residentialArea: manager.residentialArea,
              notes: manager.notes,
              department: selectedDepartment,
              responsibilities: [], // Initialize empty responsibilities array
              createdAt: serverTimestamp()
            };

            // Save manager data to Firestore under the logged-in user's managers subcollection
            await addDoc(collection(db, "users", user.uid, "managers"), formattedManager);

          } catch (error) {
            console.error('Error processing manager:', error);
            alert(`حدث خطأ في معالجة بيانات المدير: ${manager.arabicName}`);
          }
        }

        alert(`تم معالجة ${managers.length} مدير بنجاح`);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        alert('حدث خطأ في معالجة الملف');
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Sidebar />
      <main className="mr-64 p-8">
        <h1 className="text-3xl font-bold mb-8">إضافة مدير - تحميل ملف إكسل</h1>
        
        {/* Department Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>اختر القسم</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر القسم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">القسم الأكاديمي</SelectItem>
                <SelectItem value="administrative">القسم الإداري</SelectItem>
                <SelectItem value="finance">القسم المالي</SelectItem>
                <SelectItem value="student-affairs">شؤون الطلاب</SelectItem>
                <SelectItem value="it">تكنولوجيا المعلومات</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedDepartment && (
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
                    <li>يجب أن يكون الاسم بالعربية موجوداً لكل مدير</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AddManagerExcel;