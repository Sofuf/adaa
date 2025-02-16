// components/TeacherSelect.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useAuth } from "@/lib/authContext";

interface Teacher {
  id: string;
  arabicName: string;
}

interface TeacherSelectProps {
  selectedTeacher: string;
  setSelectedTeacher: (id: string) => void;
}

const TeacherSelect: React.FC<TeacherSelectProps> = ({ selectedTeacher, setSelectedTeacher }) => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchTeachers = async () => {
      try {
        const teachersCollection = collection(db, "users", user.uid, "teachers");
        const snapshot = await getDocs(teachersCollection);
        const teacherList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Teacher),
        }));
        setTeachers(teacherList);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchTeachers();
  }, [user]);

  return (
    <div className="mb-6">
      <Select value={selectedTeacher} onValueChange={(value) => setSelectedTeacher(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="اختر المعلم" />
        </SelectTrigger>
        <SelectContent>
          {teachers.map(teacher => (
            <SelectItem key={teacher.id} value={teacher.id}>
              {teacher.arabicName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TeacherSelect;
