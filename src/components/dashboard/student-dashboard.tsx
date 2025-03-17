"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BookOpen, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import SessionBookingModal from "@/components/session-booking-modal";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("upcoming");

  // Mock data - would come from database in real implementation
  const upcomingSessions = [
    {
      id: 1,
      subject: "Mathematics",
      tutor: "Dr. Smith",
      date: "2023-06-15",
      time: "15:00",
      duration: 60,
    },
    {
      id: 2,
      subject: "Physics",
      tutor: "Prof. Johnson",
      date: "2023-06-17",
      time: "16:30",
      duration: 45,
    },
    {
      id: 3,
      subject: "Chemistry",
      tutor: "Ms. Williams",
      date: "2023-06-20",
      time: "14:00",
      duration: 60,
    },
  ];

  const assignments = [
    {
      id: 1,
      title: "Algebra Practice",
      subject: "Mathematics",
      dueDate: "2023-06-16",
      status: "Not Started",
    },
    {
      id: 2,
      subject: "Physics",
      title: "Forces and Motion Quiz",
      dueDate: "2023-06-18",
      status: "In Progress",
    },
    {
      id: 3,
      subject: "Chemistry",
      title: "Periodic Table Assignment",
      dueDate: "2023-06-21",
      status: "Completed",
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "Math Master",
      description: "Completed 10 math sessions",
      icon: <Award className="h-8 w-8 text-yellow-500" />,
    },
    {
      id: 2,
      title: "Quick Learner",
      description: "Finished 5 assignments ahead of schedule",
      icon: <Clock className="h-8 w-8 text-green-500" />,
    },
    {
      id: 3,
      title: "Science Explorer",
      description: "Attended sessions in 3 different science subjects",
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <SessionBookingModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 bg-blue-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Upcoming Sessions</h3>
              <p className="text-2xl font-bold">{upcomingSessions.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-purple-50">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium">Pending Assignments</h3>
              <p className="text-2xl font-bold">
                {assignments.filter((a) => a.status !== "Completed").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-green-50">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Achievements</h3>
              <p className="text-2xl font-bold">{achievements.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <Card key={session.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{session.subject}</h3>
                    <p className="text-gray-600">Tutor: {session.tutor}</p>
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

        <TabsContent value="assignments" className="mt-6">
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {assignment.title}
                    </h3>
                    <p className="text-gray-600">{assignment.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${assignment.status === "Completed" ? "bg-green-100 text-green-800" : assignment.status === "In Progress" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {assignment.status}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className="p-4 flex flex-col items-center text-center"
              >
                <div className="mb-3">{achievement.icon}</div>
                <h3 className="font-semibold text-lg">{achievement.title}</h3>
                <p className="text-gray-600 text-sm">
                  {achievement.description}
                </p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
