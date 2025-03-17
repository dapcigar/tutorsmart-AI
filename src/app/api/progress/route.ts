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
    const studentId = url.searchParams.get("student_id") || user.id;
    const subject = url.searchParams.get("subject");
    const timeframe = url.searchParams.get("timeframe") || "3months";

    // Check if user has permission to view this student's progress
    const role = user.user_metadata?.role || "student";
    if (role === "student" && studentId !== user.id) {
      return NextResponse.json(
        { error: "You can only view your own progress" },
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
          { error: "You can only view your children's progress" },
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
          { error: "You can only view progress for your students" },
          { status: 403 },
        );
      }
    }

    // In a real app, this would fetch from a progress/assessments table
    // For now, using mock data
    const mockProgress = {
      student: {
        id: studentId,
        name: "Alex Johnson",
      },
      summary: {
        averageScore: 76,
        improvement: 12,
        completedTasks: 24,
      },
      chartData: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Quiz Scores",
            data: [65, 72, 78, 75, 82, 88],
          },
          {
            label: "Assignments Completed",
            data: [3, 5, 4, 6, 5, 7],
          },
        ],
      },
      achievements: [
        {
          id: "math-master",
          title: "Math Master",
          description:
            "Complete 10 math sessions with a score of 80% or higher",
          earned: true,
          earnedDate: "2023-05-15",
        },
        {
          id: "quick-learner",
          title: "Quick Learner",
          description: "Finish 5 assignments ahead of schedule",
          earned: true,
          earnedDate: "2023-04-22",
        },
        {
          id: "perfect-attendance",
          title: "Perfect Attendance",
          description: "Attend 15 consecutive sessions without missing any",
          earned: false,
          progress: 12,
          total: 15,
        },
      ],
    };

    return NextResponse.json({ progress: mockProgress });
  } catch (error) {
    console.error("Error in progress retrieval:", error);
    return NextResponse.json(
      { error: "Failed to retrieve progress data" },
      { status: 500 },
    );
  }
}
