"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  MessageSquare,
  Video,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface SessionDetailsProps {
  sessionId: string;
  userRole?: string;
}

export default function SessionDetails({
  sessionId,
  userRole = "student",
}: SessionDetailsProps) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("sessions")
          .select(
            `
            *,
            tutor:tutor_id(id, name, full_name, email),
            student:student_id(id, name, full_name, email)
          `,
          )
          .eq("id", sessionId)
          .single();

        if (error) throw error;

        setSession(data);
      } catch (error: any) {
        console.error("Error fetching session details:", error);
        toast({
          title: "Error",
          description: "Failed to load session details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSessionDetails();
    }
  }, [sessionId, supabase, toast]);

  const handleCancelSession = async () => {
    if (!cancelReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for cancellation",
        variant: "destructive",
      });
      return;
    }

    try {
      setCancelLoading(true);

      const { error } = await supabase
        .from("sessions")
        .update({
          status: "cancelled",
          notes: `${session.notes ? session.notes + "\n\n" : ""}Cancellation reason: ${cancelReason}`,
        })
        .eq("id", sessionId);

      if (error) throw error;

      toast({
        title: "Session cancelled",
        description: "The session has been cancelled successfully",
      });

      setCancelDialogOpen(false);
      router.refresh();

      // Refresh the session data
      const { data, error: fetchError } = await supabase
        .from("sessions")
        .select(
          `
          *,
          tutor:tutor_id(id, name, full_name, email),
          student:student_id(id, name, full_name, email)
        `,
        )
        .eq("id", sessionId)
        .single();

      if (!fetchError) {
        setSession(data);
      }
    } catch (error: any) {
      console.error("Error cancelling session:", error);
      toast({
        title: "Error",
        description: "Failed to cancel session",
        variant: "destructive",
      });
    } finally {
      setCancelLoading(false);
    }
  };

  const handleCompleteSession = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("sessions")
        .update({
          status: "completed",
        })
        .eq("id", sessionId);

      if (error) throw error;

      toast({
        title: "Session completed",
        description: "The session has been marked as completed",
      });

      router.refresh();

      // Refresh the session data
      const { data, error: fetchError } = await supabase
        .from("sessions")
        .select(
          `
          *,
          tutor:tutor_id(id, name, full_name, email),
          student:student_id(id, name, full_name, email)
        `,
        )
        .eq("id", sessionId)
        .single();

      if (!fetchError) {
        setSession(data);
      }
    } catch (error: any) {
      console.error("Error completing session:", error);
      toast({
        title: "Error",
        description: "Failed to mark session as completed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading session details...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Session not found</h3>
            <p className="text-gray-500 mt-2">
              The requested session could not be found or you don't have
              permission to view it.
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push("/dashboard/sessions")}
            >
              Back to Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sessionDate = new Date(session.session_date);
  const formattedDate = sessionDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Scheduled
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Cancelled
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{session.subject} Session</CardTitle>
            <CardDescription>
              Session ID: {session.id.substring(0, 8)}
            </CardDescription>
          </div>
          {getStatusBadge(session.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-gray-600">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-gray-600">
                    {session.start_time} ({session.duration} minutes)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Subject</p>
                  <p className="text-gray-600">{session.subject}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">
                    {userRole === "tutor" ? "Student" : "Tutor"}
                  </p>
                  <p className="text-gray-600">
                    {userRole === "tutor"
                      ? session.student.full_name || session.student.name
                      : session.tutor.full_name || session.tutor.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Notes</p>
                  <p className="text-gray-600">
                    {session.notes || "No notes provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {session.status === "scheduled" && (
            <div className="mt-6 border-t pt-6">
              <h3 className="font-medium mb-4">Session Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Join Video Call
                </Button>

                <Dialog
                  open={cancelDialogOpen}
                  onOpenChange={setCancelDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel Session</DialogTitle>
                      <DialogDescription>
                        Please provide a reason for cancelling this session.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Textarea
                        placeholder="Reason for cancellation"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setCancelDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleCancelSession}
                        disabled={cancelLoading}
                      >
                        {cancelLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          "Confirm Cancellation"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {userRole === "tutor" && (
                  <Button
                    className="flex items-center gap-2"
                    onClick={handleCompleteSession}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark as Completed
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/sessions")}
        >
          Back to Sessions
        </Button>
      </CardFooter>
    </Card>
  );
}
