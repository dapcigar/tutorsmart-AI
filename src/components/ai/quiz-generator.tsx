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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface QuizGeneratorProps {
  studentId?: string;
  subject?: string;
  onQuizGenerated?: (quiz: any) => void;
}

export function QuizGenerator({
  studentId,
  subject,
  onQuizGenerated,
}: QuizGeneratorProps = {}) {
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(subject || "");
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState("5");
  const [includeMultipleChoice, setIncludeMultipleChoice] = useState(true);
  const [includeShortAnswer, setIncludeShortAnswer] = useState(true);
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null);
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

  const generateQuiz = async () => {
    if (!selectedSubject || !topic) {
      toast({
        title: "Missing information",
        description: "Please select a subject and enter a topic",
        variant: "destructive",
      });
      return;
    }

    if (!includeMultipleChoice && !includeShortAnswer) {
      toast({
        title: "Question type required",
        description: "Please select at least one question type",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Call our edge function to generate the quiz
      const response = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: selectedSubject,
          topic,
          questionCount: parseInt(questionCount),
          includeMultipleChoice,
          includeShortAnswer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate quiz");
      }

      setGeneratedQuiz(data.quiz);

      if (onQuizGenerated) {
        onQuizGenerated(data.quiz);
      }

      toast({
        title: "Quiz generated",
        description: `Your quiz with ${data.quiz.questions.length} questions has been created successfully`,
      });
    } catch (error: any) {
      console.error("Error generating quiz:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate quiz",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Quiz Generator
        </CardTitle>
        <CardDescription>
          Create personalized quizzes and assessments for your students
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
            <Label htmlFor="questionCount">Number of Questions</Label>
            <Select value={questionCount} onValueChange={setQuestionCount}>
              <SelectTrigger id="questionCount">
                <SelectValue placeholder="Select count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 questions</SelectItem>
                <SelectItem value="5">5 questions</SelectItem>
                <SelectItem value="10">10 questions</SelectItem>
                <SelectItem value="15">15 questions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Question Types</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="multipleChoice"
                checked={includeMultipleChoice}
                onCheckedChange={(checked) =>
                  setIncludeMultipleChoice(checked as boolean)
                }
              />
              <label
                htmlFor="multipleChoice"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Multiple Choice
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="shortAnswer"
                checked={includeShortAnswer}
                onCheckedChange={(checked) =>
                  setIncludeShortAnswer(checked as boolean)
                }
              />
              <label
                htmlFor="shortAnswer"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Short Answer
              </label>
            </div>
          </div>

          {generatedQuiz && (
            <div className="mt-4 space-y-4">
              <Label>Generated Quiz: {generatedQuiz.title}</Label>
              <div className="border rounded-md p-4 bg-gray-50">
                <h3 className="font-medium mb-2">Questions:</h3>
                <ol className="list-decimal pl-5 space-y-3">
                  {generatedQuiz.questions.map((q: any, index: number) => (
                    <li key={q.id} className="pl-1">
                      <p className="font-medium">{q.text}</p>
                      {q.type === "multiple-choice" && (
                        <div className="mt-2 space-y-1">
                          {q.options.map((opt: any) => (
                            <div key={opt.id} className="flex items-center">
                              <span className="font-medium mr-2">
                                {opt.id.toUpperCase()}.
                              </span>
                              <span>{opt.text}</span>
                              {opt.id === q.correctAnswer && (
                                <span className="ml-2 text-green-600 text-sm">
                                  (Correct)
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {q.type === "short-answer" && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            Sample answer: {q.sampleAnswer}
                          </p>
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setGeneratedQuiz(null)}>
          Clear
        </Button>
        <Button onClick={generateQuiz} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Quiz"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
