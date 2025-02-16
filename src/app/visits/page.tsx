'use client';

import { useEffect, useState } from 'react';
import {
  collectionGroup,
  query,
  orderBy,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Define the interface for a visit record
interface VisitRecord {
  id: string;
  teacherId: string;
  evaluatorName: string;
  date: Timestamp;
  // For additional dynamic fields, we'll use a more specific type
  [key: string]: string | Timestamp;
}

const VisitRecords = () => {
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query all documents from any "visits" subcollection, ordered by date descending
    const visitsQuery = query(
      collectionGroup(db, "visits"),
      orderBy("date", "desc")
    );

    // Listen to real-time updates
    const unsubscribe = onSnapshot(
      visitsQuery,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const visitsList: VisitRecord[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Ensure we're creating a properly typed VisitRecord
          const visit: VisitRecord = {
            id: doc.id,
            teacherId: data.teacherId,
            evaluatorName: data.evaluatorName,
            date: data.date,
            ...Object.entries(data)
              .filter(([key]) => !['teacherId', 'evaluatorName', 'date'].includes(key))
              .reduce((acc, [key, value]) => ({
                ...acc,
                [key]: value as string | Timestamp
              }), {})
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
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p>Loading visits...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">سجل الزيارات</h2>
      {visits.length === 0 ? (
        <p className="text-center">لا توجد زيارات مسجلة.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visits.map((visit) => (
            <Card key={visit.id} className="shadow-sm">
              <CardHeader className="p-4 bg-gray-100">
                <CardTitle className="text-lg font-semibold">
                  {visit.evaluatorName}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p>
                  <strong>المعلم:</strong> {visit.teacherId}
                </p>
                <p>
                  <strong>التاريخ:</strong>{" "}
                  {visit.date.toDate().toLocaleString()}
                </p>
                {/* Render additional fields */}
                {Object.entries(visit)
                  .filter(([key]) => 
                    !["id", "teacherId", "evaluatorName", "date", "type"].includes(key)
                  )
                  .map(([key, value]) => (
                    <p key={key}>
                      <strong>{key}:</strong> {String(value)}
                    </p>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VisitRecords;