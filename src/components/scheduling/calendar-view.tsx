"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import SessionBookingModal from "@/components/session-booking-modal";

interface CalendarViewProps {
  userRole?: "student" | "tutor" | "parent" | "admin";
  userId?: string;
}

export function CalendarView({
  userRole = "student",
  userId,
}: CalendarViewProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");

  // Mock sessions data - would come from database in real implementation
  const sessions = [
    {
      id: 1,
      subject: "Mathematics",
      tutor: "Dr. Smith",
      student: "Alex Johnson",
      date: new Date(2023, 5, 15, 15, 0), // June 15, 2023, 3:00 PM
      duration: 60,
    },
    {
      id: 2,
      subject: "Physics",
      tutor: "Prof. Johnson",
      student: "Emma Williams",
      date: new Date(2023, 5, 17, 16, 30), // June 17, 2023, 4:30 PM
      duration: 45,
    },
    {
      id: 3,
      subject: "Chemistry",
      tutor: "Ms. Williams",
      student: "Michael Brown",
      date: new Date(2023, 5, 20, 14, 0), // June 20, 2023, 2:00 PM
      duration: 60,
    },
    {
      id: 4,
      subject: "Biology",
      tutor: "Dr. Davis",
      student: "Sophia Davis",
      date: new Date(2023, 5, 16, 10, 0), // June 16, 2023, 10:00 AM
      duration: 90,
    },
    {
      id: 5,
      subject: "English",
      tutor: "Ms. Miller",
      student: "Alex Johnson",
      date: new Date(2023, 5, 18, 13, 0), // June 18, 2023, 1:00 PM
      duration: 60,
    },
  ];

  // Filter sessions based on user role
  const filteredSessions = sessions.filter((session) => {
    if (userRole === "student") return session.student === "Alex Johnson"; // Mock current student
    if (userRole === "tutor") return session.tutor === "Dr. Smith"; // Mock current tutor
    return true; // Admin and parent see all sessions
  });

  // Get the start and end of the current week
  const getWeekDates = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(date.setDate(diff));
    const weekDates = [];

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(monday);
      nextDate.setDate(monday.getDate() + i);
      weekDates.push(nextDate);
    }

    return weekDates;
  };

  const weekDates = getWeekDates(new Date(date));

  // Time slots for the day view
  const timeSlots = [];
  for (let hour = 8; hour < 20; hour++) {
    timeSlots.push(`${hour}:00`);
    timeSlots.push(`${hour}:30`);
  }

  // Check if a session is on a specific date
  const getSessionsForDate = (date: Date) => {
    return filteredSessions.filter((session) => {
      return session.date.toDateString() === date.toDateString();
    });
  };

  // Check if a session is at a specific time slot
  const getSessionForTimeSlot = (date: Date, timeSlot: string) => {
    const [hour, minute] = timeSlot.split(":").map(Number);
    return filteredSessions.find((session) => {
      return (
        session.date.toDateString() === date.toDateString() &&
        session.date.getHours() === hour &&
        session.date.getMinutes() === minute
      );
    });
  };

  // Navigate to previous/next period
  const navigatePrevious = () => {
    const newDate = new Date(date);
    if (view === "day") {
      newDate.setDate(date.getDate() - 1);
    } else if (view === "week") {
      newDate.setDate(date.getDate() - 7);
    } else {
      newDate.setMonth(date.getMonth() - 1);
    }
    setDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(date);
    if (view === "day") {
      newDate.setDate(date.getDate() + 1);
    } else if (view === "week") {
      newDate.setDate(date.getDate() + 7);
    } else {
      newDate.setMonth(date.getMonth() + 1);
    }
    setDate(newDate);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Session Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={view} onValueChange={(v) => setView(v as any)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
            <SessionBookingModal />
          </div>
        </div>
        <CardDescription>
          View and manage your tutoring sessions
        </CardDescription>
        <div className="flex justify-between items-center mt-2">
          <Button variant="outline" size="sm" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {view === "day"
              ? "Previous Day"
              : view === "week"
                ? "Previous Week"
                : "Previous Month"}
          </Button>
          <div className="font-medium">
            {view === "day"
              ? date.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })
              : view === "week"
                ? `Week of ${weekDates[0].toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${weekDates[6].toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
                : date.toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
          </div>
          <Button variant="outline" size="sm" onClick={navigateNext}>
            {view === "day"
              ? "Next Day"
              : view === "week"
                ? "Next Week"
                : "Next Month"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {view === "month" && (
          <div className="mt-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border mx-auto"
              modifiers={{
                booked: filteredSessions.map((session) => session.date),
              }}
              modifiersStyles={{
                booked: {
                  backgroundColor: "#e0f2fe",
                  color: "#0369a1",
                  fontWeight: "bold",
                },
              }}
            />
            <div className="mt-4">
              <h3 className="font-medium mb-2">
                Sessions on {date.toLocaleDateString()}
              </h3>
              <div className="space-y-2">
                {getSessionsForDate(date).length > 0 ? (
                  getSessionsForDate(date).map((session) => (
                    <Card key={session.id} className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{session.subject}</h4>
                          <p className="text-sm text-gray-600">
                            {userRole === "tutor"
                              ? `Student: ${session.student}`
                              : `Tutor: ${session.tutor}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {session.date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="text-sm text-gray-600">
                            {session.duration} min
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-2">
                    No sessions scheduled for this date
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {view === "week" && (
          <div className="mt-4 overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-8 gap-1">
                <div className="sticky left-0 bg-white z-10"></div>
                {weekDates.map((date, index) => (
                  <div
                    key={index}
                    className="text-center font-medium p-2 border-b"
                  >
                    <div>
                      {date.toLocaleDateString(undefined, { weekday: "short" })}
                    </div>
                    <div>{date.getDate()}</div>
                  </div>
                ))}

                {timeSlots.map((timeSlot, timeIndex) => (
                  <React.Fragment key={timeSlot}>
                    <div className="sticky left-0 bg-white z-10 p-2 border-r text-right text-sm text-gray-600">
                      {timeSlot}
                    </div>
                    {weekDates.map((date, dateIndex) => {
                      const session = getSessionForTimeSlot(date, timeSlot);
                      return (
                        <div
                          key={`${timeIndex}-${dateIndex}`}
                          className={`p-1 border border-gray-100 min-h-[40px] ${session ? "bg-blue-100" : ""}`}
                        >
                          {session && (
                            <div className="text-xs p-1">
                              <div className="font-medium">
                                {session.subject}
                              </div>
                              <div>
                                {userRole === "tutor"
                                  ? session.student
                                  : session.tutor}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === "day" && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">
              {date.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h3>
            <div className="space-y-2">
              {timeSlots.map((timeSlot) => {
                const session = getSessionForTimeSlot(date, timeSlot);
                return (
                  <div key={timeSlot} className="flex">
                    <div className="w-20 py-2 text-right pr-4 text-sm text-gray-600">
                      {timeSlot}
                    </div>
                    <div className="flex-1">
                      {session ? (
                        <Card className="p-3 bg-blue-50">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{session.subject}</h4>
                              <p className="text-sm text-gray-600">
                                {userRole === "tutor"
                                  ? `Student: ${session.student}`
                                  : `Tutor: ${session.tutor}`}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                {session.duration} min
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-1"
                              >
                                Details
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ) : (
                        <div className="border border-dashed border-gray-200 rounded-md h-12"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
