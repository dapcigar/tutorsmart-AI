"use client";

import { useState, useEffect } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TutorOnboarding } from "@/components/admin/tutor-onboarding";
import { Search, Loader2, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function TutorsPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { toast } = useToast();

  // Mock data for tutors
  const mockTutors = [
    {
      id: 1,
      name: "Dr. Smith",
      email: "smith@example.com",
      subjects: ["Mathematics", "Physics"],
      status: "Active",
      joinDate: "2023-01-15",
      rating: 4.8,
      sessionsCompleted: 45,
    },
    {
      id: 2,
      name: "Prof. Johnson",
      email: "johnson@example.com",
      subjects: ["Physics", "Chemistry"],
      status: "Active",
      joinDate: "2023-02-10",
      rating: 4.6,
      sessionsCompleted: 32,
    },
    {
      id: 3,
      name: "Ms. Williams",
      email: "williams@example.com",
      subjects: ["Biology", "Chemistry"],
      status: "Pending",
      joinDate: "2023-06-05",
      rating: 0,
      sessionsCompleted: 0,
    },
    {
      id: 4,
      name: "Mr. Davis",
      email: "davis@example.com",
      subjects: ["English", "History"],
      status: "Active",
      joinDate: "2023-03-20",
      rating: 4.9,
      sessionsCompleted: 28,
    },
    {
      id: 5,
      name: "Dr. Miller",
      email: "miller@example.com",
      subjects: ["Computer Science", "Mathematics"],
      status: "Inactive",
      joinDate: "2023-01-05",
      rating: 4.2,
      sessionsCompleted: 15,
    },
  ];

  // Mock subjects for filter
  const subjects = [
    "All Subjects",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Computer Science",
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTutors(mockTutors);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTutorAdded = (tutor: any) => {
    setTutors([...tutors, { ...tutor, id: tutors.length + 1 }]);
    setShowOnboarding(false);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTutors = tutors.filter((tutor) => {
    const matchesSearch = tutor.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || tutor.status.toLowerCase() === statusFilter;
    const matchesSubject =
      subjectFilter === "all" ||
      tutor.subjects.some(
        (s: string) => s.toLowerCase() === subjectFilter.toLowerCase(),
      );

    return matchesSearch && matchesStatus && matchesSubject;
  });

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tutor Management</h1>
          <Button onClick={() => setShowOnboarding(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Add Tutor
          </Button>
        </div>

        {showOnboarding ? (
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => setShowOnboarding(false)}
              className="mb-4"
            >
              Back to Tutor List
            </Button>
            <TutorOnboarding onTutorAdded={handleTutorAdded} />
          </div>
        ) : (
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search tutors..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <div className="w-40">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-48">
                  <Select
                    value={subjectFilter}
                    onValueChange={setSubjectFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem
                          key={subject}
                          value={subject === "All Subjects" ? "all" : subject}
                        >
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading tutors...</span>
              </div>
            ) : filteredTutors.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Sessions</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTutors.map((tutor) => (
                      <TableRow key={tutor.id}>
                        <TableCell className="font-medium">
                          {tutor.name}
                        </TableCell>
                        <TableCell>{tutor.email}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {tutor.subjects.map((subject: string) => (
                              <Badge
                                key={subject}
                                variant="outline"
                                className="bg-blue-50"
                              >
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeClass(tutor.status)}>
                            {tutor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {tutor.rating > 0 ? (
                            <div className="flex items-center">
                              {tutor.rating}
                              <span className="text-yellow-500 ml-1">★</span>
                            </div>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>{tutor.sessionsCompleted}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No tutors found</h3>
                <p className="mt-2 text-gray-500">
                  {searchQuery ||
                  statusFilter !== "all" ||
                  subjectFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Get started by adding a new tutor"}
                </p>
                {!searchQuery &&
                  statusFilter === "all" &&
                  subjectFilter === "all" && (
                    <Button
                      onClick={() => setShowOnboarding(true)}
                      className="mt-4"
                    >
                      <UserPlus className="mr-2 h-4 w-4" /> Add Tutor
                    </Button>
                  )}
              </div>
            )}
          </Card>
        )}
      </main>
    </>
  );
}
