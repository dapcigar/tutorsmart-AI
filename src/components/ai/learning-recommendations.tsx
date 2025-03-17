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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, BookOpen, Video, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LearningRecommendationsProps {
  studentId?: string;
  subject?: string;
}

export function LearningRecommendations({
  studentId,
  subject,
}: LearningRecommendationsProps = {}) {
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(subject || "");
  const [recommendations, setRecommendations] = useState<any[] | null>(null);
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

  const getRecommendations = async () => {
    if (!selectedSubject) {
      toast({
        title: "Subject required",
        description: "Please select a subject to get recommendations",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate API call to AI service
    setTimeout(() => {
      // Mock response - in a real app, this would come from an AI API
      const mockRecommendations = [
        {
          id: 1,
          title: "Introduction to Calculus",
          type: "video",
          description:
            "A comprehensive video series covering the basics of calculus",
          url: "https://example.com/calculus-intro",
          icon: <Video className="h-5 w-5 text-blue-600" />,
        },
        {
          id: 2,
          title: "Advanced Problem Solving Techniques",
          type: "practice",
          description:
            "Interactive exercises to improve problem-solving skills",
          url: "https://example.com/problem-solving",
          icon: <FileText className="h-5 w-5 text-green-600" />,
        },
        {
          id: 3,
          title: "Mathematical Thinking: A Comprehensive Guide",
          type: "book",
          description: "An e-book that develops mathematical reasoning skills",
          url: "https://example.com/math-thinking",
          icon: <BookOpen className="h-5 w-5 text-purple-600" />,
        },
        {
          id: 4,
          title: "Real-world Applications of Mathematics",
          type: "article",
          description:
            "Learn how mathematical concepts apply to everyday situations",
          url: "https://example.com/math-applications",
          icon: <FileText className="h-5 w-5 text-orange-600" />,
        },
      ];

      setRecommendations(mockRecommendations);
      setLoading(false);

      toast({
        title: "Recommendations ready",
        description: `Found ${mockRecommendations.length} learning resources for you`,
      });
    }, 1500);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Learning Recommendations
        </CardTitle>
        <CardDescription>
          Get personalized learning resources based on your progress and
          interests
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

          {recommendations && (
            <div className="mt-4 space-y-4">
              <h3 className="font-medium">
                Recommended Resources for {selectedSubject}
              </h3>
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{rec.icon}</div>
                      <div>
                        <h4 className="font-medium">{rec.title}</h4>
                        <p className="text-sm text-gray-600">
                          {rec.description}
                        </p>
                        <Button
                          variant="link"
                          className="p-0 h-auto mt-1 text-blue-600"
                          onClick={() => window.open(rec.url, "_blank")}
                        >
                          View resource
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={getRecommendations}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finding recommendations...
            </>
          ) : (
            "Get Personalized Recommendations"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
