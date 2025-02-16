type ExcelCellValue = string | number | null;

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

export const processExcelData = (data: ExcelCellValue[][]): ExcelTeacher[] => {
  // Skip first row (empty) and start from index 1
  return data.slice(1).map(row => {
    // Ensure we're reading from the correct columns
    return {
      arabicName: String(row[1] || ''), // Column B
      englishName: String(row[2] || ''), // Column C
      oracle: String(row[3] || ''), // Column D
      jobTitle: String(row[4] || ''), // Column E
      qualification: String(row[5] || ''), // Column F
      grade: String(row[6] || ''), // Column G
      nationality: String(row[7] || ''), // Column H
      maritalStatus: String(row[8] || ''), // Column I
      experienceYears: String(row[9] || ''), // Column J
      birthDate: {
        day: parseInt(String(row[10])) || 0, // Column K
        month: parseInt(String(row[11])) || 0, // Column L
        year: parseInt(String(row[12])) || 0, // Column M
      },
      ministryDate: {
        day: parseInt(String(row[13])) || 0, // Column N
        month: parseInt(String(row[14])) || 0, // Column O
        year: parseInt(String(row[15])) || 0, // Column P
      },
      idNumber: String(row[16] || ''), // Column Q
      email: String(row[17] || ''), // Column R
      phone: String(row[18] || ''), // Column S
      emirate: String(row[19] || ''), // Column T
      residentialArea: String(row[20] || ''), // Column U
      notes: String(row[21] || ''), // Column V
    };
  }).filter(teacher => teacher.arabicName); // Filter out empty rows
};