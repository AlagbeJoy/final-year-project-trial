const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const aiService = require("../services/aiService");

// Generate questions from lecture content (Lecturer only)
router.post("/generate-questions", auth, async (req, res) => {
  try {
    if (req.user.role !== "lecturer") {
      return res.status(403).json({ message: "Only lecturers can generate questions" });
    }

    const { content, numQuestions = 5, difficulty = "medium" } = req.body;
    
    if (!content || content.length < 50) {
      return res.status(400).json({ 
        message: "Please provide at least 50 characters of lecture content" 
      });
    }

    console.log(`🤖 Generating ${numQuestions} ${difficulty} questions with AI...`);
    const questions = await aiService.generateQuestions(content, numQuestions, difficulty);
    
    console.log(`✅ Generated ${questions.length} questions`);
    res.json(questions);
    
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ message: "Failed to generate questions" });
  }
});

// Score quiz with AI feedback (Student only)
router.post("/score-quiz", auth, async (req, res) => {
  try {
    // Only students can take quizzes
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can take quizzes" });
    }

    const { questions, answers } = req.body;

    if (!questions || !answers) {
      return res.status(400).json({ message: "Missing questions or answers" });
    }

    console.log("🤖 Scoring quiz with AI...");
    const result = await aiService.scoreQuiz(questions, answers);

    console.log(`✅ Score: ${result.score}%`);
    res.json(result);
  } catch (error) {
    console.error("Error scoring quiz:", error);
    res.status(500).json({ message: "Failed to score quiz" });
  }
});

module.exports = router;
