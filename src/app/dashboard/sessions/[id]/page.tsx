"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import {
  CalendarIcon,
  Clock,
  User,
  BookOpen,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function SessionDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchSessionDetails();
  }, []);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sessions/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setSession(data.session);
        setNotes(data.session.notes || "");
      } else {
        throw new Error(data.error || "Failed to fetch session details");
      }
    } catch (error: any) {
      console.error("Error fetching session details:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load session details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/sessions/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        setSession({ ...session, status: newStatus });
        toast({
          title: "Success",
          description: `Session ${newStatus.toLowerCase()} successfully`,
        });
      } else {
        throw new Error(data.error || "Failed to update session");
      }
    } catch (error: any) {
      console.error("Error updating session:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update session",
        variant: "destructive",
      });
    }
  };

  const saveNotes = async () => {
    try {
      setSavingNotes(true);
      const response = await fetch(`/api/sessions/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      const data = await response.json();

      if (response.ok) {
        setSession({ ...session, notes });
        toast({
          title: "Success",
          description: "Session notes saved successfully",
        });
      } else {
        throw new Error(data.error || "Failed to save notes");
      }
    } catch (error: any) {
      console.error("Error saving notes:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save notes",
        variant: "destructive",
      });
    } finally {
      setSavingNotes(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-blue-500 hover:bg-blue-600";
      case "completed":
        return "bg-green-500 hover:bg-green-600";
      case "cancelled":
        return "bg-red-500 hover:bg-red-600";
      case "in progress":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  if (loading) {
    return (
      <>
        <DashboardNavbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading session details...</span>
          </div>
        </main>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <DashboardNavbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Session Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The session you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <Button onClick={() => router.push("/dashboard/sessions")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sessions
            </Button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/sessions")}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-2xl font-bold">Session Details</h1>
          <Badge className={`ml-4 ${getStatusBadgeClass(session.status)}`}>
            {session.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Session Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-4">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Subject</p>
                    <p className="font-medium">{session.subject}</p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {new Date(session.session_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">
                      {session.start_time} ({session.duration} minutes)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tutor</p>
                    <p className="font-medium">
                      {session.tutor?.full_name ||
                        session.tutor?.name ||
                        "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Student</p>
                    <p className="font-medium">
                      {session.student?.full_name ||
                        session.student?.name ||
                        "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {new Date(session.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <Label htmlFor="notes" className="text-base font-semibold">
                Session Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this session..."
                className="mt-2 min-h-[150px]"
              />
              <Button
                onClick={saveNotes}
                className="mt-4"
                disabled={savingNotes}
              >
                {savingNotes ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Notes"
                )}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-4">
              {session.status === "scheduled" && (
                <>
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600"
                    onClick={() => handleStatusChange("completed")}
                  >
                    Mark as Completed
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-500 hover:text-red-700"
                    onClick={() => handleStatusChange("cancelled")}
                  >
                    Cancel Session
                  </Button>
                </>
              )}
              {session.status === "cancelled" && (
                <Button
                  className="w-full"
                  onClick={() => handleStatusChange("scheduled")}
                >
                  Reschedule Session
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/dashboard/sessions")}
              >
                Back to All Sessions
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
