"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TeachingPlanGeneratorProps {
  studentId?: string;
  subject?: string;
  onPlanGenerated?: (plan: any) => void;
}

export function TeachingPlanGenerator({
  studentId,
  subject,
  onPlanGenerated,
}: TeachingPlanGeneratorProps = {}) {
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(subject || "");
  const [topic, setTopic] = useState("");
  const [studentLevel, setStudentLevel] = useState("intermediate");
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock subjects - would come from database
  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Computer Science",
  ];

  const generatePlan = async () => {
    if (!selectedSubject || !topic) {
      toast({
        title: "Missing information",
        description: "Please select a subject and enter a topic",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate API call to AI service
    setTimeout(() => {
      // Mock response - in a real app, this would come from an AI API
      const mockPlan = `# ${topic} - Teaching Plan\n\n## Learning Objectives\n- Understand key concepts of ${topic}\n- Apply ${topic} principles to solve problems\n- Analyze and evaluate ${topic} scenarios\n\n## Lesson Structure (60 minutes)\n1. Introduction (10 min)\n   - Brief overview of ${topic}\n   - Connect to previous knowledge\n\n2. Main Concepts (20 min)\n   - Explanation of core principles\n   - Visual aids and examples\n\n3. Guided Practice (15 min)\n   - Worked examples\n   - Step-by-step problem solving\n\n4. Independent Practice (10 min)\n   - Student exercises\n   - Application problems\n\n5. Assessment & Conclusion (5 min)\n   - Quick check for understanding\n   - Summary of key points\n\n## Resources\n- Interactive simulations\n- Practice worksheets\n- Visual aids\n\n## Differentiation Strategies\n- For struggling students: Simplified examples, additional visual aids\n- For advanced students: Challenge problems, extension activities`;

      setGeneratedPlan(mockPlan);
      setLoading(false);

      if (onPlanGenerated) {
        onPlanGenerated({
          title: topic,
          subject: selectedSubject,
          content: mockPlan,
          aiGenerated: true,
          createdAt: new Date().toISOString(),
        });
      }

      toast({
        title: "Plan generated",
        description: "Your teaching plan has been created successfully",
      });
    }, 2000);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Teaching Plan Generator
        </CardTitle>
        <CardDescription>
          Generate personalized teaching plans based on subject, topic, and
          student level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subj) => (
                  <SelectItem key={subj} value={subj}>
                    {subj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., Quadratic Equations, Newton's Laws"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Student Level</Label>
            <Select value={studentLevel} onValueChange={setStudentLevel}>
              <SelectTrigger id="level">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {generatedPlan && (
            <div className="mt-4 space-y-2">
              <Label>Generated Plan</Label>
              <div className="border rounded-md p-4 bg-gray-50 whitespace-pre-line">
                {generatedPlan}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setGeneratedPlan(null)}>
          Clear
        </Button>
        <Button onClick={generatePlan} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Plan"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
