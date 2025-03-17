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

    // In a real app, this would fetch from a subjects table
    // For now, using mock data
    const subjects = [
      { id: "Mathematics", name: "Mathematics" },
      { id: "Physics", name: "Physics" },
      { id: "Chemistry", name: "Chemistry" },
      { id: "Biology", name: "Biology" },
      { id: "English", name: "English" },
      { id: "History", name: "History" },
      { id: "Computer Science", name: "Computer Science" },
    ];

    return NextResponse.json({ subjects });
  } catch (error) {
    console.error("Error in subjects retrieval:", error);
    return NextResponse.json(
      { error: "Failed to retrieve subjects" },
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

    // Check if user is admin
    const role = user.user_metadata?.role || "student";
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can create subjects" },
        { status: 403 },
      );
    }

    const { name, description, level } = await request.json();

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Subject name is required" },
        { status: 400 },
      );
    }

    // In a real app, this would insert into a subjects table
    // For now, just return success
    return NextResponse.json(
      { success: true, subject: { id: name, name, description, level } },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating subject:", error);
    return NextResponse.json(
      { error: "Failed to create subject" },
      { status: 500 },
    );
  }
}
