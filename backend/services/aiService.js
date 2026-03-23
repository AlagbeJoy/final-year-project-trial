const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class AIService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  /**
   * Generate quiz questions from lecture content
   * @param {string} lectureContent - The lecture text
   * @param {number} numQuestions - Number of questions (1-50)
   * @param {string} difficulty - 'easy', 'medium', 'hard'
   */
  async generateQuestions(
    lectureContent,
    numQuestions = 5,
    difficulty = "medium",
  ) {
    // Limit to reasonable range
    const questionCount = Math.min(50, Math.max(1, numQuestions));

    // Adjust prompt based on difficulty
    const difficultyInstructions = {
      easy: "Make questions about basic concepts and definitions. Keep answers straightforward.",
      medium:
        "Mix of basic and applied concepts. Some questions should test understanding.",
      hard: "Focus on application, analysis, and synthesis. Questions should be challenging.",
    };

    const difficultyText =
      difficultyInstructions[difficulty] || difficultyInstructions.medium;

    try {
      const prompt = `
        You are an educational AI assistant. Based on the following lecture content, generate EXACTLY ${questionCount} multiple-choice questions.

        INSTRUCTIONS:
        1. Create questions that test understanding of the key concepts
        2. Each question must have exactly 4 options
        3. Only one option should be correct
        4. Include a brief explanation for why the answer is correct
        5. Difficulty level: ${difficultyText}
        6. Format your response as a valid JSON array

        FORMAT EXAMPLE:
        [
          {
            "question": "What is the main concept discussed?",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correctAnswer": 0,
            "explanation": "The main concept is..."
          }
        ]

        LECTURE CONTENT:
        ${lectureContent.substring(0, 4000)}

        Generate ${questionCount} questions now. DO NOT respond with anything other than the JSON array.
      `;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      // Extract JSON from the response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      const questions = JSON.parse(jsonMatch[0]);

      // Ensure we have exactly the requested number
      const finalQuestions = questions.slice(0, questionCount);

      // Add unique IDs to questions
      return finalQuestions.map((q, index) => ({
        id: Date.now() + index,
        ...q,
      }));
    } catch (error) {
      console.error("AI Generation Error:", error);
      return this.getFallbackQuestions(questionCount);
    }
  }

  /**
   * Score student answers and provide detailed feedback
   */
  async scoreQuiz(questions, studentAnswers) {
    try {
      const prompt = `
        You are an educational AI assistant. Score this quiz and provide helpful feedback to help the student learn.

        Quiz Questions and Correct Answers:
        ${questions
          .map(
            (q, i) => `
          Q${i + 1}: ${q.question}
          Correct Answer: ${q.options[q.correctAnswer]}
          Explanation: ${q.explanation || "No explanation provided"}
        `,
          )
          .join("\n")}
        
        Student's Answers:
        ${studentAnswers
          .map(
            (ans, i) => `
          Q${i + 1}: ${questions[i]?.options[ans] || "Not answered"}
        `,
          )
          .join("\n")}
        
        Please provide:
        1. The percentage score
        2. For each question, indicate if it was correct or incorrect
        3. For incorrect answers, explain why the correct answer is right
        4. A motivational summary message
        5. Suggestions for improvement
      `;

      const result = await this.model.generateContent(prompt);
      const feedback = result.response.text();

      // Calculate score
      let correct = 0;
      questions.forEach((q, i) => {
        if (studentAnswers[i] === q.correctAnswer) {
          correct++;
        }
      });

      const percentage = Math.round((correct / questions.length) * 100);

      return {
        score: percentage,
        correctCount: correct,
        totalQuestions: questions.length,
        feedback: feedback,
        passed: percentage >= 70,
        perQuestionResults: questions.map((q, i) => ({
          question: q.question,
          correct: studentAnswers[i] === q.correctAnswer,
          correctAnswer: q.options[q.correctAnswer],
          studentAnswer: q.options[studentAnswers[i]] || "Not answered",
          explanation: q.explanation,
        })),
      };
    } catch (error) {
      console.error("AI Scoring Error:", error);
      // Fallback scoring
      let correct = 0;
      questions.forEach((q, i) => {
        if (studentAnswers[i] === q.correctAnswer) correct++;
      });
      const percentage = Math.round((correct / questions.length) * 100);

      return {
        score: percentage,
        correctCount: correct,
        totalQuestions: questions.length,
        feedback:
          percentage >= 70
            ? "Good work! Review the explanations below to reinforce your learning."
            : "Review the material and try again. Pay attention to the explanations for each question.",
        passed: percentage >= 70,
        perQuestionResults: questions.map((q, i) => ({
          question: q.question,
          correct: studentAnswers[i] === q.correctAnswer,
          correctAnswer: q.options[q.correctAnswer],
          studentAnswer: q.options[studentAnswers[i]] || "Not answered",
          explanation:
            q.explanation || "Review the lecture material for this concept.",
        })),
      };
    }
  }

  getFallbackQuestions(numQuestions) {
    const fallbacks = [];
    for (let i = 0; i < numQuestions; i++) {
      fallbacks.push({
        id: Date.now() + i,
        question: "What is the main topic discussed in this lecture?",
        options: [
          "Review the lecture material",
          "Consult your notes",
          "Ask your instructor",
          "Watch the video again",
        ],
        correctAnswer: 0,
        explanation:
          "The correct answer is to review the lecture material carefully.",
      });
    }
    return fallbacks;
  }
}

module.exports = new AIService();
