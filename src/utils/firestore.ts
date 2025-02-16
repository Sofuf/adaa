// utils/firestore.ts
import { db } from '@/lib/firebaseConfig';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { TeacherData } from '@/types/teacher'; // We'll create this type file next

interface SaveTeacherParams extends TeacherData {
  cycle: string;
  schoolId: string; // This will be the user's school ID
}

export const saveTeacher = async (teacherData: SaveTeacherParams) => {
  try {
    // Create a new teacher document
    const teacherRef = await addDoc(collection(db, 'teachers'), {
      ...teacherData,
      createdAt: new Date(),
      evaluations: [], // Initialize empty evaluations array
    });

    return teacherRef.id;
  } catch (error) {
    console.error('Error saving teacher:', error);
    throw error;
  }
};

export const getTeachersBySchool = async (schoolId: string) => {
  try {
    const teachersRef = collection(db, 'teachers');
    const q = query(teachersRef, where('schoolId', '==', schoolId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting teachers:', error);
    throw error;
  }
};