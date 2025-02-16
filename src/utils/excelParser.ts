// utils/excelParser.ts
interface ExcelTeacher {
    arabicName: string;
    englishName: string;
    oracle: string;
    jobTitle: string;
    qualification: string;
    grade: string;
    nationality: string;
    maritalStatus: string;
    experienceYears: string;
    birthDate: {
      day: number;
      month: number;
      year: number;
    };
    ministryDate: {
      day: number;
      month: number;
      year: number;
    };
    idNumber: string;
    email: string;
    phone: string;
    emirate: string;
    residentialArea: string;
    notes: string;
  }
  
  export const parseExcelDate = (day: number, month: number, year: number): string => {
    // Pad single digits with leading zero
    const paddedDay = day.toString().padStart(2, '0');
    const paddedMonth = month.toString().padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`;
  };
  
  export const processExcelData = (data: any[][]): ExcelTeacher[] => {
    // Skip first row (empty) and start from index 1
    return data.slice(1).map(row => {
      // Ensure we're reading from the correct columns
      return {
        arabicName: row[1] || '', // Column B
        englishName: row[2] || '', // Column C
        oracle: row[3] || '', // Column D
        jobTitle: row[4] || '', // Column E
        qualification: row[5] || '', // Column F
        grade: row[6] || '', // Column G
        nationality: row[7] || '', // Column H
        maritalStatus: row[8] || '', // Column I
        experienceYears: row[9] || '', // Column J
        birthDate: {
          day: parseInt(row[10]) || 0, // Column K
          month: parseInt(row[11]) || 0, // Column L
          year: parseInt(row[12]) || 0, // Column M
        },
        ministryDate: {
          day: parseInt(row[13]) || 0, // Column N
          month: parseInt(row[14]) || 0, // Column O
          year: parseInt(row[15]) || 0, // Column P
        },
        idNumber: row[16] || '', // Column Q
        email: row[17] || '', // Column R
        phone: row[18] || '', // Column S
        emirate: row[19] || '', // Column T
        residentialArea: row[20] || '', // Column U
        notes: row[21] || '', // Column V
      };
    }).filter(teacher => teacher.arabicName); // Filter out empty rows
  };