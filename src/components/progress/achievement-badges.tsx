"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Award,
  Star,
  Zap,
  BookOpen,
  Clock,
  Trophy,
  Target,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
}

interface AchievementBadgesProps {
  studentId?: string;
}

export function AchievementBadges({ studentId }: AchievementBadgesProps = {}) {
  // Mock badges data - would come from database in real implementation
  const badges: Badge[] = [
    {
      id: "math-master",
      title: "Math Master",
      description: "Complete 10 math sessions with a score of 80% or higher",
      icon: <Award className="h-8 w-8" />,
      color: "text-yellow-500",
      earned: true,
      earnedDate: "2023-05-15",
    },
    {
      id: "quick-learner",
      title: "Quick Learner",
      description: "Finish 5 assignments ahead of schedule",
      icon: <Clock className="h-8 w-8" />,
      color: "text-green-500",
      earned: true,
      earnedDate: "2023-04-22",
    },
    {
      id: "science-explorer",
      title: "Science Explorer",
      description: "Attend sessions in 3 different science subjects",
      icon: <BookOpen className="h-8 w-8" />,
      color: "text-blue-500",
      earned: true,
      earnedDate: "2023-06-10",
    },
    {
      id: "perfect-attendance",
      title: "Perfect Attendance",
      description: "Attend 15 consecutive sessions without missing any",
      icon: <Star className="h-8 w-8" />,
      color: "text-purple-500",
      earned: false,
      progress: 12,
    },
    {
      id: "quiz-champion",
      title: "Quiz Champion",
      description: "Score 100% on 3 different quizzes",
      icon: <Trophy className="h-8 w-8" />,
      color: "text-orange-500",
      earned: false,
      progress: 2,
    },
    {
      id: "consistent-improver",
      title: "Consistent Improver",
      description: "Show improvement in scores for 5 consecutive assessments",
      icon: <Target className="h-8 w-8" />,
      color: "text-indigo-500",
      earned: false,
      progress: 3,
    },
    {
      id: "fast-track",
      title: "Fast Track",
      description: "Complete a course 2 weeks ahead of schedule",
      icon: <Zap className="h-8 w-8" />,
      color: "text-red-500",
      earned: false,
      progress: 0,
    },
  ];

  const earnedBadges = badges.filter((badge) => badge.earned);
  const inProgressBadges = badges.filter((badge) => !badge.earned);

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          Achievement Badges
        </CardTitle>
        <CardDescription>
          Track your progress and earn badges for your accomplishments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">
              Earned Badges ({earnedBadges.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {earnedBadges.map((badge) => (
                <Card
                  key={badge.id}
                  className="p-4 flex flex-col items-center text-center"
                >
                  <div className={`mb-3 ${badge.color}`}>{badge.icon}</div>
                  <h3 className="font-semibold text-lg">{badge.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {badge.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    Earned on {new Date(badge.earnedDate!).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">
              Badges in Progress ({inProgressBadges.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {inProgressBadges.map((badge) => (
                <Card
                  key={badge.id}
                  className="p-4 flex flex-col items-center text-center bg-gray-50"
                >
                  <div className="mb-3 text-gray-400">{badge.icon}</div>
                  <h3 className="font-semibold text-lg">{badge.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {badge.description}
                  </p>
