// src/data/badgeDefinitions.js
export const badgeDefinitions = [
  {
    id: "welcome",
    name: "Welcome Onboard",
    icon: "👋",
    description: "Complete your profile setup",
    category: "onboarding",
    xpReward: 50,
    condition: (user) => user?.onboarded === true,
    hidden: false,
  },
  {
    id: "quick_learner",
    name: "Quick Learner",
    icon: "⚡",
    description: "Complete 5 lessons in one day",
    category: "learning",
    xpReward: 100,
    condition: (user) => {
      const today = new Date().toDateString();
      const todayLessons =
        user?.activities?.filter(
          (a) =>
            a.type === "lesson" && new Date(a.date).toDateString() === today,
        ).length || 0;
      return todayLessons >= 5;
    },
    hidden: false,
  },
  {
    id: "quiz_master",
    name: "Quiz Master",
    icon: "📝",
    description: "Get 100% on 3 different quizzes",
    category: "quiz",
    xpReward: 150,
    condition: (user) => {
      const perfectQuizzes =
        user?.activities?.filter(
          (a) => a.type === "quiz" && a.message?.includes("100%"),
        ).length || 0;
      return perfectQuizzes >= 3;
    },
    hidden: false,
  },
  {
    id: "streak_master",
    name: "Streak Master",
    icon: "🔥",
    description: "Maintain a 7-day learning streak",
    category: "engagement",
    xpReward: 200,
    condition: (user) => (user?.streak || 0) >= 7,
    hidden: false,
  },
  {
    id: "course_completer",
    name: "Course Completer",
    icon: "🎓",
    description: "Complete your first course",
    category: "achievement",
    xpReward: 500,
    condition: (user) => {
      return (
        user?.profile?.enrolledCourses?.some((c) => c.progress === 100) || false
      );
    },
    hidden: false,
  },
  {
    id: "early_bird",
    name: "Early Bird",
    icon: "🐦",
    description: "Complete a lesson before 8 AM",
    category: "special",
    xpReward: 75,
    condition: (user) => {
      const hour = new Date().getHours();
      return (
        hour < 8 &&
        user?.activities?.some(
          (a) => a.type === "lesson" && new Date(a.date).getHours() < 8,
        )
      );
    },
    hidden: true, // Secret badge!
  },
  {
    id: "night_owl",
    name: "Night Owl",
    icon: "🦉",
    description: "Complete a lesson after 10 PM",
    category: "special",
    xpReward: 75,
    condition: (user) => {
      const hour = new Date().getHours();
      return (
        hour >= 22 &&
        user?.activities?.some(
          (a) => a.type === "lesson" && new Date(a.date).getHours() >= 22,
        )
      );
    },
    hidden: true, // Secret badge!
  },
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    icon: "🦋",
    description: "Join a study group",
    category: "social",
    xpReward: 100,
    condition: (user) => (user?.studyGroups?.length || 0) > 0,
    hidden: false,
  },
  {
    id: "helper",
    name: "Community Helper",
    icon: "🤝",
    description: "Answer 5 questions in discussion forums",
    category: "social",
    xpReward: 150,
    condition: (user) => {
      const helpfulActivities =
        user?.activities?.filter(
          (a) => a.type === "help" || a.message?.includes("answered"),
        ).length || 0;
      return helpfulActivities >= 5;
    },
    hidden: false,
  },
  {
    id: "centurion",
    name: "Centurion",
    icon: "💯",
    description: "Earn 1000 XP",
    category: "milestone",
    xpReward: 200,
    condition: (user) => (user?.xp || 0) >= 1000,
    hidden: false,
  },
];

export const badgeCategories = {
  onboarding: { name: "Getting Started", color: "bg-blue-100 text-blue-800" },
  learning: { name: "Learning Habits", color: "bg-green-100 text-green-800" },
  quiz: { name: "Quiz Champions", color: "bg-yellow-100 text-yellow-800" },
  engagement: { name: "Engagement", color: "bg-purple-100 text-purple-800" },
  achievement: { name: "Achievements", color: "bg-indigo-100 text-indigo-800" },
  special: { name: "Secret Badges", color: "bg-pink-100 text-pink-800" },
  social: { name: "Community", color: "bg-orange-100 text-orange-800" },
  milestone: { name: "Milestones", color: "bg-red-100 text-red-800" },
};
