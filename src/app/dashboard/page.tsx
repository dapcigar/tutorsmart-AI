import DashboardNavbar from "@/components/dashboard-navbar";
import StudentDashboard from "@/components/dashboard/student-dashboard";
import TutorDashboard from "@/components/dashboard/tutor-dashboard";
import ParentDashboard from "@/components/dashboard/parent-dashboard";
import AdminDashboard from "@/components/dashboard/admin-dashboard";
import RoleSwitcher from "@/components/role-switcher";
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

  // Get user role from metadata, default to student if not set
  const userRole = user.user_metadata?.role || "student"; // Options: "student", "tutor", "parent", "admin"

  return (
    <>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
            </h1>
            <RoleSwitcher currentRole={userRole} />
          </div>

          {userRole === "student" && <StudentDashboard />}
          {userRole === "tutor" && <TutorDashboard />}
          {userRole === "parent" && <ParentDashboard />}
          {userRole === "admin" && <AdminDashboard />}
        </div>
      </main>
    </>
  );
}
