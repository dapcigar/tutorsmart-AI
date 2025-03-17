"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, Settings, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  // Mock data - would come from database in real implementation
  const tutors = [
    {
      id: 1,
      name: "Dr. Smith",
      subjects: ["Mathematics", "Physics"],
      status: "Active",
      joinDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Prof. Johnson",
      subjects: ["Physics", "Chemistry"],
      status: "Active",
      joinDate: "2023-02-10",
    },
    {
      id: 3,
      name: "Ms. Williams",
      subjects: ["Biology", "Chemistry"],
      status: "Pending",
      joinDate: "2023-06-05",
    },
  ];

  const students = [
    {
      id: 1,
      name: "Alex Johnson",
      grade: "10th",
      subjects: ["Mathematics", "Physics"],
      joinDate: "2023-03-20",
    },
    {
      id: 2,
      name: "Emma Williams",
      grade: "11th",
      subjects: ["Physics"],
      joinDate: "2023-04-15",
    },
    {
      id: 3,
      name: "Michael Brown",
      grade: "9th",
      subjects: ["Chemistry", "Biology"],
      joinDate: "2023-05-10",
    },
  ];

  const payments = [
    {
      id: 1,
      date: "2023-06-01",
      amount: 1200,
      description: "Tutor payments - May",
      status: "Processed",
    },
    {
      id: 2,
      date: "2023-06-05",
      amount: 850,
      description: "Subscription fees - June",
      status: "Processed",
    },
    {
      id: 3,
      date: "2023-06-10",
      amount: 320,
      description: "Refund - Canceled sessions",
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4 bg-blue-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Total Users</h3>
              <p className="text-2xl font-bold">
                {tutors.length + students.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-green-50">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Active Tutors</h3>
              <p className="text-2xl font-bold">
                {tutors.filter((t) => t.status === "Active").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-purple-50">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium">Total Students</h3>
              <p className="text-2xl font-bold">{students.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-orange-50">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <BarChart className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-medium">Monthly Revenue</h3>
              <p className="text-2xl font-bold">$2,370</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="tutors" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tutors">Tutors</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="tutors" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Tutor Management</h3>
              <Button
                size="sm"
                onClick={() => (window.location.href = "/dashboard/tutors")}
              >
                Add New Tutor
              </Button>
            </div>
            {tutors.map((tutor) => (
              <Card key={tutor.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{tutor.name}</h3>
                    <p className="text-gray-600">
                      Subjects: {tutor.subjects.join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${tutor.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {tutor.status}
                    </span>
                    <p className="text-gray-600 mt-1">
                      Joined: {new Date(tutor.joinDate).toLocaleDateString()}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() =>
                        (window.location.href = "/dashboard/tutors")
                      }
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="students" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Student Management</h3>
              <Button
                size="sm"
                onClick={() => (window.location.href = "/dashboard/students")}
              >
                Add New Student
              </Button>
            </div>
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
                    <p className="text-gray-600">
                      Joined: {new Date(student.joinDate).toLocaleDateString()}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() =>
                        (window.location.href = "/dashboard/students")
                      }
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Payment Management</h3>
              <Button size="sm">Generate Report</Button>
            </div>
            {payments.map((payment) => (
              <Card key={payment.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">${payment.amount}</h3>
                    <p className="text-gray-600">{payment.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {new Date(payment.date).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${payment.status === "Processed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {payment.status}
                    </span>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
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
