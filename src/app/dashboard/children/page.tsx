import DashboardNavbar from "@/components/dashboard-navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import ChildrenList from "@/components/children-list";
import AddChildForm from "@/components/add-child-form";

export default async function ChildrenPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user role from metadata, default to student if not set
  const userRole = user.user_metadata?.role || "student";

  // If user is not a parent, redirect to dashboard
  if (userRole !== "parent") {
    return redirect("/dashboard");
  }

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Manage Children</h1>
            <p className="text-gray-600">
              Add and manage your children's accounts
            </p>
          </div>
        </div>

        <Tabs defaultValue="children" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="children">My Children</TabsTrigger>
            <TabsTrigger value="add">Add Child</TabsTrigger>
          </TabsList>

          <TabsContent value="children" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Children</CardTitle>
                <CardDescription>
                  View and manage your children's accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChildrenList parentId={user.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Add a Child</CardTitle>
                <CardDescription>
                  Add your child to your account to manage their tutoring
                  sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddChildForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
