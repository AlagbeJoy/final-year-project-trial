const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: String,
  type: {
    type: String,
    enum: ["video", "reading", "quiz"],
  },
  content: String,
  videoUrl: String,
  duration: String,
  xpReward: Number,
  order: Number,
});

const moduleSchema = new mongoose.Schema({
  title: String,
  description: String,
  lessons: [lessonSchema],
  quiz: {
    title: String,
    questions: [
      {
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String,
      },
    ],
    passingScore: Number,
    xpReward: Number,
  },
  order: Number,
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
  },
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
  modules: [moduleSchema],
  published: {
    type: Boolean,
    default: false,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: Date,
});

module.exports = mongoose.model("Course", courseSchema);
