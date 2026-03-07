// src/services/analyticsService.js
class AnalyticsService {
  /**
   * Get student engagement metrics
   */
  getStudentEngagement(user) {
    const activities = user?.activities || [];

    // Group by day
    const dailyActivity = this.groupByDay(activities);

    // Calculate metrics
    const totalDays = Object.keys(dailyActivity).length;
    const totalActivities = activities.length;
    const avgPerDay =
      totalDays > 0 ? (totalActivities / totalDays).toFixed(1) : 0;

    // Get most active day
    let maxDay = null;
    let maxCount = 0;
    Object.entries(dailyActivity).forEach(([day, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxDay = day;
      }
    });

    // Get activity by type
    const byType = this.groupByType(activities);

    // Get weekly trend
    const weeklyTrend = this.getWeeklyTrend(activities);

    // Get time distribution
    const timeDistribution = this.getTimeDistribution(activities);

    return {
      summary: {
        totalActivities,
        totalDays,
        avgPerDay,
        mostActiveDay: maxDay,
        mostActiveCount: maxCount,
      },
      byType,
      weeklyTrend,
      timeDistribution,
      dailyActivity: this.formatDailyActivity(dailyActivity),
    };
  }

  /**
   * Get course engagement metrics
   */
  getCourseEngagement(courseId) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const students = users.filter((u) => u.role === "student");

    let totalEnrolled = 0;
    let totalCompleted = 0;
    let totalLessonsDone = 0;
    const studentProgress = [];

    students.forEach((student) => {
      const course = student.profile?.enrolledCourses?.find(
        (c) => c.id === courseId,
      );
      if (course) {
        totalEnrolled++;
        if (course.progress === 100) totalCompleted++;
        totalLessonsDone += course.completedLessons?.length || 0;
        studentProgress.push(course.progress || 0);
      }
    });

    const avgProgress =
      totalEnrolled > 0
        ? Math.round(studentProgress.reduce((a, b) => a + b, 0) / totalEnrolled)
        : 0;

    return {
      totalEnrolled,
      totalCompleted,
      completionRate:
        totalEnrolled > 0
          ? Math.round((totalCompleted / totalEnrolled) * 100)
          : 0,
      avgProgress,
      totalLessonsDone,
      studentProgress,
    };
  }

  /**
   * Get lecturer dashboard metrics
   */
  getLecturerMetrics(lecturerEmail) {
    const courses = JSON.parse(
      localStorage.getItem("lecturer_courses") || "[]",
    ).filter((c) => c.instructorId === lecturerEmail);

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const students = users.filter((u) => u.role === "student");

    let totalStudents = 0;
    let totalXP = 0;
    let courseMetrics = [];

    courses.forEach((course) => {
      const enrolled = students.filter((s) =>
        s.profile?.enrolledCourses?.some((c) => c.id === course.id),
      );

      const completions = enrolled.filter(
        (s) =>
          s.profile?.enrolledCourses?.find((c) => c.id === course.id)
            ?.progress === 100,
      ).length;

      totalStudents += enrolled.length;

      enrolled.forEach((s) => {
        totalXP += s.xp || 0;
      });

      courseMetrics.push({
        id: course.id,
        title: course.title,
        enrolled: enrolled.length,
        completions,
        completionRate:
          enrolled.length > 0
            ? Math.round((completions / enrolled.length) * 100)
            : 0,
        avgProgress: this.getAverageCourseProgress(enrolled, course.id),
      });
    });

    return {
      totalCourses: courses.length,
      totalStudents,
      totalXP,
      avgStudentsPerCourse:
        courses.length > 0 ? Math.round(totalStudents / courses.length) : 0,
      courseMetrics,
    };
  }

  /**
   * Helper: Group activities by day
   */
  groupByDay(activities) {
    const groups = {};
    activities.forEach((a) => {
      const day = new Date(a.date).toDateString();
      groups[day] = (groups[day] || 0) + 1;
    });
    return groups;
  }

  /**
   * Helper: Group activities by type
   */
  groupByType(activities) {
    const groups = {};
    activities.forEach((a) => {
      groups[a.type] = (groups[a.type] || 0) + 1;
    });
    return groups;
  }

  /**
   * Helper: Get weekly trend
   */
  getWeeklyTrend(activities) {
    const trend = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStr = date.toDateString();

      const count = activities.filter(
        (a) => new Date(a.date).toDateString() === dayStr,
      ).length;

      trend.push({
        day: dayStr.slice(0, 3),
        date: dayStr,
        count,
      });
    }

    return trend;
  }

  /**
   * Helper: Get time distribution
   */
  getTimeDistribution(activities) {
    const times = {
      morning: 0, // 6-12
      afternoon: 0, // 12-18
      evening: 0, // 18-22
      night: 0, // 22-6
    };

    activities.forEach((a) => {
      const hour = new Date(a.date).getHours();
      if (hour >= 6 && hour < 12) times.morning++;
      else if (hour >= 12 && hour < 18) times.afternoon++;
      else if (hour >= 18 && hour < 22) times.evening++;
      else times.night++;
    });

    return times;
  }

  /**
   * Helper: Format daily activity for charts
   */
  formatDailyActivity(dailyActivity) {
    return Object.entries(dailyActivity)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /**
   * Helper: Get average course progress
   */
  getAverageCourseProgress(students, courseId) {
    if (students.length === 0) return 0;

    const total = students.reduce((sum, s) => {
      const course = s.profile?.enrolledCourses?.find((c) => c.id === courseId);
      return sum + (course?.progress || 0);
    }, 0);

    return Math.round(total / students.length);
  }
}

export default new AnalyticsService();
