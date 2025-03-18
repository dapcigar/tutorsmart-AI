"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "../../supabase/client";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  grade: z.string({
    required_error: "Please select a grade.",
  }),
});

export default function AddChildForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      grade: "",
    },
  });

  const grades = [
    "Kindergarten",
    "1st Grade",
    "2nd Grade",
    "3rd Grade",
    "4th Grade",
    "5th Grade",
    "6th Grade",
    "7th Grade",
    "8th Grade",
    "9th Grade",
    "10th Grade",
    "11th Grade",
    "12th Grade",
  ];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to add a child");
      }

      // Check if child already exists with this email
      const { data: existingUsers, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("email", values.email)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 is the error code for no rows returned
        throw new Error("Error checking if user exists");
      }

      let childId;

      if (existingUsers) {
        childId = existingUsers.id;
      } else {
        // Create a new user for the child
        const { data: newChild, error: createError } = await supabase
          .from("users")
          .insert({
            email: values.email,
            first_name: values.firstName,
            last_name: values.lastName,
            grade: values.grade,
            role: "student",
          })
          .select("id")
          .single();

        if (createError) {
          throw new Error("Failed to create child account");
        }

        childId = newChild.id;
      }

      // Link child to parent
      const { error: linkError } = await supabase
        .from("parent_child_relationships")
        .insert({
          parent_id: user.id,
          child_id: childId,
        });

      if (linkError) {
        // Check if it's a duplicate entry error
        if (linkError.code === "23505") {
          // PostgreSQL unique violation code
          toast({
            title: "Child already linked",
            description: "This child is already linked to your account.",
          });
          if (onSuccess) onSuccess();
          return;
        }
        throw new Error("Failed to link child to parent");
      }

      toast({
        title: "Child added successfully",
        description: "Your child has been added to your account.",
      });

      form.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error adding child:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add child. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormDescription>
                If your child already has an account, enter their email to link
                them to your account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a grade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Adding Child..." : "Add Child"}
        </Button>
      </form>
    </Form>
  );
}
