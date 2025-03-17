import { createClient } from "../../../../../supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      subject,
      topic,
      questionCount = 5,
      includeMultipleChoice = true,
      includeShortAnswer = true,
    } = await request.json();

    // Validate required fields
    if (!subject || !topic) {
      return NextResponse.json(
        { error: "Subject and topic are required" },
        { status: 400 },
      );
    }

    if (!includeMultipleChoice && !includeShortAnswer) {
      return NextResponse.json(
        { error: "At least one question type must be selected" },
        { status: 400 },
      );
    }

    // In a real app, this would call an AI service
    // For now, using mock data
    const mockQuiz = {
      title: `${topic} Quiz`,
      subject,
      questions: [],
    };

    const count = parseInt(questionCount.toString());
    const mcCount = includeMultipleChoice ? Math.ceil(count / 2) : 0;
    const saCount = includeShortAnswer ? count - mcCount : count;

    // Generate multiple choice questions
    for (let i = 0; i < mcCount; i++) {
      mockQuiz.questions.push({
        id: `mc-${i}`,
        type: "multiple-choice",
        text: `Sample multiple choice question about ${topic} (#${i + 1})`,
        options: [
          { id: "a", text: "Answer option A" },
          { id: "b", text: "Answer option B" },
          { id: "c", text: "Answer option C" },
          { id: "d", text: "Answer option D" },
        ],
        correctAnswer: "b",
      });
    }

    // Generate short answer questions
    for (let i = 0; i < saCount; i++) {
      mockQuiz.questions.push({
        id: `sa-${i}`,
        type: "short-answer",
        text: `Sample short answer question about ${topic} (#${i + 1})`,
        sampleAnswer: `This is a sample answer for the question about ${topic}.`,
      });
    }

    // In a real app, you might save this to a database
    return NextResponse.json({ quiz: mockQuiz });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 },
    );
  }
}
