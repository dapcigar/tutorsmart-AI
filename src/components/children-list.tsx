"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "../../supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  UserCircle,
  Calendar,
  BookOpen,
  BarChart,
} from "lucide-react";
import Link from "next/link";

interface Child {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  grade: string;
  created_at: string;
}

export default function ChildrenList({ parentId }: { parentId: string }) {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const supabase = createClient();

  const fetchChildren = async () => {
    try {
      setLoading(true);

      // Get children linked to this parent
      const { data, error } = await supabase
        .from("parent_child_relationships")
        .select(
          `
          child_id,
          children:child_id(id, first_name, last_name, email, grade, created_at)
        `,
        )
        .eq("parent_id", parentId);

      if (error) throw error;

      // Transform the data to get the children objects
      const childrenData = data
        .map((item) => item.children as Child)
        .filter(Boolean);

      setChildren(childrenData);
    } catch (error: any) {
      console.error("Error fetching children:", error);
      toast({
        title: "Error",
        description: "Failed to load your children. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, [parentId]);

  const handleRemoveChild = async (childId: string) => {
    if (
      !confirm("Are you sure you want to remove this child from your account?")
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("parent_child_relationships")
        .delete()
        .eq("parent_id", parentId)
        .eq("child_id", childId);

      if (error) throw error;

      toast({
        title: "Child removed",
        description: "The child has been removed from your account.",
      });

      // Refresh the list
      fetchChildren();
    } catch (error: any) {
      console.error("Error removing child:", error);
      toast({
        title: "Error",
        description: "Failed to remove child. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading children...</span>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="text-center py-12">
        <UserCircle className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-4 text-lg font-medium">No children found</h3>
        <p className="mt-2 text-gray-500">
          You haven't added any children to your account yet.
        </p>
        <Button
          className="mt-4"
          onClick={() => document.querySelector('[value="add"]')?.click()}
        >
          Add a Child
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {children.map((child) => (
        <Card key={child.id} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">
                {child.first_name} {child.last_name}
              </h3>
              <p className="text-gray-600">{child.email}</p>
              <p className="text-gray-600">Grade: {child.grade}</p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/progress?student_id=${child.id}`}>
                    <BarChart className="h-4 w-4 mr-1" />
                    Progress
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/sessions?student_id=${child.id}`}>
                    <Calendar className="h-4 w-4 mr-1" />
                    Sessions
                  </Link>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleRemoveChild(child.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
