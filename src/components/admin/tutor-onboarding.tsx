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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, Loader2, CheckCircle2, XCircle } from "lucide-react";

interface TutorOnboardingProps {
  onTutorAdded?: (tutor: any) => void;
}

export function TutorOnboarding({ onTutorAdded }: TutorOnboardingProps = {}) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
    subjects: [] as string[],
    availability: [] as string[],
    documents: {
      resume: false,
      certification: false,
      backgroundCheck: false,
    },
  });
  const { toast } = useToast();

  // Mock subjects
  const availableSubjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Computer Science",
    "Economics",
    "Psychology",
    "Foreign Languages",
  ];

  // Mock availability options
  const availabilityOptions = [
    "Weekday Mornings",
    "Weekday Afternoons",
    "Weekday Evenings",
    "Weekend Mornings",
    "Weekend Afternoons",
    "Weekend Evenings",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.includes(subject)
        ? formData.subjects.filter((s) => s !== subject)
        : [...formData.subjects, subject],
    });
  };

  const handleAvailabilityToggle = (availability: string) => {
    setFormData({
      ...formData,
      availability: formData.availability.includes(availability)
        ? formData.availability.filter((a) => a !== availability)
        : [...formData.availability, availability],
    });
  };

  const handleDocumentToggle = (document: keyof typeof formData.documents) => {
    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        [document]: !formData.documents[document],
      },
    });
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return false;
      }
    } else if (step === 2) {
      if (
        !formData.education ||
        !formData.experience ||
        formData.subjects.length === 0
      ) {
        toast({
          title: "Missing information",
          description:
            "Please fill in all required fields and select at least one subject",
          variant: "destructive",
        });
        return false;
      }
    } else if (step === 3) {
      if (formData.availability.length === 0) {
        toast({
          title: "Missing information",
          description: "Please select at least one availability option",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!validateStep()) return;

    setLoading(true);

    // Simulate API call to create tutor
    setTimeout(() => {
      setLoading(false);

      toast({
        title: "Tutor onboarded successfully",
        description: `${formData.fullName} has been added to the platform`,
      });

      if (onTutorAdded) {
        onTutorAdded({
          id: Math.random().toString(36).substring(2, 9),
          ...formData,
          status: "Pending",
          joinDate: new Date().toISOString(),
        });
      }

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        education: "",
        experience: "",
        subjects: [],
        availability: [],
        documents: {
          resume: false,
          certification: false,
          backgroundCheck: false,
        },
      });
      setStep(1);
    }, 1500);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-blue-600" />
          Tutor Onboarding
        </CardTitle>
        <CardDescription>
          Add new tutors to the platform and verify their qualifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step === stepNumber ? "bg-blue-600 text-white" : step > stepNumber ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}`}
                >
                  {step > stepNumber ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span className="text-xs mt-1">
                  {stepNumber === 1
                    ? "Basic Info"
                    : stepNumber === 2
                      ? "Qualifications"
                      : stepNumber === 3
                        ? "Availability"
                        : "Documents"}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full h-1 bg-gray-200 mt-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john.doe@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(123) 456-7890"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Input
                id="education"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                placeholder="Ph.D. in Mathematics, University of Example"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Teaching Experience</Label>
              <Textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="5 years of teaching experience at high school level..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Subjects</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableSubjects.map((subject) => (
                  <div key={subject} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subject-${subject}`}
                      checked={formData.subjects.includes(subject)}
                      onCheckedChange={() => handleSubjectToggle(subject)}
                    />
                    <label
                      htmlFor={`subject-${subject}`}
                      className="text-sm font-medium leading-none"
                    >
                      {subject}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>General Availability</Label>
              <div className="grid grid-cols-2 gap-2">
                {availabilityOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`availability-${option}`}
                      checked={formData.availability.includes(option)}
                      onCheckedChange={() => handleAvailabilityToggle(option)}
                    />
                    <label
                      htmlFor={`availability-${option}`}
                      className="text-sm font-medium leading-none"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Hourly Rate Range</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select rate range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20-30">$20-30 per hour</SelectItem>
                  <SelectItem value="30-40">$30-40 per hour</SelectItem>
                  <SelectItem value="40-50">$40-50 per hour</SelectItem>
                  <SelectItem value="50+">$50+ per hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Required Documents</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Resume/CV</h4>
                    <p className="text-sm text-gray-600">
                      Professional resume with teaching experience
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Upload
                    </Button>
                    {formData.documents.resume ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Teaching Certifications</h4>
                    <p className="text-sm text-gray-600">
                      Relevant teaching credentials and certifications
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Upload
                    </Button>
                    {formData.documents.certification ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Background Check</h4>
                    <p className="text-sm text-gray-600">
                      Consent form for background verification
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Upload
                    </Button>
                    {formData.documents.backgroundCheck ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Any additional notes about the tutor..."
                rows={3}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={prevStep}>
            Previous
          </Button>
        ) : (
          <div></div>
        )}

        {step < 4 ? (
          <Button onClick={nextStep}>Next</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Complete Onboarding"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
