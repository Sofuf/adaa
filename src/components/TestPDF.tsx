// TestPDF.tsx
'use client';
import React, { useState } from 'react';
import { generateAndSavePDF } from './PdfGenerator'; // Make sure the path matches your file structure

const PDFTestComponent: React.FC = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleGeneratePDF = async () => {
    const dummyData = {
      mainInformation: {
        schoolName: 'مدرسة النجاح',
        teacherName: 'أحمد محمد',
        subject: 'الرياضيات',
        date: '2025-02-14',
        oracle: '12345',
      },
      coreForm: {
        strengths: 'إدارة ممتازة للفصل',
        improvements: 'استخدام وسائل تعليمية أكثر',
        teacherFeedback: 'الدورة كانت مفيدة جدًا',
      },
      scores: {
        overallScore: 85,
        planningScore: 90,
        scientificCompetencyScore: 88,
        strategiesScore: 80,
        managementScore: 85,
        assessmentScore: 87,
        qualityScore: 89,
      },
      evaluatorName: 'محمد علي',
      teacherId: 'T12345',
      cycle: 'الفصل الدراسي الأول',
    };

    try {
      const url = await generateAndSavePDF(dummyData);
      setPdfUrl(url);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  return (
    <div>
      <button onClick={handleGeneratePDF}>Generate Test PDF</button>
      {pdfUrl && (
        <p>
          PDF Generated: <a href={pdfUrl} target="_blank" rel="noopener noreferrer">View PDF</a>
        </p>
      )}
    </div>
  );
};

export default PDFTestComponent;