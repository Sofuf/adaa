"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import EvaluationSection from "./EvaluationSection"

interface EvaluationFormProps {
  onScoresUpdate?: (scores: {
    planningScore: number;
    scientificCompetencyScore: number;
    strategiesScore: number;
    managementScore: number;
    assessmentScore: number;
    qualityScore: number;
    overallScore: number;
  }) => void;
}

export default function EvaluationForm({ onScoresUpdate }: EvaluationFormProps) {
  const [formData, setFormData] = useState({
    planning: Array(5).fill(""),
    scientificCompetency: Array(5).fill(""),
    strategies: Array(5).fill(""),
    management: Array(5).fill(""),
    assessment: Array(5).fill(""),
    quality: Array(5).fill(""),
  })

  const [scores, setScores] = useState({
    planningScore: 0,
    scientificCompetencyScore: 0,
    strategiesScore: 0,
    managementScore: 0,
    assessmentScore: 0,
    qualityScore: 0,
    overallScore: 0,
  })

  useEffect(() => {
    if (onScoresUpdate) {
      onScoresUpdate(scores);
    }
  }, [scores, onScoresUpdate]);

  const calculateSectionScore = (sectionData: string[]) => {
    const filledValues = sectionData.map(Number).filter((num) => !isNaN(num))
    return filledValues.length > 0 ? filledValues.reduce((a, b) => a + b, 0) : 0
  }

  const handleInputChange = (section: string, index: number, value: string) => {
    setFormData((prev) => {
      const updatedSection = [...prev[section as keyof typeof formData]]
      updatedSection[index] = value

      const newFormData = { ...prev, [section]: updatedSection }

      const newScores = {
        planningScore: calculateSectionScore(newFormData.planning),
        scientificCompetencyScore: calculateSectionScore(newFormData.scientificCompetency),
        strategiesScore: calculateSectionScore(newFormData.strategies),
        managementScore: calculateSectionScore(newFormData.management),
        assessmentScore: calculateSectionScore(newFormData.assessment),
        qualityScore: calculateSectionScore(newFormData.quality),
        overallScore: 0,
      }

      newScores.overallScore =
        newScores.planningScore +
        newScores.scientificCompetencyScore +
        newScores.strategiesScore +
        newScores.managementScore +
        newScores.assessmentScore +
        newScores.qualityScore

      setScores(newScores)
      return newFormData
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">نموذج التقييم</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <EvaluationSection
            title="التخطيط"
            criteria={["وضوح الأهداف", "ملاءمة الخطة", "تنظيم الوقت", "تنويع الاستراتيجيات", "وضوح المهام"]}
            section="planning"
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <EvaluationSection
            title="الكفاءة العلمية"
            criteria={["القدرة على الشرح", "الإلمام بالمادة", "ربط الدروس", "تنويع الوسائل", "استخدام التقنيات"]}
            section="scientificCompetency"
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <EvaluationSection
            title="الاستراتيجيات"
            criteria={[
              "التفاعل مع الطلاب",
              "تحفيز الطلاب",
              "طرح أسئلة متنوعة",
              "تشجيع التفكير النقدي",
              "استخدام أمثلة حقيقية",
            ]}
            section="strategies"
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <EvaluationSection
            title="الإدارة"
            criteria={["إدارة الوقت", "التعامل مع الطلاب", "تحفيز البيئة الصفية", "حسن التصرف", "التواصل الفعّال"]}
            section="management"
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <EvaluationSection
            title="التقييم"
            criteria={[
              "تنوع طرق التقييم",
              "إعطاء تغذية راجعة",
              "قياس الفهم",
              "العدالة في التقييم",
              "وضوح معايير التقييم",
            ]}
            section="assessment"
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <EvaluationSection
            title="الجودة"
            criteria={["تنوع المصادر", "التفاعل مع الطلاب", "التطوير المستمر", "التعلم التعاوني", "الإبداع في التدريس"]}
            section="quality"
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>

        <Separator className="my-4" />
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="font-semibold">التخطيط</p>
            <p className="text-2xl font-bold">{scores.planningScore}</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">الكفاءة العلمية</p>
            <p className="text-2xl font-bold">{scores.scientificCompetencyScore}</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">الاستراتيجيات</p>
            <p className="text-2xl font-bold">{scores.strategiesScore}</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">الإدارة</p>
            <p className="text-2xl font-bold">{scores.managementScore}</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">التقييم</p>
            <p className="text-2xl font-bold">{scores.assessmentScore}</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">الجودة</p>
            <p className="text-2xl font-bold">{scores.qualityScore}</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="text-center">
          <p className="text-xl font-semibold">المجموع الكلي</p>
          <p className="text-4xl font-bold">{scores.overallScore}</p>
        </div>
      </CardContent>
    </Card>
  )
}