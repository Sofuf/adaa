'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/authContext";
import { Calendar, School, User } from "lucide-react";

interface VisitRecord {
  id: string;
  teacherId?: string;
  evaluatorName?: string;
  date: Timestamp;
  type: "class" | "non-class";
  [key: string]: any;
}

// Field label mapping
const fieldLabels: Record<string, string> = {
  visitor1: "اسم الزائر",
  school: "المدرسة",
  date: "تاريخ الزيارة",
  purpose: "الغرض من الزيارة",
  notes: "ملاحظات",
  recommendations: "التوصيات",
  followUp: "المتابعة",
};

const VisitRecords = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const nonClassVisitsQuery = query(
      collection(db, "users", user.uid, "nonClassVisits"),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(
      nonClassVisitsQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const visitsList: VisitRecord[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          const visit: VisitRecord = {
            id: doc.id,
            ...data,
            date: data.date,
            type: "non-class",
          };
          visitsList.push(visit);
        });
        setVisits(visitsList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching visits:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const filteredVisits = visits.filter((visit) => {
    if (filter === "all") return true;
    return visit.type === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-pulse text-gray-600">جاري تحميل البيانات...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="text-gray-600">يرجى تسجيل الدخول لعرض سجل الزيارات</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">سجل الزيارات</h2>
      
      <div className="mb-8 flex justify-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
          dir="rtl"
        >
          <option value="all">جميع الزيارات</option>
          <option value="class">الزيارات الصفية</option>
          <option value="non-class">الزيارات غير الصفية</option>
        </select>
      </div>

      {visits.length === 0 ? (
        <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow-sm">
          لا توجد زيارات مسجلة
        </div>
      ) : filteredVisits.length === 0 ? (
        <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow-sm">
          لا توجد زيارات تطابق النوع المحدد
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVisits.map((visit) => (
            <Card key={visit.id} className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {visit.visitor1 || "زائر غير معروف"}
                  <span className="text-sm font-normal text-gray-600 mr-2">
                    ({visit.type === "class" ? "زيارة صفية" : "زيارة غير صفية"})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <School className="w-4 h-4" />
                  <span className="font-semibold">المدرسة:</span>
                  <span>{visit.school || "غير محدد"}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4" />
                  <span className="font-semibold">التاريخ:</span>
                  <span dir="ltr">
                    {visit.date?.toDate?.()?.toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="border-t pt-3 mt-3">
                  {Object.entries(visit)
                    .filter(([key]) => 
                      !["id", "school", "date", "type", "visitor1"].includes(key) && 
                      visit[key] !== undefined && 
                      visit[key] !== ""
                    )
                    .map(([key, value]) => (
                      <div key={key} className="mb-2">
                        <span className="font-semibold text-gray-700">
                          {fieldLabels[key] || key}:
                        </span>
                        <p className="mt-1 text-gray-600 whitespace-pre-wrap">
                          {String(value)}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VisitRecords;