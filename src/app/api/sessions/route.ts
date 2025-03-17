import { createClient } from "../../../../supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      subject,
      tutorId,
      sessionDate,
      startTime,
      duration = 60,
      notes,
    } = await request.json();

    // Validate required fields
    if (!subject || !tutorId || !sessionDate || !startTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Insert the new session
    const { data, error } = await supabase
      .from("sessions")
      .insert({
        student_id: user.id,
        tutor_id: tutorId,
        subject,
        session_date: sessionDate,
        start_time: startTime,
        duration,
        notes,
        status: "scheduled",
      })
      .select();

    if (error) {
      console.error("Error creating session:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ session: data[0] }, { status: 201 });
  } catch (error) {
    console.error("Error in session creation:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 },
    );
  }
}

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
    const role = user.user_metadata?.role || "student";

    let query = supabase.from("sessions").select(`
      *,
      tutor:tutor_id(id, name, full_name, email),
      student:student_id(id, name, full_name, email)
    `);

    // Filter based on user role
    if (role === "student") {
      query = query.eq("student_id", user.id);
    } else if (role === "tutor") {
      query = query.eq("tutor_id", user.id);
    } else if (role === "parent") {
      // For parents, we need to get their children first
      const { data: children } = await supabase
        .from("student_parent")
        .select("student_id")
        .eq("parent_id", user.id);

      if (children && children.length > 0) {
        const childrenIds = children.map((child) => child.student_id);
        query = query.in("student_id", childrenIds);
      } else {
        // No children found for this parent
        return NextResponse.json({ sessions: [] });
      }
    }

    // Apply additional filters if provided
    const status = url.searchParams.get("status");
    if (status) {
      query = query.eq("status", status);
    }

    const fromDate = url.searchParams.get("from");
    if (fromDate) {
      query = query.gte("session_date", fromDate);
    }

    const toDate = url.searchParams.get("to");
    if (toDate) {
      query = query.lte("session_date", toDate);
    }

    // Order by date and time
    query = query.order("session_date").order("start_time");

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching sessions:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ sessions: data });
  } catch (error) {
    console.error("Error in session retrieval:", error);
    return NextResponse.json(
      { error: "Failed to retrieve sessions" },
      { status: 500 },
    );
  }
}
