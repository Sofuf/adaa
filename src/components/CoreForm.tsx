"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface CoreFormData {
    strengths: string;
    improvements: string;
    teacherFeedback: string;
}

interface CoreFormProps {
    onCoreChange?: (data: CoreFormData) => void;
}

export default function CoreForm({ onCoreChange }: CoreFormProps) {
    const [formData, setFormData] = useState<CoreFormData>({
        strengths: "",
        improvements: "",
        teacherFeedback: "",
    });

    useEffect(() => {
        if (onCoreChange) onCoreChange(formData);
    }, [formData, onCoreChange]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newData = { ...formData, [e.target.name]: e.target.value };
        setFormData(newData);
        if (onCoreChange) onCoreChange(newData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">معلومات التغذية الراجعة        </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4">
                    <Input
                        name="strengths"
                        placeholder="جوانب القوة - Strengths"
                        value={formData.strengths}
                        onChange={handleInputChange}
                    />
                    <Input
                        name="improvements"
                        placeholder="جوانب تحتاج إلى تحسين - Aspects that require improvement"
                        value={formData.improvements}
                        onChange={handleInputChange}
                    />
                    <Input
                        name="teacherFeedback"
                        placeholder="التغذية الراجعة من المعلم - Feedback from the teacher"
                        value={formData.teacherFeedback}
                        onChange={handleInputChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
