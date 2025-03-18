"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "../../supabase/client";

const formSchema = z.object({
  studentId: z.string({
    required_error: "Please select a student",
  }),
  subjectId: z.string({
    required_error: "Please select a subject",
  }),
  assessmentType: z.string({
    required_error: "Please select an assessment type",
  }),
  score: z.coerce
    .number()
    .min(0, "Score must be a positive number")
    .max(z.coerce.number().optional(), {
      message: "Score cannot exceed maximum score",
    }),
  maxScore: z.coerce.number().min(1, "Maximum score must be at least 1"),
  completedAt: z.date().optional(),
});

interface AddProgressRecordProps {
  studentId?: string;
  onSuccess?: () => void;
}

export function AddProgressRecord({
  studentId,
  onSuccess,
}: AddProgressRecordProps) {
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: studentId || "",
      subjectId: "",
      assessmentType: "",
      score: 0,
      maxScore: 100,
      completedAt: new Date(),
    },
  });

  // Watch the maxScore to update the score validation
  const maxScore = form.watch("maxScore");
  useEffect(() => {
    form.trigger("score");
  }, [maxScore, form]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);

        // Fetch students if no studentId is provided
        if (!studentId) {
          const { data: userData } = await supabase.auth.getUser();
          const userRole = userData.user?.user_metadata?.role || "student";

          if (userRole === "tutor") {
            // Fetch students who have had sessions with this tutor
            const { data: sessions, error: sessionsError } = await supabase
              .from("sessions")
              .select("student_id")
              .eq("tutor_id", userData.user?.id);

            if (!sessionsError && sessions) {
              const studentIds = Array.from(
                new Set(sessions.map((s) => s.student_id)),
              );

              if (studentIds.length > 0) {
                const { data: studentsData, error: studentsError } =
                  await supabase
                    .from("users")
                    .select("id, name, full_name")
                    .in("id", studentIds);

                if (!studentsError) {
                  setStudents(studentsData || []);
                }
              }
            }
          } else if (userRole === "parent") {
            // Fetch parent's children
            const { data: children, error: childrenError } = await supabase
              .from("parent_child_relationships")
              .select(
                `
                child_id,
                children:child_id(id, name, full_name)
              `,
              )
              .eq("parent_id", userData.user?.id);

            if (!childrenError && children) {
              const childrenData = children
                .map((item) => item.children)
                .filter(Boolean);
              setStudents(childrenData);
            }
          } else if (userRole === "admin") {
            // Admins can see all students
            const { data: studentsData, error: studentsError } = await supabase
              .from("users")
              .select("id, name, full_name")
              .eq("role", "student");

            if (!studentsError) {
              setStudents(studentsData || []);
            }
          }
        }

        // Fetch subjects
        const { data: subjectsData, error: subjectsError } = await supabase
          .from("subjects")
          .select("id, name")
          .order("name");

        if (!subjectsError) {
          setSubjects(subjectsData || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [studentId, supabase, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: values.studentId,
          subjectId: values.subjectId,
          assessmentType: values.assessmentType,
          score: values.score,
          maxScore: values.maxScore,
          completedAt: values.completedAt?.toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add progress record");
      }

      toast({
        title: "Success",
        description: "Progress record added successfully",
      });

      form.reset({
        studentId: values.studentId, // Keep the same student
        subjectId: "",
        assessmentType: "",
        score: 0,
        maxScore: 100,
        completedAt: new Date(),
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error adding progress record:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add progress record",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  const assessmentTypes = [
    { id: "quiz", name: "Quiz" },
    { id: "test", name: "Test" },
    { id: "assignment", name: "Assignment" },
    { id: "project", name: "Project" },
    { id: "exam", name: "Exam" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {!studentId && (
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.full_name || student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assessmentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assessment Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {assessmentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="score"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Score</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max={form.getValues("maxScore")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Score</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="completedAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Completion Date</FormLabel>
              <DatePicker
                date={field.value}
                setDate={field.onChange}
                disabledDates={{ after: new Date() }}
              />
              <FormDescription>
                The date when the assessment was completed
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Add Progress Record"
          )}
        </Button>
      </form>
    </Form>
  );
}
