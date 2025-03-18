"use client";

import * as React from "react";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimePickerProps {
  time: string;
  setTime: (time: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  timeSlots?: string[];
  startHour?: number;
  endHour?: number;
  interval?: number;
}

export function TimePicker({
  time,
  setTime,
  disabled = false,
  placeholder = "Select time",
  className,
  timeSlots,
  startHour = 8,
  endHour = 20,
  interval = 30,
}: TimePickerProps) {
  // Generate time slots if not provided
  const generatedTimeSlots = React.useMemo(() => {
    if (timeSlots && timeSlots.length > 0) return timeSlots;

    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      const hourStr = hour.toString().padStart(2, "0");
      slots.push(`${hourStr}:00`);
      if (interval === 30) {
        slots.push(`${hourStr}:30`);
      } else if (interval === 15) {
        slots.push(`${hourStr}:15`);
        slots.push(`${hourStr}:30`);
        slots.push(`${hourStr}:45`);
      }
    }
    return slots;
  }, [timeSlots, startHour, endHour, interval]);

  return (
    <Select value={time} onValueChange={setTime} disabled={disabled}>
      <SelectTrigger className={cn("w-full", className)}>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {generatedTimeSlots.map((slot) => (
          <SelectItem key={slot} value={slot}>
            {slot}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
