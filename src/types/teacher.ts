// types/teacher.ts
export interface TeacherData {
    arabicName: string;
    englishName: string;
    oracle: string;
    jobTitle: string;
    qualification: string;
    grade: string;
    nationality: string;
    maritalStatus: string;
    experienceYears: string;
    birthDay: string;
    birthMonth: string;
    birthYear: string;
    ministryDay: string;
    ministryMonth: string;
    ministryYear: string;
    idNumber: string;
    email: string;
    phone: string;
    emirate: string;
    residentialArea: string;
    notes: string;
  }
  
  export interface Teacher extends TeacherData {
    id: string;
    cycle: string;
    schoolId: string;
    createdAt: Date;
    evaluations: Evaluation[];
  }
  
  export interface Evaluation {
    id: string;
    date: Date;
    evaluator: string;
    score: number;
    comments: string;
    // Add more evaluation fields as needed
  }