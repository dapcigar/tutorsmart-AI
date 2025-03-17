"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SessionBookingModal() {
  const [date, setDate] = useState<Date>();
  const [subject, setSubject] = useState("");
  const [tutor, setTutor] = useState("");
  const [time, setTime] = useState("");
  const [open, setOpen] = useState(false);

  // Mock data
  const subjects = [
    { id: 1, name: "Mathematics" },
    { id: 2, name: "Physics" },
    { id: 3, name: "Chemistry" },
    { id: 4, name: "Biology" },
    { id: 5, name: "English" },
  ];

  const tutors = [
    { id: 1, name: "Dr. Smith", subjects: [1, 2] },
    { id: 2, name: "Prof. Johnson", subjects: [2, 3] },
    { id: 3, name: "Ms. Williams", subjects: [3, 4] },
    { id: 4, name: "Mr. Davis", subjects: [1, 5] },
  ];

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  // Filter tutors based on selected subject
  const filteredTutors = subject
    ? tutors.filter((t) => t.subjects.includes(parseInt(subject)))
    : [];

  const handleBookSession = () => {
    // In a real app, this would send the booking data to the server
    console.log("Booking session with:", {
      subject,
      tutor,
      date: date ? format(date, "PPP") : "",
      time,
    });

    // Close the dialog
    setOpen(false);

    // Reset form
    setSubject("");
    setTutor("");
    setDate(undefined);
    setTime("");

    // Show success message (in a real app)
    alert("Session booked successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Book New Session</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book a Tutoring Session</DialogTitle>
          <DialogDescription>
            Select a subject, tutor, date, and time for your session.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tutor">Tutor</Label>
            <Select value={tutor} onValueChange={setTutor} disabled={!subject}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    subject ? "Select a tutor" : "Select a subject first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {filteredTutors.map((t) => (
                  <SelectItem key={t.id} value={t.id.toString()}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                  disabled={!tutor}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={{
                    before: new Date(),
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="time">Time</Label>
            <Select value={time} onValueChange={setTime} disabled={!date}>
              <SelectTrigger>
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleBookSession}
            disabled={!subject || !tutor || !date || !time}
          >
            Book Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
