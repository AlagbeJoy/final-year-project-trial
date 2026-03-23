const mongoose = require("mongoose");

// Lesson schema (for when you have multiple lessons per unit)
const lessonSchema = new mongoose.Schema({
  id: Number,
  title: String,
  type: String,
  content: String,
  videoUrl: String,
  duration: String,
  xpReward: Number,
  completed: Boolean,
});

// Quiz question schema
const quizQuestionSchema = new mongoose.Schema({
  id: Number,
  question: String,
  options: [String],
  correctAnswer: Number,
  explanation: String,
});

// Updated module/unit schema with lecture field
const moduleSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,

  // NEW: Lecture field for simple content (what you're using)
  lecture: {
    content: String,
    videoUrl: String,
    materials: [
      {
        name: String,
        size: Number,
        type: String,
        url: String,
      },
    ],
  },

  // Keep lessons for backward compatibility
  lessons: [lessonSchema],

  quiz: {
    title: String,
    questions: [quizQuestionSchema],
    passingScore: Number,
    xpReward: Number,
  },
  releaseDate: Date,
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
  duration: String,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  thumbnail: String,
  prerequisites: {
    requiredXP: Number,
    requiredLevel: Number,
    requiredSkills: [String],
    description: String,
  },
  units: [moduleSchema],
  modules: [moduleSchema],
  published: { type: Boolean, default: false },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  startDate: Date,
  endDate: Date,
  releaseSchedule: {
    type: String,
    enum: ["all", "weekly", "biweekly", "custom"],
    default: "all",
  },
  createdAt: { type: Date, default: Date.now },
  lastUpdated: Date,
});

module.exports = mongoose.model("Course", courseSchema);
