"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Plus, Edit, Trash2, Search } from "lucide-react";

interface Subject {
  id: string;
  name: string;
  description: string;
  tutorCount: number;
  studentCount: number;
  level: string;
}

export function SubjectManagement() {
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: "1",
      name: "Mathematics",
      description: "Algebra, Calculus, Geometry, and more",
      tutorCount: 12,
      studentCount: 45,
      level: "All Levels",
    },
    {
      id: "2",
      name: "Physics",
      description: "Mechanics, Thermodynamics, Electromagnetism",
      tutorCount: 8,
      studentCount: 32,
      level: "High School, College",
    },
    {
      id: "3",
      name: "Chemistry",
      description: "Organic, Inorganic, and Physical Chemistry",
      tutorCount: 7,
      studentCount: 28,
      level: "High School, College",
    },
    {
      id: "4",
      name: "Biology",
      description: "Cell Biology, Genetics, Ecology",
      tutorCount: 6,
      studentCount: 25,
      level: "All Levels",
    },
    {
      id: "5",
      name: "English",
      description: "Grammar, Literature, Writing",
      tutorCount: 10,
      studentCount: 38,
      level: "All Levels",
    },
  ]);

  const [newSubject, setNewSubject] = useState<Partial<Subject>>({
    name: "",
    description: "",
    level: "",
  });

  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddSubject = () => {
    if (!newSubject.name) {
      toast({
        title: "Error",
        description: "Subject name is required",
        variant: "destructive",
      });
      return;
    }

    if (editingSubject) {
      // Update existing subject
      setSubjects(
        subjects.map((subject) =>
          subject.id === editingSubject.id
            ? {
                ...subject,
                name: newSubject.name || subject.name,
                description: newSubject.description || subject.description,
                level: newSubject.level || subject.level,
              }
            : subject,
        ),
      );

      toast({
        title: "Success",
        description: "Subject updated successfully",
      });
    } else {
      // Add new subject
      const newId = (
        Math.max(...subjects.map((s) => parseInt(s.id))) + 1
      ).toString();
      setSubjects([
        ...subjects,
        {
          id: newId,
          name: newSubject.name || "",
          description: newSubject.description || "",
          level: newSubject.level || "All Levels",
          tutorCount: 0,
          studentCount: 0,
        },
      ]);

      toast({
        title: "Success",
        description: "Subject added successfully",
      });
    }

    // Reset form and close dialog
    setNewSubject({ name: "", description: "", level: "" });
    setEditingSubject(null);
    setDialogOpen(false);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setNewSubject({
      name: subject.name,
      description: subject.description,
      level: subject.level,
    });
    setDialogOpen(true);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
    toast({
      title: "Success",
      description: "Subject deleted successfully",
    });
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Subject Management</CardTitle>
            <CardDescription>
              Manage subjects offered on the platform
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingSubject(null);
                  setNewSubject({ name: "", description: "", level: "" });
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingSubject ? "Edit Subject" : "Add New Subject"}
                </DialogTitle>
                <DialogDescription>
                  {editingSubject
                    ? "Update the subject details below"
                    : "Enter the details for the new subject"}
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
                  <Input
                    id="level"
                    value={newSubject.level}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, level: e.target.value })
                    }
                    placeholder="e.g., All Levels, High School, College"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSubject}>
                  {editingSubject ? "Update Subject" : "Add Subject"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
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

        {filteredSubjects.length > 0 ? (
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left font-medium">Subject</th>
                  <th className="py-3 px-4 text-left font-medium">
                    Description
                  </th>
                  <th className="py-3 px-4 text-left font-medium">Level</th>
                  <th className="py-3 px-4 text-left font-medium">Tutors</th>
                  <th className="py-3 px-4 text-left font-medium">Students</th>
                  <th className="py-3 px-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map((subject) => (
                  <tr key={subject.id} className="border-b">
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4 text-blue-600" />
                        {subject.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      {subject.description}
                    </td>
                    <td className="py-3 px-4">{subject.level}</td>
                    <td className="py-3 px-4">{subject.tutorCount}</td>
                    <td className="py-3 px-4">{subject.studentCount}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSubject(subject)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteSubject(subject.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      </CardContent>
    </Card>
  );
}
