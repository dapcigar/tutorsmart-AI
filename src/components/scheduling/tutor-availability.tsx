"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Save, Trash2, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

export function TutorAvailability({ tutorId }: { tutorId?: string }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: "1", day: "Monday", startTime: "09:00", endTime: "12:00" },
    { id: "2", day: "Monday", startTime: "14:00", endTime: "17:00" },
    { id: "3", day: "Wednesday", startTime: "10:00", endTime: "15:00" },
    { id: "4", day: "Friday", startTime: "13:00", endTime: "18:00" },
  ]);
  const [newSlot, setNewSlot] = useState<Partial<TimeSlot>>({
    day: "",
    startTime: "",
    endTime: "",
  });
  const [repeatWeekly, setRepeatWeekly] = useState(true);
  const { toast } = useToast();

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const timeOptions = [];
  for (let hour = 8; hour < 20; hour++) {
    const hourStr = hour.toString().padStart(2, "0");
    timeOptions.push(`${hourStr}:00`);
    timeOptions.push(`${hourStr}:30`);
  }

  const handleAddTimeSlot = () => {
    if (!newSlot.day || !newSlot.startTime || !newSlot.endTime) {
      toast({
        title: "Missing information",
        description: "Please select day, start time, and end time",
        variant: "destructive",
      });
      return;
    }

    if (newSlot.startTime >= newSlot.endTime) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.random().toString(36).substring(2, 9);
    setTimeSlots([...timeSlots, { id: newId, ...(newSlot as TimeSlot) }]);
    setNewSlot({ day: "", startTime: "", endTime: "" });

    toast({
      title: "Time slot added",
      description: `Added availability for ${newSlot.day} from ${newSlot.startTime} to ${newSlot.endTime}`,
    });
  };

  const handleRemoveTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
    toast({
      title: "Time slot removed",
      description: "The availability slot has been removed",
    });
  };

  const handleSaveAvailability = () => {
    // In a real app, this would save to the database
    toast({
      title: "Availability saved",
      description: "Your availability has been updated successfully",
    });
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Manage Your Availability
        </CardTitle>
        <CardDescription>
          Set your regular teaching hours and availability for tutoring sessions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Regular Weekly Hours</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Add New Time Slot</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Select
                    value={newSlot.day}
                    onValueChange={(value) =>
                      setNewSlot({ ...newSlot, day: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={newSlot.startTime}
                    onValueChange={(value) =>
                      setNewSlot({ ...newSlot, startTime: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={`start-${time}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={newSlot.endTime}
                    onValueChange={(value) =>
                      setNewSlot({ ...newSlot, endTime: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="End time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={`end-${time}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="repeatWeekly"
                  checked={repeatWeekly}
                  onCheckedChange={(checked) =>
                    setRepeatWeekly(checked as boolean)
                  }
                />
                <label
                  htmlFor="repeatWeekly"
                  className="text-sm font-medium leading-none"
                >
                  Repeat weekly
                </label>
              </div>

              <Button
                onClick={handleAddTimeSlot}
                className="w-full flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Time Slot
              </Button>

              <div className="space-y-2 mt-4">
                <Label>Current Availability</Label>
                {timeSlots.length > 0 ? (
                  <div className="space-y-2">
                    {timeSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex justify-between items-center p-3 border rounded-md"
                      >
                        <div>
                          <p className="font-medium">{slot.day}</p>
                          <p className="text-sm text-gray-600">
                            {slot.startTime} - {slot.endTime}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTimeSlot(slot.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-2">
                    No availability slots set
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Specific Date Exceptions</h3>
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />

              {selectedDate && (
                <div className="space-y-3">
                  <h4 className="font-medium">
                    {selectedDate.toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h4>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="unavailable" />
                    <label
                      htmlFor="unavailable"
                      className="text-sm font-medium leading-none"
                    >
                      Mark as unavailable
                    </label>
                  </div>

                  <div className="space-y-2">
                    <Label>Custom Hours (Optional)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Start time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem
                              key={`custom-start-${time}`}
                              value={time}
                            >
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="End time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={`custom-end-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button className="w-full">Add Exception</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSaveAvailability}
          className="w-full flex items-center gap-1"
        >
          <Save className="h-4 w-4" />
          Save Availability Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
