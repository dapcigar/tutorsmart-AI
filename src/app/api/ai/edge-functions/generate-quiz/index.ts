// This is an edge function that would generate a quiz using an AI model

interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "short-answer";
  text: string;
  options?: { id: string; text: string }[];
  correctAnswer?: string;
  sampleAnswer?: string;
}

interface QuizRequest {
  subject: string;
  topic: string;
  questionCount: number;
  includeMultipleChoice: boolean;
  includeShortAnswer: boolean;
  studentLevel?: string;
}

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const {
      subject,
      topic,
      questionCount = 5,
      includeMultipleChoice = true,
      includeShortAnswer = true,
      studentLevel = "intermediate",
    } = (await req.json()) as QuizRequest;

    if (!subject || !topic) {
      return new Response(
        JSON.stringify({ error: "Subject and topic are required" }),
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          status: 400,
        },
      );
    }

    if (!includeMultipleChoice && !includeShortAnswer) {
      return new Response(
        JSON.stringify({
          error: "At least one question type must be selected",
        }),
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          status: 400,
        },
      );
    }

    // In a real implementation, this would call an AI model API
    // For now, we'll generate mock data
    const quiz = {
      title: `${topic} Quiz`,
      subject,
      questions: [] as QuizQuestion[],
    };

    const count = parseInt(questionCount.toString());
    const mcCount = includeMultipleChoice ? Math.ceil(count / 2) : 0;
    const saCount = includeShortAnswer ? count - mcCount : count;

    // Generate multiple choice questions
    for (let i = 0; i < mcCount; i++) {
      quiz.questions.push({
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
      quiz.questions.push({
        id: `sa-${i}`,
        type: "short-answer",
        text: `Sample short answer question about ${topic} (#${i + 1})`,
        sampleAnswer: `This is a sample answer for the question about ${topic}.`,
      });
    }

    return new Response(JSON.stringify({ quiz }), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate quiz" }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        status: 500,
      },
    );
  }
});
