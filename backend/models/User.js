const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "lecturer", "admin"],
    default: "student",
  },
  onboarded: {
    type: Boolean,
    default: false,
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  streak: {
    type: Number,
    default: 0,
  },
  badges: [
    {
      id: String,
      name: String,
      earnedAt: Date,
    },
  ],
  profile: {
    avatar: Object,
    department: String,
    level: String,
    bio: String,
    interests: [String],
    enrolledCourses: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        progress: Number,
        completedLessons: [String],
        completedQuizzes: [String],
        enrolledAt: Date,
      },
    ],
  },
  activities: [
    {
      type: {
        type: String,
        enum: ["lesson", "quiz", "enrollment", "achievement", "onboarding"],
      },
      message: String,
      xp: Number,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  lastActive: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
