"use client";

import DashboardNavbar from "@/components/dashboard-navbar";
import { TutorAvailability } from "@/components/scheduling/tutor-availability";
import { CalendarView } from "@/components/scheduling/calendar-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar } from "lucide-react";

export default function AvailabilityPage() {
  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Schedule Management</h1>
            <p className="text-gray-600">
              Manage your availability and view your tutoring calendar
            </p>
          </div>
        </div>

        <Tabs defaultValue="availability" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="availability" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" /> Set Availability
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" /> Calendar View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="availability" className="mt-6">
            <TutorAvailability />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <CalendarView />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
