'use client'
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import Sidebar from "@/components/Sidebar";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SchoolData {
  schoolName: string;
  principalName: string;
  principalPhone: string;
  email: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null);

  useEffect(() => {
    const fetchSchoolData = async () => {
      if (!user) return;
      
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setSchoolData(docSnap.data() as SchoolData);
        }
      } catch (error) {
        console.error("Error fetching school data:", error);
      }
    };

    fetchSchoolData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Sidebar />
      <main className="transition-all duration-300 md:mr-64 p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1>
        
        {schoolData && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>معلومات المدرسة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="font-semibold">اسم المدرسة:</label>
                  <p className="text-gray-600">{schoolData.schoolName}</p>
                </div>
                <div>
                  <label className="font-semibold">البريد الإلكتروني:</label>
                  <p className="text-gray-600">{schoolData.email}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>معلومات المدير</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="font-semibold">اسم المدير:</label>
                  <p className="text-gray-600">{schoolData.principalName}</p>
                </div>
                <div>
                  <label className="font-semibold">رقم الهاتف:</label>
                  <p className="text-gray-600">{schoolData.principalPhone}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;