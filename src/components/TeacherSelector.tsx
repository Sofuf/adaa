// TeacherSelector.tsx
'use client';

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useAuth } from "@/lib/authContext";
import { Card, CardContent } from "@/components/ui/card";

interface Teacher {
  id: string;
  arabicName: string;
  cycle: string;
}

interface TeacherSelectorProps {
  onSelectTeacher: (teacherId: string, cycle: string) => void;
}

const TeacherSelector = ({ onSelectTeacher }: TeacherSelectorProps) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCycle, setSelectedCycle] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchTeachers = async () => {
      if (!user || !selectedCycle) return;

      try {
        const teachersQuery = query(
          collection(db, "users", user.uid, "teachers"),
          where("cycle", "==", selectedCycle)
        );
        
        const snapshot = await getDocs(teachersQuery);
        const teachersList = snapshot.docs.map(doc => ({
          id: doc.id,
          arabicName: doc.data().arabicName,
          cycle: doc.data().cycle
        }));

        setTeachers(teachersList);
        setFilteredTeachers(teachersList);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCycle) {
      fetchTeachers();
    }
  }, [user, selectedCycle]);

  useEffect(() => {
    setFilteredTeachers(
      teachers.filter(teacher =>
        teacher.arabicName.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, teachers]);

  const handleTeacherSelect = (teacherId: string) => {
    onSelectTeacher(teacherId, selectedCycle);
  };

  return (
    <div className="space-y-4">
      {/* Cycle Selection */}
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

      {/* Teacher Selection */}
      <Select onValueChange={handleTeacherSelect} disabled={loading || !selectedCycle}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="اختر المعلم" />
        </SelectTrigger>
        <SelectContent>
          <div className="p-2">
            <Input
              type="text"
              placeholder="بحث..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {filteredTeachers.map((teacher) => (
            <SelectItem key={teacher.id} value={teacher.id}>
              {teacher.arabicName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TeacherSelector;