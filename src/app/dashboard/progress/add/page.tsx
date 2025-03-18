import DashboardNavbar from "@/components/dashboard-navbar";
import { AddProgressRecord } from "@/components/progress/add-progress-record";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";

export default async function AddProgressPage({
  searchParams,
}: {
  searchParams: { student_id?: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user role from metadata, default to student if not set
  const userRole = user.user_metadata?.role || "student";

  // Only tutors and admins can add progress records
  if (userRole !== "tutor" && userRole !== "admin") {
    return redirect("/dashboard");
  }

  // If a specific student is requested, verify permissions
  if (searchParams.student_id && userRole === "tutor") {
    // Verify this student has sessions with this tutor
    const { data: sessions, error } = await supabase
      .from("sessions")
      .select("id")
      .eq("tutor_id", user.id)
      .eq("student_id", searchParams.student_id)
      .limit(1);

    if (error || !sessions || sessions.length === 0) {
      return redirect("/dashboard");
    }
  }

  // Get student name if student_id is provided
  let studentName = "";
  if (searchParams.student_id) {
    const { data: student } = await supabase
      .from("users")
      .select("name, full_name")
      .eq("id", searchParams.student_id)
      .single();

    if (student) {
      studentName = student.full_name || student.name || "";
    }
  }

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              {studentName
                ? `Add Progress for ${studentName}`
                : "Add Progress Record"}
            </h1>
            <p className="text-gray-600">
              Record assessment results and track student progress
            </p>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Progress Details</CardTitle>
            <CardDescription>
              Enter the details of the assessment or progress record
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddProgressRecord
              studentId={searchParams.student_id}
              onSuccess={() => redirect("/dashboard/progress")}
            />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
