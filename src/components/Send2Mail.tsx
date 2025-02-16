import React from "react";

interface Send2EmailProps {
  pdfURL: string;
  cycle: string;
  schoolName: string;
}

const Send2Email: React.FC<Send2EmailProps> = ({ pdfURL, cycle, schoolName }) => {
  // Define the email subject
  const subject = "تقرير التغذية الراجعة / Feedback Report";

  // Build the email body with the provided pdfURL, cycle, and schoolName
  const body = `
السلام عليكم،

أسعد الله أوقاتكم بكل خير، مُرفق إليكم تقرير التغذية الراجعة للحصة التي تمت مشاهدتها مؤخرًا. نأمل أن تجدوا التقرير مفيدًا في تسليط الضوء على نقاط القوة والمجالات التي بحاجة إلى تحسين، وذلك لتحقيق أفضل أداء في المستقبل.

يرجى الاطلاع على التقرير وعدم التردد بإرسال أية ملاحظات أو استفسارات لديكم بشأنه. إن تعاونكم يساعد بالارتقاء بمستوى الأداء الأكاديمي وتقديم بيئة تعليمية متميزة. 
${pdfURL}
شاكرين لكم حسن تعاونكم، ونسأل الله تعالى لكم دوام التوافيق والنجاح.
مع كامل الاحترام والتقدير،
إدارة ${cycle} – ${schoolName}

Greetings, 
Attached is the feedback report for the session that was recently observed. We hope you find the report useful in highlighting the strengths and areas that need improvement, to achieve the best performance in the future.
Please review the report and do not hesitate to send any comments or inquiries you may have regarding it. Your cooperation greatly contributes to enhancing academic performance and providing an exceptional learning environment.
${pdfURL}

We wish you ongoing success and prosperity.
Sincerely,
${schoolName} Administration.
  `;

  // Encode the subject and body for the mailto URL
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const mailtoLink = `mailto:?subject=${encodedSubject}&body=${encodedBody}`;

  return (
    <a href={mailtoLink}>
      <button className="btn btn-primary">
        Send Report via Email
      </button>
    </a>
  );
};

export default Send2Email;
