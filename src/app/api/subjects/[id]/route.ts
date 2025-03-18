import { createClient } from "../../../../supabase/server";
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
      .from("subjects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json({ subject: data });
  } catch (error) {
    console.error("Error fetching subject:", error);
    return NextResponse.json(
      { error: "Failed to fetch subject" },
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

    // Get user role from metadata
    const userRole = user.user_metadata?.role || "student";

    // Only admins can update subjects
    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Only administrators can update subjects" },
        { status: 403 },
      );
    }

    const { id } = params;
    const { name, description, level } = await request.json();

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Subject name is required" },
        { status: 400 },
      );
    }

    // Check if subject exists
    const { data: existingSubject, error: checkError } = await supabase
      .from("subjects")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (!existingSubject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    // Update the subject
    const { data, error } = await supabase
      .from("subjects")
      .update({
        name,
        description,
        level,
      })
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ subject: data[0] });
  } catch (error) {
    console.error("Error updating subject:", error);
    return NextResponse.json(
      { error: "Failed to update subject" },
      { status: 500 },
    );
  }
}

export async function DELETE(
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

    // Get user role from metadata
    const userRole = user.user_metadata?.role || "student";

    // Only admins can delete subjects
    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Only administrators can delete subjects" },
        { status: 403 },
      );
    }

    const { id } = params;

    // Check if subject exists
    const { data: existingSubject, error: checkError } = await supabase
      .from("subjects")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (!existingSubject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    // Delete the subject
    const { error } = await supabase.from("subjects").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting subject:", error);
    return NextResponse.json(
      { error: "Failed to delete subject" },
      { status: 500 },
    );
  }
}
