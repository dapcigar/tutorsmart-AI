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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Plus, Search, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newSubject, setNewSubject] = useState({
    name: "",
    description: "",
    level: "all",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/subjects");
      const data = await response.json();

      if (response.ok) {
        // Add mock data for display purposes
        const enhancedSubjects = data.subjects.map((subject: any) => ({
          ...subject,
          tutorCount: Math.floor(Math.random() * 15) + 5,
          studentCount: Math.floor(Math.random() * 50) + 20,
          level: subject.level || "All Levels",
        }));
        setSubjects(enhancedSubjects);
      } else {
        throw new Error(data.error || "Failed to fetch subjects");
      }
    } catch (error: any) {
      console.error("Error fetching subjects:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load subjects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async () => {
    if (!newSubject.name) {
      toast({
        title: "Error",
        description: "Subject name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSubject),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Subject created successfully",
        });
        setDialogOpen(false);
        setNewSubject({ name: "", description: "", level: "all" });
        fetchSubjects();
      } else {
        throw new Error(data.error || "Failed to create subject");
      }
    } catch (error: any) {
      console.error("Error creating subject:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create subject",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Subject Management</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>
                  Create a new subject for tutoring sessions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Subject Name</Label>
                  <Input
                    id="name"
                    value={newSubject.name}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, name: e.target.value })
                    }
                    placeholder="e.g., Mathematics, Physics"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newSubject.description}
                    onChange={(e) =>
                      setNewSubject({
                        ...newSubject,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description of the subject"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="level">Education Level</Label>
                  <Select
                    value={newSubject.level}
                    onValueChange={(value) =>
                      setNewSubject({ ...newSubject, level: value })
                    }
                  >
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="elementary">Elementary</SelectItem>
                      <SelectItem value="middle">Middle School</SelectItem>
                      <SelectItem value="high">High School</SelectItem>
                      <SelectItem value="college">College</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateSubject} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Subject"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-6">
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search subjects..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading subjects...</span>
            </div>
          ) : filteredSubjects.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Tutors</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <BookOpen className="mr-2 h-4 w-4 text-blue-600" />
                          {subject.name}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {subject.description || "No description available"}
                      </TableCell>
                      <TableCell>{subject.level}</TableCell>
                      <TableCell>{subject.tutorCount}</TableCell>
                      <TableCell>{subject.studentCount}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No subjects found</h3>
              <p className="mt-2 text-gray-500">
                {searchQuery
                  ? `No subjects matching "${searchQuery}"`
                  : "Get started by adding a new subject"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setDialogOpen(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Add Subject
                </Button>
              )}
            </div>
          )}
        </Card>
      </main>
    </>
  );
}
