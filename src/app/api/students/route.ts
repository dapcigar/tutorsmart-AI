import { createClient } from "../../../../supabase/server";
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
    const parentId = url.searchParams.get("parent_id");
    const role = user.user_metadata?.role || "student";

    let query = supabase
      .from("users")
      .select("id, name, full_name, email, role")
      .eq("role", "student");

    // If tutor is requesting, only show their students
    if (role === "tutor" && !tutorId) {
      // Get all students who have had sessions with this tutor
      const { data: sessions } = await supabase
        .from("sessions")
        .select("student_id")
        .eq("tutor_id", user.id);

      if (sessions && sessions.length > 0) {
        const studentIds = [...new Set(sessions.map((s) => s.student_id))];
        query = query.in("id", studentIds);
      } else {
        // No students for this tutor
        return NextResponse.json({ students: [] });
      }
    }

    // If parent is requesting, only show their children
    if (role === "parent" && !parentId) {
      // For parents, we need to get their children first
      const { data: children } = await supabase
        .from("student_parent")
        .select("student_id")
        .eq("parent_id", user.id);

      if (children && children.length > 0) {
        const childrenIds = children.map((child) => child.student_id);
        query = query.in("id", childrenIds);
      } else {
        // No children found for this parent
        return NextResponse.json({ students: [] });
      }
    }

    // If specific tutor_id is provided
    if (tutorId) {
      const { data: sessions } = await supabase
        .from("sessions")
        .select("student_id")
        .eq("tutor_id", tutorId);

      if (sessions && sessions.length > 0) {
        const studentIds = [...new Set(sessions.map((s) => s.student_id))];
        query = query.in("id", studentIds);
      } else {
        // No students for this tutor
        return NextResponse.json({ students: [] });
      }
    }

    // If specific parent_id is provided
    if (parentId) {
      const { data: children } = await supabase
        .from("student_parent")
        .select("student_id")
        .eq("parent_id", parentId);

      if (children && children.length > 0) {
        const childrenIds = children.map((child) => child.student_id);
        query = query.in("id", childrenIds);
      } else {
        // No children found for this parent
        return NextResponse.json({ students: [] });
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching students:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ students: data });
  } catch (error) {
    console.error("Error in students retrieval:", error);
    return NextResponse.json(
      { error: "Failed to retrieve students" },
      { status: 500 },
    );
  }
}
