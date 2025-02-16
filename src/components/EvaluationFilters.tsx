"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Teacher {
  id: string;
  name: string;
}

interface EvaluationFiltersProps {
  selectedCycle: string;
  setSelectedCycle: (value: string) => void;
  selectedTeacher: string;
  setSelectedTeacher: (value: string) => void;
  teachers: Teacher[];
  selectedEvaluator: string;
  setSelectedEvaluator: (value: string) => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
}

export default function EvaluationFilters({
  selectedCycle,
  setSelectedCycle,
  selectedTeacher,
  setSelectedTeacher,
  teachers,
  selectedEvaluator,
  setSelectedEvaluator,
  selectedDate,
  setSelectedDate,
}: EvaluationFiltersProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>الفلترة</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Cycle Filter */}
        <div>
          <Select value={selectedCycle} onValueChange={setSelectedCycle}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر الحلقة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحلقات</SelectItem>
              <SelectItem value="cycle3">الحلقة الثالثة</SelectItem>
              <SelectItem value="cycle2">الحلقة الثانية</SelectItem>
              <SelectItem value="cycle1">الحلقة الأولى</SelectItem>
              <SelectItem value="kg">رياض الأطفال</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Teacher Filter */}
        <div>
          <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر المعلم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المعلمين</SelectItem>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Evaluator Filter */}
        <div>
          <input
            type="text"
            value={selectedEvaluator}
            onChange={(e) => setSelectedEvaluator(e.target.value)}
            placeholder="ابحث بالمقيّم"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        {/* Date Filter */}
        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </CardContent>
    </Card>
  );
}
