import DashboardNavbar from "@/components/dashboard-navbar";
import StudentDashboard from "@/components/dashboard/student-dashboard";
import TutorDashboard from "@/components/dashboard/tutor-dashboard";
import ParentDashboard from "@/components/dashboard/parent-dashboard";
import { InfoIcon, UserCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // In a real implementation, we would fetch the user's role from the database
  // For now, we'll default to student dashboard
  // This would be determined by user metadata or a separate table in the database
  const userRole = "student"; // Options: "student", "tutor", "parent", "admin"

  return (
    <>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {userRole === "student" && <StudentDashboard />}
          {userRole === "tutor" && <TutorDashboard />}
          {userRole === "parent" && <ParentDashboard />}
          {userRole === "admin" && (
            <>
              <header className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
                  <InfoIcon size="14" />
                  <span>Admin dashboard is under development</span>
                </div>
              </header>

              <section className="bg-card rounded-xl p-6 border shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <UserCircle size={48} className="text-primary" />
                  <div>
                    <h2 className="font-semibold text-xl">User Profile</h2>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 overflow-hidden">
                  <pre className="text-xs font-mono max-h-48 overflow-auto">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}
