import { createClient } from "../../../../../supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const { data, error } = await supabase
      .from("users")
      .select(
        `
        id, 
        name, 
        full_name, 
        email,
        role,
        tutor_subjects(id, subject_id, proficiency_level, is_verified)
      `,
      )
      .eq("id", id)
      .eq("role", "tutor")
      .single();

    if (error) {
      console.error("Error fetching tutor:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }

    return NextResponse.json({ tutor: data });
  } catch (error) {
    console.error("Error in tutor retrieval:", error);
    return NextResponse.json(
      { error: "Failed to retrieve tutor" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin or the tutor themselves
    const role = user.user_metadata?.role || "student";
    if (role !== "admin" && user.id !== params.id) {
      return NextResponse.json(
        { error: "You don't have permission to update this tutor" },
        { status: 403 },
      );
    }

    const { id } = params;
    const updates = await request.json();

    // Update the tutor profile
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .eq("role", "tutor")
      .select();

    if (error) {
      console.error("Error updating tutor:", error);
      return NextResponse.json({ error: error.message