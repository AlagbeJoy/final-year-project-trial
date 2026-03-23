const mongoose = require("mongoose");

// Material schema - separate for clarity
const materialSchema = new mongoose.Schema(
  {
    name: String,
    size: Number,
    type: String,
    url: String,
  },
  { _id: false },
); // Don't auto-generate _id for materials

const lectureSchema = new mongoose.Schema({
  content: String,
  videoUrl: String,
  materials: [materialSchema], // Use the material schema
});

const quizQuestionSchema = new mongoose.Schema(
  {
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String,
  },
  { _id: false },
);

const quizSchema = new mongoose.Schema(
  {
    questions: [quizQuestionSchema],
    passingScore: Number,
    xpReward: Number,
  },
  { _id: false },
);

const unitSchema = new mongoose.Schema(
  {
    title: String,
    lecture: lectureSchema,
    quiz: quizSchema,
    xpReward: { type: Number, default: 80 },
    releaseDate: Date,
  },
  { _id: true },
);

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },
  duration: String,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  thumbnail: String,
  units: [unitSchema],
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
