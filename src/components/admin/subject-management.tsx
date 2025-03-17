"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  const { toast } = useTo