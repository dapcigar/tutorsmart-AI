import { createClient } from "../../../../../supabase/server";
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

    const { subject, studentId } = await request.json();

    // Validate required fields
    if (!subject) {
      return NextResponse.json(
        { error: "Subject is required" },
        { status: 400 },
      );
    }

    // Check permissions if studentId is provided and not the current user
    if (studentId && studentId !== user.id) {
      const role = user.user_metadata?.role || "student";

      if (role === "student") {
        return NextResponse.json(
          { error: "You can only get recommendations for yourself" },
          { status: 403 },
        );
      }

      if (role === "parent") {
        // Check if this student is a child of the parent
        const { data: children } = await supabase
          .from("student_parent")
          .select("student_id")
          .eq("parent_id", user.id)
          .eq("student_id", studentId);

        if (!children || children.length === 0) {
          return NextResponse.json(
            { error: "You can only get recommendations for your children" },
            { status: 403 },
          );
        }
      }

      if (role === "tutor") {
        // Check if this student has had sessions with this tutor
        const { data: sessions } = await supabase
          .from("sessions")
          .select("id")
          .eq("tutor_id", user.id)
          .eq("student_id", studentId)
          .limit(1);

        if (!sessions || sessions.length === 0) {
          return NextResponse.json(
            { error: "You can only get recommendations for your students" },
            { status: 403 },
          );
        }
      }
    }

    // In a real app, this would call an AI service
    // For now, using mock data
    const mockRecommendations = [
      {
        id: 1,
        title: "Introduction to Calculus",
        type: "video",
        description:
          "A comprehensive video series covering the basics of calculus",
        url: "https://example.com/calculus-intro",
      },
      {
        id: 2,
        title: "Advanced Problem Solving Techniques",
        type: "practice",
        description: "Interactive exercises to improve problem-solving skills",
        url: "https://example.com/problem-solving",
      },
      {
        id: 3,
        title: "Mathematical Thinking: A Comprehensive Guide",
        type: "book",
        description: "An e-book that develops mathematical reasoning skills",
        url: "https://example.com/math-thinking",
      },
      {
        id: 4,
        title: "Real-world Applications of Mathematics",
        type: "article",
        description:
          "Learn how mathematical concepts apply to everyday situations",
        url: "https://example.com/math-applications",
      },
    ];

    return NextResponse.json({ recommendations: mockRecommendations });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate learning recommendations" },
      { status: 500 },
    );
  }
}
