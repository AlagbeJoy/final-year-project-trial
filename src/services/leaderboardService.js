// src/services/leaderboardService.js
class LeaderboardService {
  constructor() {
    this.timeframes = {
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
      allTime: Infinity,
    };
  }

  /**
   * Get global leaderboard
   */
  getGlobalLeaderboard(timeframe = "allTime", limit = 100) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const students = users.filter((u) => u.role === "student");

    const cutoff =
      timeframe === "allTime" ? 0 : Date.now() - this.timeframes[timeframe];

    const ranked = students.map((student) => {
      // Calculate recent activity
      const recentActivities =
        student.activities?.filter(
          (a) => new Date(a.date).getTime() > cutoff,
        ) || [];

      const recentXP = recentActivities.reduce(
        (sum, a) => sum + (a.xp || 0),
        0,
      );

      return {
        id: student.email,
        name: student.name,
        avatar: student.profile?.avatar,
        level: student.level || 1,
        totalXP: student.xp || 0,
        recentXP,
        streak: student.streak || 0,
        badges: student.badges?.length || 0,
        activities: student.activities?.length || 0,
      };
    });

    // Sort by XP (total or recent based on timeframe)
    const sorted = ranked.sort((a, b) => {
      if (timeframe === "allTime") {
        return b.totalXP - a.totalXP;
      }
      return b.recentXP - a.recentXP;
    });

    return sorted.slice(0, limit).map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
  }

  /**
   * Get course-specific leaderboard
   */
  getCourseLeaderboard(courseId, timeframe = "allTime") {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const students = users.filter((u) => u.role === "student");

    const enrolled = students.filter((s) =>
      s.profile?.enrolledCourses?.some((c) => c.id === parseInt(courseId)),
    );

    const cutoff =
      timeframe === "allTime" ? 0 : Date.now() - this.timeframes[timeframe];

    const ranked = enrolled.map((student) => {
      const course = student.profile.enrolledCourses.find(
        (c) => c.id === parseInt(courseId),
      );

      const courseActivities =
        student.activities?.filter(
          (a) =>
            a.message?.includes(course.title) &&
            new Date(a.date).getTime() > cutoff,
        ) || [];

      const courseXP = courseActivities.reduce(
        (sum, a) => sum + (a.xp || 0),
        0,
      );

      return {
        id: student.email,
        name: student.name,
        avatar: student.profile?.avatar,
        level: student.level || 1,
        courseProgress: course?.progress || 0,
        courseXP,
        lessonsCompleted: course?.completedLessons?.length || 0,
        quizzesPassed: course?.completedQuizzes?.length || 0,
      };
    });

    const sorted = ranked.sort((a, b) => {
      if (timeframe === "allTime") {
        return b.courseXP - a.courseXP;
      }
      return b.lessonsCompleted - a.lessonsCompleted;
    });

    return sorted.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
  }

  /**
   * Get user's rank and stats
   */
  getUserRank(userEmail, timeframe = "allTime") {
    const leaderboard = this.getGlobalLeaderboard(timeframe);
    const userIndex = leaderboard.findIndex((u) => u.id === userEmail);

    if (userIndex === -1) return null;

    return {
      rank: userIndex + 1,
      totalUsers: leaderboard.length,
      ...leaderboard[userIndex],
    };
  }

  /**
   * Get department leaderboard
   */
  getDepartmentLeaderboard(department, timeframe = "allTime") {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const students = users.filter(
      (u) => u.role === "student" && u.profile?.department === department,
    );

    const cutoff =
      timeframe === "allTime" ? 0 : Date.now() - this.timeframes[timeframe];

    const ranked = students.map((student) => ({
      id: student.email,
      name: student.name,
      avatar: student.profile?.avatar,
      level: student.level || 1,
      totalXP: student.xp || 0,
      department: student.profile?.department,
    }));

    return ranked
      .sort((a, b) => b.totalXP - a.totalXP)
      .slice(0, 50)
      .map((user, index) => ({ ...user, rank: index + 1 }));
  }
}

export default new LeaderboardService();
