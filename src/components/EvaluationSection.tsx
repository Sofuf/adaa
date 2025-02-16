import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EvaluationSectionProps {
  title: string;
  criteria: string[];
  section: string;
  formData: Record<string, string[]>;
  handleInputChange: (section: string, index: number, value: string) => void;
}

const ratingOptions = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
];

export default function EvaluationSection({ title, criteria, section, formData, handleInputChange }: EvaluationSectionProps) {
  return (
    <div className="border rounded-lg p-4 mb-6 shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">المعيار</TableHead>
            {[...ratingOptions].reverse().map((option) => ( // Ensure correct order
              <TableHead key={option.value} className="text-center">{option.value}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {criteria.map((criterion, index) => (
            <TableRow key={index}>
              <TableCell className="text-right">{criterion}</TableCell>
              {[...ratingOptions].reverse().map((option) => (
                <TableCell key={option.value} className="text-center">
                  <RadioGroup
                    value={formData[section][index] || ""}
                    onValueChange={(value: string) => handleInputChange(section, index, value)}                    >
                    <div className="flex items-center justify-center">
                      <RadioGroupItem value={option.value} id={`${section}-${index}-${option.value}`} />
                      <Label htmlFor={`${section}-${index}-${option.value}`} className="ml-2">
                        {option.value}
                      </Label>
                    </div>
                  </RadioGroup>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
