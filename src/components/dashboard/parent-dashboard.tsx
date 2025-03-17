"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CreditCard, BarChart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ParentDashboard() {
  // Mock data - would come from database in real implementation
  const children = [
    {
      id: 1,
      name: "Emma Smith",
      grade: "10th",
      upcomingSessions: 2,
      pendingAssignments: 3,
    },
    {
      id: 2,
      name: "Jacob Smith",
      grade: "8th",
      upcomingSessions: 1,
      pendingAssignments: 2,
    },
  ];

  const upcomingSessions = [
    {
      id: 1,
      child: "Emma Smith",
      subject: "Mathematics",
      tutor: "Dr. Smith",
      date: "2023-06-15",
      time: "15:00",
    },
    {
      id: 2,
      child: "Emma Smith",
      subject: "Physics",
      tutor: "Prof. Johnson",
      date: "2023-06-17",
      time: "16:30",
    },
    {
      id: 3,
      child: "Jacob Smith",
      subject: "English",
      tutor: "Ms. Davis",
      date: "2023-06-16",
      time: "14:00",
    },
  ];

  const payments = [
    {
      id: 1,
      date: "2023-06-01",
      amount: 120,
      description: "4 Math Sessions - Emma",
      status: "Paid",
    },
    {
      id: 2,
      date: "2023-06-05",
      amount: 90,
      description: "3 English Sessions - Jacob",
      status: "Paid",
    },
    {
      id: 3,
      date: "2023-06-10",
      amount: 60,
      description: "2 Physics Sessions - Emma",
      status: "Pending",
    },
  ];

  const messages = [
    {
      id: 1,
      from: "Dr. Smith",
      subject: "Emma's progress in Mathematics",
      date: "2023-06-12",
      read: true,
    },
    {
      id: 2,
      from: "Ms. Davis",
      subject: "Jacob's upcoming assignment",
      date: "2023-06-13",
      read: false,
    },
    {
      id: 3,
      from: "Admin",
      subject: "Monthly progress report",
      date: "2023-06-14",
      read: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Parent Dashboard</h1>
        <Button>Book New Session</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((child) => (
          <Card key={child.id} className="p-6">
            <h3 className="text-xl font-semibold mb-4">{child.name}</h3>
            <p className="text-gray-600 mb-4">Grade: {child.grade}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Upcoming</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {child.upcomingSessions}
                </p>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Assignments</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {child.pendingAssignments}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" size="sm">
                View Progress
              </Button>
              <Button variant="outline" size="sm">
                Contact Tutors
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sessions">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="mt-6">
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <Card key={session.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{session.subject}</h3>
                    <p className="text-gray-600">
                      For: {session.child} • Tutor: {session.tutor}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">{session.time}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Payment History</h3>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Add Payment Method
              </Button>
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
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${payment.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <Card
                key={message.id}
                className={`p-4 ${!message.read ? "border-l-4 border-blue-500" : ""}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{message.subject}</h3>
                    <p className="text-gray-600">From: {message.from}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {new Date(message.date).toLocaleDateString()}
                    </p>
                    <Button variant="outline" size="sm">
                      Read
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
