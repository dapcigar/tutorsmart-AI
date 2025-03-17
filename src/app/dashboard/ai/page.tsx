"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeachingPlanGenerator } from "@/components/ai/teaching-plan-generator";
import { QuizGenerator } from "@/components/ai/quiz-generator";
import { LearningRecommendations } from "@/components/ai/learning-recommendations";
import { Brain, BookOpen, HelpCircle } from "lucide-react";

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState("teaching-plans");

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">AI Teaching Tools</h1>
            <p className="text-gray-600">
              Leverage AI to enhance your teaching and learning experience
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-white p-3 rounded-full">
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">
                AI-Powered Education Assistant
              </h2>
              <p className="text-gray-700">
                Our AI tools help you create personalized teaching plans,
                generate quizzes tailored to your students' needs, and provide
                customized learning recommendations based on performance data.
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="bg-white rounded-md p-3 flex items-center gap-2 shadow-sm">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span>Personalized Learning</span>
                </div>
                <div className="bg-white rounded-md p-3 flex items-center gap-2 shadow-sm">
                  <HelpCircle className="h-5 w-5 text-green-600" />
                  <span>Adaptive Assessments</span>
                </div>
                <div className="bg-white rounded-md p-3 flex items-center gap-2 shadow-sm">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>Smart Recommendations</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs
          defaultValue="teaching-plans"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="teaching-plans">Teaching Plans</TabsTrigger>
            <TabsTrigger value="quizzes">Quiz Generator</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="teaching-plans" className="mt-6">
            <TeachingPlanGenerator />
          </TabsContent>

          <TabsContent value="quizzes" className="mt-6">
            <QuizGenerator />
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <LearningRecommendations />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
