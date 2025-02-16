'use client';

import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useAuth } from "@/lib/authContext";

export interface Admin {
  id: string;
  arabicName: string;
  jobTitle: string;
}

interface AdminSelectorProps {
  onSelect: (admin: Admin) => void;
}

const AdminSelector: React.FC<AdminSelectorProps> = ({ onSelect }) => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAdmins = async () => {
      if (!user) return;

      try {
        const adminsQuery = query(collection(db, "users", user.uid, "managers"));
        const snapshot = await getDocs(adminsQuery);
        
        const adminsList = snapshot.docs
          .map(doc => ({
            id: doc.id,
            arabicName: doc.data().arabicName,
            jobTitle: doc.data().jobTitle
          }))
          .filter(admin => 
            admin.jobTitle.includes('مدير') || admin.jobTitle.includes('مشرف')
          );

        setAdmins(adminsList);
      } catch (error) {
        console.error("Error fetching admins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [user]);

  const handleChange = (value: string) => {
    const selectedAdmin = admins.find(admin => admin.id === value);
    if (selectedAdmin) {
      onSelect(selectedAdmin);
    }
  };

  return (
    <div className="w-full">
      <Select
        onValueChange={handleChange}
        disabled={loading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="اختر المقيّم" />
        </SelectTrigger>
        <SelectContent>
          {admins.map((admin) => (
            <SelectItem key={admin.id} value={admin.id}>
              {admin.arabicName} - {admin.jobTitle}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AdminSelector;
