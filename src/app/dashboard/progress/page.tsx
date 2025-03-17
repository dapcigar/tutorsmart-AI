"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentProgressChart } from "@/components/progress/student-progress-chart";
import { AchievementBadges } from "@/components/progress/achievement-badges";
import { LearningRecommendations } from "@/components/ai/learning-recommendations";
import { Loader2, BarChart, Award, Brain } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ProgressPage() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("student_id");
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("3months");
  const { toast } = useToast();

  // Mock subjects for filter
  const subjects = [
    { value: "all", label: "All Subjects" },
    { value: "math", label: "Mathematics" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
    { value: "english", label: "English" },
  ];

  const timeframes = [
    { value: "1month", label: "Last Month" },
    { value: "3months", label: "Last 3 Months" },
    { value: "6months", label: "Last 6 Months" },
    { value: "1year", label: "Last Year" },
  ];

  useEffect(() => {
    fetchProgressData();
  }, [studentId, selectedSubject, selectedTimeframe]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);

      let url = "/api/progress";
      const params = new URLSearchParams();

      if (studentId) {
        params.append("student_id", studentId);
      }

      if (selectedSubject !== "all") {
        params.append("subject", selectedSubject);
      }

      params.append("timeframe", selectedTimeframe);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setProgressData(data.progress);
      } else {
        throw new Error(data.error || "Failed to fetch progress data");
      }
    } catch (error: any) {
      console.error("Error fetching progress data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load progress data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {studentId ? "Student Progress" : "Your Progress"}
          </h1>
          {studentId && (
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Students
            </Button>
          )}
        </div>

        {loading && !progressData ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading progress data...</span>
          </div>
        ) : progressData ? (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    {progressData.student.name}'s Progress
                  </h2>
                  <p className="text-gray-600">
                    Track performance and improvement over time
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
                  <div className="w-48">
                    <Select
                      value={selectedSubject}
                      onValueChange={setSelectedSubject}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.value} value={subject.value}>
                            {subject.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-48">
                    <Select
                      value={selectedTimeframe}
                      onValueChange={setSelectedTimeframe}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeframes.map((timeframe) => (
                          <SelectItem
                            key={timeframe.value}
                            value={timeframe.value}
                          >
                            {timeframe.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-3 bg-blue-50">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {progressData.summary.averageScore}%
                    </p>
                  </div>
                </Card>
                <Card className="p-3 bg-green-50">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Improvement</p>
                    <p className="text-2xl font-bold text-green-700">
                      +{progressData.summary.improvement}%
                    </p>
                  </div>
                </Card>
                <Card className="p-3 bg-purple-50">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Completed Tasks</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {progressData.summary.completedTasks}
                    </p>
                  </div>
                </Card>
              </div>

              <div className="mt-6">
                {/* Chart visualization - in a real app, use a chart library like Chart.js or Recharts */}
                <div className="border rounded-md p-4 bg-gray-50">
                  <div className="text-center text-gray-500 mb-4">
                    Performance Chart for{" "}
                    {selectedSubject === "all"
                      ? "All Subjects"
                      : subjects.find((s) => s.value === selectedSubject)
                          ?.label}
                  </div>
                  <div className="h-64 flex items-end justify-between gap-2 px-4">
                    {progressData.chartData.labels.map(
                      (month: string, index: number) => (
                        <div
                          key={month}
                          className="flex flex-col items-center gap-1 w-full"
                        >
                          <div
                            className="bg-blue-500 w-full rounded-t-md"
                            style={{
                              height: `${progressData.chartData.datasets[0].data[index]}%`,
                            }}
                            title={`Quiz Score: ${progressData.chartData.datasets[0].data[index]}%`}
                          />
                          <span className="text-xs">{month}</span>
                        </div>
                      ),
                    )}
                  </div>
                  <div className="flex justify-center mt-4 gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Quiz Scores</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Assignments</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Tabs defaultValue="achievements" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="achievements" className="flex items-center">
                  <Award className="mr-2 h-4 w-4" /> Achievements
                </TabsTrigger>
                <TabsTrigger
                  value="recommendations"
                  className="flex items-center"
                >
                  <Brain className="mr-2 h-4 w-4" /> Recommendations
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center">
                  <BarChart className="mr-2 h-4 w-4" /> Detailed Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="achievements" className="mt-6">
                <AchievementBadges studentId={studentId || undefined} />
              </TabsContent>

              <TabsContent value="recommendations" className="mt-6">
                <LearningRecommendations
                  studentId={studentId || undefined}
                  subject={
                    selectedSubject === "all" ? undefined : selectedSubject
                  }
                />
              </TabsContent>

              <TabsContent value="details" className="mt-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Detailed Performance Analytics
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Comprehensive breakdown of performance metrics across
                    different subjects and assessment types.
                  </p>
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Detailed analytics visualization would appear here.
                    </p>
                    <p className="text-gray-500 mt-2">
                      (This would include more detailed charts, subject-specific
                      breakdowns, and trend analysis)
                    </p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">
              No progress data available
            </h3>
            <p className="mt-2 text-gray-500">
              Complete some sessions and assessments to start tracking progress.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
