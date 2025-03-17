"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, BookOpen, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import SessionBookingModal from "@/components/session-booking-modal";

export default function TutorDashboard() {
  // Mock data - would come from database in real implementation
  const upcomingSessions = [
    {
      id: 1,
      subject: "Mathematics",
      student: "Alex Johnson",
      date: "2023-06-15",
      time: "15:00",
      duration: 60,
    },
    {
      id: 2,
      subject: "Physics",
      student: "Emma Williams",
      date: "2023-06-17",
      time: "16:30",
      duration: 45,
    },
    {
      id: 3,
      subject: "Chemistry",
      student: "Michael Brown",
      date: "2023-06-20",
      time: "14:00",
      duration: 60,
    },
  ];

  const students = [
    {
      id: 1,
      name: "Alex Johnson",
      grade: "10th",
      subjects: ["Mathematics", "Physics"],
      sessionsCompleted: 8,
    },
    {
      id: 2,
      name: "Emma Williams",
      grade: "11th",
      subjects: ["Physics"],
      sessionsCompleted: 5,
    },
    {
      id: 3,
      name: "Michael Brown",
      grade: "9th",
      subjects: ["Chemistry", "Biology"],
      sessionsCompleted: 12,
    },
    {
      id: 4,
      name: "Sophia Davis",
      grade: "12th",
      subjects: ["Mathematics"],
      sessionsCompleted: 3,
    },
  ];

  const teachingPlans = [
    {
      id: 1,
      title: "Algebra Fundamentals",
      subject: "Mathematics",
      aiGenerated: true,
      lastUpdated: "2023-06-10",
    },
    {
      id: 2,
      title: "Newton's Laws of Motion",
      subject: "Physics",
      aiGenerated: true,
      lastUpdated: "2023-06-12",
    },
    {
      id: 3,
      title: "Periodic Table Introduction",
      subject: "Chemistry",
      aiGenerated: false,
      lastUpdated: "2023-06-08",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tutor Dashboard</h1>
        <div className="flex gap-3">
          <Button variant="outline">Update Availability</Button>
          <SessionBookingModal />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4 bg-blue-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Today's Sessions</h3>
              <p className="text-2xl font-bold">2</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-green-50">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Active Students</h3>
              <p className="text-2xl font-bold">{students.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-purple-50">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium">Teaching Plans</h3>
              <p className="text-2xl font-bold">{teachingPlans.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-orange-50">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <Brain className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-medium">AI Suggestions</h3>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="plans">Teaching Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Upcoming Sessions</h3>
              <Button variant="outline" size="sm">
                View Calendar
              </Button>
            </div>
            {upcomingSessions.map((session) => (
              <Card key={session.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{session.subject}</h3>
                    <p className="text-gray-600">Student: {session.student}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      {session.time} ({session.duration} min)
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="students" className="mt-6">
          <div className="space-y-4">
            {students.map((student) => (
              <Card key={student.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{student.name}</h3>
                    <p className="text-gray-600">
                      Grade: {student.grade} • Subjects:{" "}
                      {student.subjects.join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {student.sessionsCompleted} Sessions
                    </p>
                    <Button variant="outline" size="sm">
                      View Progress
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="plans" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Your Teaching Plans</h3>
              <Button size="sm">Create New Plan</Button>
            </div>
            {teachingPlans.map((plan) => (
              <Card key={plan.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{plan.title}</h3>
                      {plan.aiGenerated && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          AI Generated
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">
                      {plan.subject} • Last updated:{" "}
                      {new Date(plan.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Edit Plan
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
