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
    const subject = url.searchParams.get("subject");

    let query = supabase
      .from("users")
      .select(
        `
        id, 
        name, 
        full_name, 
        email,
        tutor_subjects(subject_id)
      `,
      )
      .eq("role", "tutor");

    if (subject) {
      query = query.eq("tutor_subjects.subject_id", subject);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching tutors:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tutors: data });
  } catch (error) {
    console.error("Error in tutors retrieval:", error);
    return NextResponse.json(
      { error: "Failed to retrieve tutors" },
      { status: 500 },
    );
  }
}
