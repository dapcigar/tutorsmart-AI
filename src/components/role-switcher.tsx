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

type UserRole = "student" | "tutor" | "parent" | "admin";

export default function RoleSwitcher({ currentRole }: { currentRole: string }) {
  const [role, setRole] = useState<UserRole>(currentRole as UserRole);
  const supabase = createClient();

  const updateUserRole = async (newRole: UserRole) => {
    try {
      // Update the user's metadata with the new role
      const { error } = await supabase.auth.updateUser({
        data: { role: newRole },
      });

      if (error) {
        console.error("Error updating role:", error);
        return;
      }

      setRole(newRole);
      // Refresh the page to reflect the new role
      window.location.reload();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <span className="capitalize">{role} View</span>
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
