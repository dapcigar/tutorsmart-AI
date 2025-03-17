import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  BookOpen,
  Brain,
  Calendar,
  Award,
} from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              Learn{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Smarter
              </span>{" "}
              with AI-Powered Tutoring
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Personalized learning experiences powered by AI. Connect with
              qualified tutors, track progress, and achieve your academic goals
              faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center px-8 py-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Start Learning
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="/sign-in"
                className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                Tutor Login
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <span className="font-medium">Personalized Learning</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-purple-100 p-3 rounded-full mb-3">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <span className="font-medium">AI-Generated Plans</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-green-100 p-3 rounded-full mb-3">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <span className="font-medium">Flexible Scheduling</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-orange-100 p-3 rounded-full mb-3">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <span className="font-medium">Progress Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
