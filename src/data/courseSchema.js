// src/data/courseSchema.js
export const courseSchema = {
  id: null,
  title: "",
  description: "",
  level: "Beginner",
  duration: "",
  instructor: "",
  thumbnail: "",
  prerequisites: {
    requiredCourses: [], // Array of course IDs that must be completed
    requiredXP: 0, // Minimum XP needed
    requiredLevel: 1, // Minimum user level
    requiredSkills: [], // Array of skills needed
    description: "", // Description of prerequisites
  },
  modules: [],
  createdAt: null,
  lastUpdated: null,
};
