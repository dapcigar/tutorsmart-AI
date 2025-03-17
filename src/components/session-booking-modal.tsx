"use client";

import { useState, useEffect } from "react";
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
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "../../supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function SessionBookingModal() {
  const [date, setDate] = useState<Date>();
  const [subject, setSubject] = useState("");
  const [tutor, setTutor] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [tutors, setTutors] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [tutorAvailability, setTutorAvailability] = useState<any[]>([]);
  const [bookedSessions, setBookedSessions] = useState<any[]>([]);
  const { toast } = useToast();
  const supabase = createClient();

  // Fetch subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        // In a real app, this would fetch from the database
        // For now, using mock data
        setSubjects([
          { id: "Mathematics", name: "Mathematics" },
          { id: "Physics", name: "Physics" },
          { id: "Chemistry", name: "Chemistry" },
          { id: "Biology", name: "Biology" },
          { id: "English", name: "English" },
        ]);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast({
          title: "Error",
          description: "Failed to load subjects",
          variant: "destructive",
        });
      }
    };

    fetchSubjects();
  }, [toast]);

  // Fetch tutors when subject changes
  useEffect(() => {
    const fetchTutors = async () => {
      if (!subject) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/tutors?subject=${subject}`);
        const data = await response.json();

        if (response.ok) {
          setTutors(data.tutors);
        } else {
          throw new Error(data.error || "Failed to fetch tutors");
        }
      } catch (error) {
        console.error("Error fetching tutors:", error);
        toast({
          title: "Error",
          description: "Failed to load tutors",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [subject, toast]);

  // Fetch tutor availability when tutor and date change
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!tutor || !date) return;

      try {
        setLoading(true);
        const response = await fetch(
          `/api/tutors/availability?tutor_id=${tutor}`,
        );
        const data = await response.json();

        if (response.ok) {
          setTutorAvailability(data.availability || []);
          setBookedSessions(data.bookedSessions || []);
          generateTimeSlots(date, data.availability, data.bookedSessions);
        } else {
          throw new Error(data.error || "Failed to fetch tutor availability");
        }
      } catch (error) {
        console.error("Error fetching tutor availability:", error);
        toast({
          title: "Error",
          description: "Failed to load tutor availability",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [tutor, date, toast]);

  // Generate available time slots based on tutor availability and booked sessions
  const generateTimeSlots = (
    selectedDate: Date,
    availability: any[],
    bookedSessions: any[],
  ) => {
    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = selectedDate.getDay();

    // Filter availability for the selected day
    const dayAvailability = availability.filter(
      (slot) => slot.day_of_week === dayOfWeek,
    );

    if (dayAvailability.length === 0) {
      setTimeSlots([]);
      return;
    }

    // Format the selected date as YYYY-MM-DD for comparison
    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    // Filter booked sessions for the selected date
    const dayBookings = bookedSessions.filter(
      (session) => session.session_date === formattedDate,
    );

    // Generate time slots in 30-minute increments
    const slots: string[] = [];

    dayAvailability.forEach((slot) => {
      const startTime = new Date(`2000-01-01T${slot.start_time}`);
      const endTime = new Date(`2000-01-01T${slot.end_time}`);

      // Generate slots in 30-minute increments
      let currentTime = startTime;
      while (currentTime < endTime) {
        const timeString = format(currentTime, "HH:mm");

        // Check if this time slot conflicts with any booked session
        const isBooked = dayBookings.some((booking) => {
          const bookingStart = new Date(`2000-01-01T${booking.start_time}`);
          const bookingEnd = new Date(`2000-01-01T${booking.start_time}`);
          bookingEnd.setMinutes(bookingEnd.getMinutes() + booking.duration);

          const slotStart = new Date(`2000-01-01T${timeString}`);
          const slotEnd = new Date(`2000-01-01T${timeString}`);
          slotEnd.setMinutes(slotEnd.getMinutes() + parseInt(duration));

          // Check if there's an overlap
          return (
            (slotStart >= bookingStart && slotStart < bookingEnd) ||
            (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
            (slotStart <= bookingStart && slotEnd >= bookingEnd)
          );
        });

        if (!isBooked) {
          slots.push(timeString);
        }

        // Move to next 30-minute slot
        currentTime.setMinutes(currentTime.getMinutes() + 30);
      }
    });

    setTimeSlots(slots);
  };

  const handleBookSession = async () => {
    if (!subject || !tutor || !date || !time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const sessionData = {
        subject,
        tutorId: tutor,
        sessionDate: format(date, "yyyy-MM-dd"),
        startTime: time,
        duration: parseInt(duration),
        notes: notes.trim() || null,
      };

      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Session booked successfully!",
        });

        // Close the dialog and reset form
        setOpen(false);
        resetForm();
      } else {
        throw new Error(data.error || "Failed to book session");
      }
    } catch (error: any) {
      console.error("Error booking session:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to book session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubject("");
    setTutor("");
    setDate(undefined);
    setTime("");
    setDuration("60");
    setNotes("");
    setTutors([]);
    setTimeSlots([]);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button>Book New Session</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
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
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tutor">Tutor</Label>
            <Select
              value={tutor}
              onValueChange={setTutor}
              disabled={!subject || loading}
            >
              <SelectTrigger>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading tutors...</span>
                  </div>
                ) : (
                  <SelectValue
                    placeholder={
                      subject ? "Select a tutor" : "Select a subject first"
                    }
                  />
                )}
              </SelectTrigger>
              <SelectContent>
                {tutors.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.full_name || t.name}
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
                  disabled={!tutor || loading}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Select
                value={time}
                onValueChange={setTime}
                disabled={!date || loading || timeSlots.length === 0}
              >
                <SelectTrigger>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <SelectValue
                      placeholder={
                        timeSlots.length > 0
                          ? "Select time"
                          : "No available slots"
                      }
                    />
                  )}
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

            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any specific requirements or topics you'd like to cover"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleBookSession}
            disabled={!subject || !tutor || !date || !time || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              "Book Session"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
