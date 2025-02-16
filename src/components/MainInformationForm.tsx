"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface MainInformationFormData {
  schoolName: string;
  clusterManager: string;
  evaluatorJobTitle: string;
  schoolNumber: string;
  teacherName: string;
  oracle: string;
  gradeAndSection: string;
  period: string;
  subject: string;
  day: string;
  lesson: string;
  date: string;
  attendanceNumber: string;
  absentNumber: string;
  specialNeedsStudents: string;
}

interface MainInformationFormProps {
  name?: string;
  subject?: string;
  oracle?: string;
  onInfoChange?: (data: MainInformationFormData) => void;
}

export default function MainInformationForm({
  name = "",
  subject = "",
  oracle = "",
  onInfoChange,
}: MainInformationFormProps) {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<MainInformationFormData>({
    schoolName: "",
    clusterManager: "",
    evaluatorJobTitle: "",
    schoolNumber: "",
    teacherName: name,
    oracle: oracle,
    gradeAndSection: "",
    period: "",
    subject: subject,
    day: "",
    lesson: "",
    date: today, // Set default date to today
    attendanceNumber: "",
    absentNumber: "",
    specialNeedsStudents: "",
  });

  // Update form data when props change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      teacherName: name,
      oracle: oracle,
    }));
  }, [name, oracle]);

  // Notify parent of changes in a separate effect
  useEffect(() => {
    if (onInfoChange) {
      const timeoutId = setTimeout(() => {
        onInfoChange(formData);
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [formData, onInfoChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [inputName]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">البيانات الرئيسية</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="schoolName"
            placeholder="اسم المدرسة"
            value={formData.schoolName}
            onChange={handleInputChange}
          />
          <Input
            name="clusterManager"
            placeholder="مدير النطاق"
            value={formData.clusterManager}
            onChange={handleInputChange}
          />
          <Input
            name="evaluatorJobTitle"
            placeholder="المسمى الوظيفي للمقيّم"
            value={formData.evaluatorJobTitle}
            onChange={handleInputChange}
          />
          <Input
            name="schoolNumber"
            placeholder="رقم المدرسة"
            value={formData.schoolNumber}
            onChange={handleInputChange}
          />
          <Input
            name="teacherName"
            placeholder="اسم المعلم"
            value={formData.teacherName}
            readOnly
          />
          <Input
            name="oracle"
            placeholder="رقم الأوراكل"
            value={formData.oracle}
            readOnly
          />
          <Input
            name="gradeAndSection"
            placeholder="الصف والشعبة"
            value={formData.gradeAndSection}
            onChange={handleInputChange}
          />
          <Input
            name="period"
            placeholder="الحصه"
            value={formData.period}
            onChange={handleInputChange}
          />
          <Input
            name="subject"
            placeholder="مادة التدريس"
            value={formData.subject}
            onChange={handleInputChange}
          />
          <Input
            name="day"
            placeholder="اليوم"
            value={formData.day}
            onChange={handleInputChange}
          />
          <Input
            name="lesson"
            placeholder="عنوان الدرس"
            value={formData.lesson}
            onChange={handleInputChange}
          />
          <Input
            type="date" // Changed to date type
            name="date"
            placeholder="التاريخ"
            value={formData.date}
            onChange={handleInputChange}
            className="text-right" // Right align the text for better RTL support
          />
          <Input
            name="attendanceNumber"
            placeholder="عدد الحضور"
            value={formData.attendanceNumber}
            onChange={handleInputChange}
            type="number" // Added number type for attendance
          />
          <Input
            name="absentNumber"
            placeholder="عدد الغياب"
            value={formData.absentNumber}
            onChange={handleInputChange}
            type="number" // Added number type for absences
          />
          <Input
            name="specialNeedsStudents"
            placeholder="عدد الطلبة من أصحاب الهمم"
            value={formData.specialNeedsStudents}
            onChange={handleInputChange}
            type="number" // Added number type for special needs count
          />
        </div>
      </CardContent>
    </Card>
  );
}