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
import { Search, Loader2, UserPlus, BookOpen } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const { toast } = useToast();

  // Mock data for students
  const mockStudents = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex@example.com",
      grade: "10th",
      subjects: ["Mathematics", "Physics"],
      joinDate: "2023-03-20",
      sessionsCompleted: 12,
      upcomingSessions: 2,
    },
    {
      id: 2,
      name: "Emma Williams",
      email: "emma@example.com",
      grade: "11th",
      subjects: ["Physics", "Chemistry"],
      joinDate: "2023-04-15",
      sessionsCompleted: 8,
      upcomingSessions: 1,
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      grade: "9th",
      subjects: ["Chemistry", "Biology"],
      joinDate: "2023-05-10",
      sessionsCompleted: 15,
      upcomingSessions: 3,
    },
    {
      id: 4,
      name: "Sophia Davis",
      email: "sophia@example.com",
      grade: "12th",
      subjects: ["Mathematics", "English"],
      joinDate: "2023-02-25",
      sessionsCompleted: 20,
      upcomingSessions: 0,
    },
    {
      id: 5,
      name: "James Wilson",
      email: "james@example.com",
      grade: "10th",
      subjects: ["History", "English"],
      joinDate: "2023-03-05",
      sessionsCompleted: 10,
      upcomingSessions: 1,
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
  ];

  // Mock grades for filter
  const grades = [
    "All Grades",
    "9th",
    "10th",
    "11th",
    "12th",
    "College Freshman",
    "College Sophomore",
    "College Junior",
    "College Senior",
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStudents(mockStudents);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === "all" || student.grade === gradeFilter;
    const matchesSubject =
      subjectFilter === "all" ||
      student.subjects.some(
        (s: string) => s.toLowerCase() === subjectFilter.toLowerCase(),
      );

    return matchesSearch && matchesGrade && matchesSubject;
  });

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Student Management</h1>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Add Student
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search students..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="w-40">
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem
                        key={grade}
                        value={grade === "All Grades" ? "all" : grade}
                      >
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
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
              <span className="ml-2">Loading students...</span>
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead>Sessions Completed</TableHead>
                    <TableHead>Upcoming</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {student.subjects.map((subject: string) => (
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
                      <TableCell>{student.sessionsCompleted}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${student.upcomingSessions > 0 ? "bg-green-50 text-green-800" : "bg-gray-100 text-gray-800"}`}
                        >
                          {student.upcomingSessions} sessions
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              (window.location.href = `/dashboard/progress?student_id=${student.id}`)
                            }
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Progress
                          </Button>
                          <Button variant="outline" size="sm">
                            View
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
              <h3 className="mt-4 text-lg font-medium">No students found</h3>
              <p className="mt-2 text-gray-500">
                {searchQuery || gradeFilter !== "all" || subjectFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by adding a new student"}
              </p>
              {!searchQuery &&
                gradeFilter === "all" &&
                subjectFilter === "all" && (
                  <Button className="mt-4">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Student
                  </Button>
                )}
            </div>
          )}
        </Card>
      </main>
    </>
  );
}
