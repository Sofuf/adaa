'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type EvaluationStatus = 'محقق' | 'محقق جزئياً' | 'غير محقق';

interface EvaluationArea {
  status: EvaluationStatus;
  notes: string;
  recommendations: string;
  supportProcedures: string;
}

interface ManagementAndInteraction {
  planningCoverage: EvaluationArea;
  lessonPlanning: EvaluationArea;
}

export interface SpecialAimClassEvaluationData {
  visitNumber: string;
  school: string;
  teacherName: string;
  subject: string;
  gradeAndSection: string;
  stream: string;
  presentStudents: string;
  absentStudents: string;
  specialNeedsStudents: string;
  period: string;
  lessonTitle: string;
  wasTeacherTrained: 'yes' | 'no';
  trainingType: string;
  evaluationAreas: {
    managementAndInteraction: ManagementAndInteraction;
  };
}

interface SpecialAimClassEvaluationFormProps {
  onFormDataChange: (data: SpecialAimClassEvaluationData) => void;
}

const SpecialAimClassEvaluationForm = ({ onFormDataChange }: SpecialAimClassEvaluationFormProps) => {
  const [formData, setFormData] = useState<SpecialAimClassEvaluationData>({
    visitNumber: '1',
    school: '',
    teacherName: '',
    subject: '',
    gradeAndSection: '',
    stream: '',
    presentStudents: '',
    absentStudents: '',
    specialNeedsStudents: '',
    period: '',
    lessonTitle: '',
    wasTeacherTrained: 'no',
    trainingType: '',
    evaluationAreas: {
      managementAndInteraction: {
        planningCoverage: {
          status: 'محقق جزئياً',
          notes: '',
          recommendations: '',
          supportProcedures: ''
        },
        lessonPlanning: {
          status: 'غير محقق',
          notes: '',
          recommendations: '',
          supportProcedures: ''
        }
      }
    }
  });

  const handleInputChange = (field: keyof Omit<SpecialAimClassEvaluationData, 'evaluationAreas'>, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      onFormDataChange(newData);
      return newData;
    });
  };

  const handleEvaluationAreaChange = (
    subArea: keyof ManagementAndInteraction,
    field: keyof EvaluationArea,
    value: string
  ) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        evaluationAreas: {
          ...prev.evaluationAreas,
          managementAndInteraction: {
            ...prev.evaluationAreas.managementAndInteraction,
            [subArea]: {
              ...prev.evaluationAreas.managementAndInteraction[subArea],
              [field]: value
            }
          }
        }
      };
      onFormDataChange(newData);
      return newData;
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl flex justify-between items-center">
            <span>
              زيارة ذات هدف صفية رقم {formData.visitNumber}
              <span className="text-sm text-gray-500 block">
                A Visit with Special Aim No. {formData.visitNumber}
              </span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>المدرسة / School</Label>
              <Input
                value={formData.school}
                onChange={(e) => handleInputChange('school', e.target.value)}
              />
            </div>
            <div>
            <Label>اسم المعلم / Teacher&apos;s Name</Label>
            <Input
                value={formData.teacherName}
                onChange={(e) => handleInputChange('teacherName', e.target.value)}
              />
            </div>
            <div>
              <Label>مادة التدريس / Subject</Label>
              <Input
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
              />
            </div>
            <div>
              <Label>الصف والشعبة / Grade and Section</Label>
              <Input
                value={formData.gradeAndSection}
                onChange={(e) => handleInputChange('gradeAndSection', e.target.value)}
              />
            </div>
            <div>
              <Label>المسار / Stream</Label>
              <Input
                value={formData.stream}
                onChange={(e) => handleInputChange('stream', e.target.value)}
              />
            </div>
            <div>
              <Label>عدد الحضور من الطلبة / Present Students</Label>
              <Input
                type="number"
                value={formData.presentStudents}
                onChange={(e) => handleInputChange('presentStudents', e.target.value)}
              />
            </div>
            <div>
              <Label>عدد الطلبة المتغيبين / Absent Students</Label>
              <Input
                type="number"
                value={formData.absentStudents}
                onChange={(e) => handleInputChange('absentStudents', e.target.value)}
              />
            </div>
            <div>
              <Label>عدد الطلبة من أصحاب الهمم / Special Needs Students</Label>
              <Input
                type="number"
                value={formData.specialNeedsStudents}
                onChange={(e) => handleInputChange('specialNeedsStudents', e.target.value)}
              />
            </div>
            <div>
              <Label>الحصة / Period</Label>
              <Input
                value={formData.period}
                onChange={(e) => handleInputChange('period', e.target.value)}
              />
            </div>
            <div>
              <Label>عنوان الدرس / Lesson Title</Label>
              <Input
                value={formData.lessonTitle}
                onChange={(e) => handleInputChange('lessonTitle', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>هل تم تدريب المعلم على جوانب التركيز؟ / Was Teacher trained on areas of concentration?</Label>
            <RadioGroup
              value={formData.wasTeacherTrained}
              onValueChange={(value: 'yes' | 'no') => handleInputChange('wasTeacherTrained', value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">نعم / Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">لا / No</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.wasTeacherTrained === 'yes' && (
            <div>
              <Label>نوع التدريب / Kind of Training</Label>
              <Input
                value={formData.trainingType}
                onChange={(e) => handleInputChange('trainingType', e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>المحاور وجوانب التركيز / Areas and Aspects of Focus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold mb-4">رابعاً: الإدارة والتفاعل الصفي / Management and Class Interaction</h3>
              
              <div className="space-y-4 border-b pb-6 mb-6">
                <div>
                  <Label>يغطي التخطيط جميع جوانب الموقف الصفي (متكاملة العناصر)</Label>
                  <Select
                    value={formData.evaluationAreas.managementAndInteraction.planningCoverage.status}
                    onValueChange={(value: EvaluationStatus) => 
                      handleEvaluationAreaChange('planningCoverage', 'status', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التقييم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="محقق">محقق</SelectItem>
                      <SelectItem value="محقق جزئياً">محقق جزئياً</SelectItem>
                      <SelectItem value="غير محقق">غير محقق</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="mt-4">
                    <Label>الملاحظات الصفية / Class Notes</Label>
                    <Textarea
                      value={formData.evaluationAreas.managementAndInteraction.planningCoverage.notes}
                      onChange={(e) => handleEvaluationAreaChange('planningCoverage', 'notes', e.target.value)}
                    />
                  </div>

                  <div className="mt-4">
                    <Label>التوصيات / Recommendations</Label>
                    <Textarea
                      value={formData.evaluationAreas.managementAndInteraction.planningCoverage.recommendations}
                      onChange={(e) => handleEvaluationAreaChange('planningCoverage', 'recommendations', e.target.value)}
                    />
                  </div>

                  <div className="mt-4">
                    <Label>إجراءات الدعم المقدمة / Support Procedures</Label>
                    <Textarea
                      value={formData.evaluationAreas.managementAndInteraction.planningCoverage.supportProcedures}
                      onChange={(e) => handleEvaluationAreaChange('planningCoverage', 'supportProcedures', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecialAimClassEvaluationForm;