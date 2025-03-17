"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function StudentProgressChart({ studentId }: { studentId?: string }) {
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("3months");

  // Mock subjects - would come from database
  const subjects = [
    { value: "all", label: "All Subjects" },
    { value: "math", label: "Mathematics" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
  ];

  const timeframes = [
    { value: "1month", label: "Last Month" },
    { value: "3months", label: "Last 3 Months" },
    { value: "6months", label: "Last 6 Months" },
    { value: "1year", label: "Last Year" },
  ];

  // Mock data for the chart
  // In a real application, this would be fetched from an API
  const progressData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Quiz Scores",
        data: [65, 72, 78, 75, 82, 88],
      },
      {
        label: "Assignments Completed",
        data: [3, 5, 4, 6, 5, 7],
      },
    ],
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle>Progress Tracking</CardTitle>
        <CardDescription>
          Monitor performance and improvement over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger id="subject">
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
            <div className="space-y-2 flex-1">
              <Label htmlFor="timeframe">Time Period</Label>
              <Select
                value={selectedTimeframe}
                onValueChange={setSelectedTimeframe}
              >
                <SelectTrigger id="timeframe">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map((timeframe) => (
                    <SelectItem key={timeframe.value} value={timeframe.value}>
                      {timeframe.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            {/* Chart visualization - in a real app, use a chart library like Chart.js or Recharts */}
            <div className="border rounded-md p-4 bg-gray-50">
              <div className="text-center text-gray-500 mb-4">
                Performance Chart for{" "}
                {selectedSubject === "all"
                  ? "All Subjects"
                  : subjects.find((s) => s.value === selectedSubject)?.label}
              </div>
              <div className="h-64 flex items-end justify-between gap-2 px-4">
                {progressData.labels.map((month, index) => (
                  <div
                    key={month}
                    className="flex flex-col items-center gap-1 w-full"
                  >
                    <div
                      className="bg-blue-500 w-full rounded-t-md"
                      style={{
                        height: `${progressData.datasets[0].data[index]}%`,
                      }}
                      title={`Quiz Score: ${progressData.datasets[0].data[index]}%`}
                    />
                    <span className="text-xs">{month}</span>
                  </div>
                ))}
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

          <div className="mt-4">
            <h3 className="font-medium mb-2">Performance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-3 bg-blue-50">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-blue-700">76%</p>
                </div>
              </Card>
              <Card className="p-3 bg-green-50">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Improvement</p>
                  <p className="text-2xl font-bold text-green-700">+12%</p>
                </div>
              </Card>
              <Card className="p-3 bg-purple-50">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Completed Tasks</p>
                  <p className="text-2xl font-bold text-purple-700">24</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
