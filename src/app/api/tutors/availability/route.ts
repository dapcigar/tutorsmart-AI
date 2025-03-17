import { createClient } from "../../../../../supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const tutorId = url.searchParams.get("tutor_id");

    if (!tutorId) {
      return NextResponse.json(
        { error: "Tutor ID is required" },
        { status: 400 },
      );
    }

    // Get tutor's availability
    const { data: availability, error: availabilityError } = await supabase
      .from("tutor_availability")
      .select("*")
      .eq("tutor_id", tutorId);

    if (availabilityError) {
      console.error("Error fetching tutor availability:", availabilityError);
      return NextResponse.json(
        { error: availabilityError.message },
        { status: 500 },
      );
    }

    // Get tutor's booked sessions to check conflicts
    const { data: bookedSessions, error: sessionsError } = await supabase
      .from("sessions")
      .select("session_date, start_time, duration")
      .eq("tutor_id", tutorId)
      .gte("session_date", new Date().toISOString().split("T")[0]);

    if (sessionsError) {
      console.error("Error fetching booked sessions:", sessionsError);
      return NextResponse.json(
        { error: sessionsError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      availability,
      bookedSessions,
    });
  } catch (error) {
    console.error("Error in tutor availability retrieval:", error);
    return NextResponse.json(
      { error: "Failed to retrieve tutor availability" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only tutors can set their availability
    const role = user.user_metadata?.role || "student";
    if (role !== "tutor") {
      return NextResponse.json(
        { error: "Only tutors can set availability" },
        { status: 403 },
      );
    }

    const { dayOfWeek, startTime, endTime } = await request.json();

    // Validate required fields
    if (dayOfWeek === undefined || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Insert the new availability slot
    const { data, error } = await supabase
      .from("tutor_availability")
      .insert({
        tutor_id: user.id,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
      })
      .select();

    if (error) {
      console.error("Error creating availability slot:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ availability: data[0] }, { status: 201 });
  } catch (error) {
    console.error("Error in availability creation:", error);
    return NextResponse.json(
      { error: "Failed to create availability slot" },
      { status: 500 },
    );
  }
}
