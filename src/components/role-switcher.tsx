"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { createClient } from "../../supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type UserRole = "student" | "tutor" | "parent" | "admin";

export default function RoleSwitcher({ currentRole }: { currentRole: string }) {
  const [role, setRole] = useState<UserRole>(currentRole as UserRole);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();

  const updateUserRole = async (newRole: UserRole) => {
    if (newRole === role) return;

    try {
      setIsLoading(true);
      // Update the user's metadata with the new role
      const { error } = await supabase.auth.updateUser({
        data: { role: newRole },
      });

      if (error) {
        throw error;
      }

      setRole(newRole);
      toast({
        title: "Role updated",
        description: `You are now viewing as a ${newRole}.`,
      });

      // Refresh the page to reflect the new role
      router.refresh();
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast({
        title: "Error updating role",
        description:
          error.message || "An error occurred while updating your role.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <span className="capitalize">
            {isLoading ? "Updating..." : `${role} View`}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => updateUserRole("student")}>
          Student View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateUserRole("tutor")}>
          Tutor View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateUserRole("parent")}>
          Parent View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateUserRole("admin")}>
          Admin View
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
