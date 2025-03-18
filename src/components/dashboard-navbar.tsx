"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  UserCircle,
  Home,
  Calendar,
  BookOpen,
  MessageSquare,
  Settings,
  Brain,
  Clock,
  Users,
  GraduationCap,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" prefetch className="text-xl font-bold">
            Logo
          </Link>
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/dashboard" prefetch>
              <Button
                variant={
                  isActive("/dashboard") && !isActive("/dashboard/sessions")
                    ? "default"
                    : "ghost"
                }
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/sessions" prefetch>
              <Button
                variant={isActive("/dashboard/sessions") ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Sessions
              </Button>
            </Link>
            <Link href="/dashboard/availability" prefetch>
              <Button
                variant={
                  isActive("/dashboard/availability") ? "default" : "ghost"
                }
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Availability
              </Button>
            </Link>
            <Link href="/dashboard/ai" prefetch>
              <Button
                variant={isActive("/dashboard/ai") ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                AI Tools
              </Button>
            </Link>
            <Link href="/dashboard/children" prefetch>
              <Button
                variant={isActive("/dashboard/children") ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                My Children
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/sessions")}
              >
                Sessions
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/availability")}
              >
                Availability
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/ai")}>
                AI Tools
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/progress")}
              >
                Progress
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/children")}
              >
                My Children
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.refresh();
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
