class AdaptiveLearningEngine {
  constructor() {
    this.learningStyles = ["visual", "auditory", "reading", "kinesthetic"];
    this.difficultyLevels = ["beginner", "intermediate", "advanced"];
    this.masteryThreshold = 80; // Percentage to consider a topic mastered
  }

  /**
   * Analyze student performance and generate personalized learning path
   */
  generatePersonalizedPath(student, availableCourses) {
    console.log("🎯 Generating personalized path for:", student.name);

    const studentProfile = this.analyzeStudentProfile(student);
    const performanceAnalysis = this.analyzePerformance(student);
    const recommendations = this.generateRecommendations(
      studentProfile,
      performanceAnalysis,
      availableCourses,
    );
    const learningPath = this.buildLearningPath(recommendations);

    return {
      studentId: student.email,
      generatedAt: new Date().toISOString(),
      profile: studentProfile,
      performance: performanceAnalysis,
      recommendations: recommendations,
      path: learningPath,
      nextSteps: this.getNextSteps(learningPath, student),
    };
  }

  /**
   * Analyze student profile and preferences
   */
  analyzeStudentProfile(student) {
    const profile = student.profile || {};

    return {
      learningStyle: profile.learningStyle || this.detectLearningStyle(student),
      preferredStudyTime: profile.preferredStudyTime || "anytime",
      interests: profile.interests || [],
      currentLevel: this.calculateStudentLevel(student),
      strengths: this.identifyStrengths(student),
      weaknesses: this.identifyWeaknesses(student),
      learningPace: this.calculateLearningPace(student),
    };
  }

  /**
   * Detect learning style from behavior if not set
   */
  detectLearningStyle(student) {
    const activities = student.activities || [];

    // Analyze activity patterns
    const videoViews = activities.filter(
      (a) => a.type === "lesson" && a.message.includes("video"),
    ).length;
    const readingCompletions = activities.filter(
      (a) => a.type === "lesson" && a.message.includes("reading"),
    ).length;

    if (videoViews > readingCompletions * 1.5) return "visual";
    if (readingCompletions > videoViews * 1.5) return "reading";
    return "mixed";
  }

  /**
   * Calculate student's overall level based on XP and completed content
   */
  calculateStudentLevel(student) {
    const xp = student.xp || 0;
    const completedLessons =
      student.activities?.filter((a) => a.type === "lesson").length || 0;
    const quizScores =
      student.activities?.filter((a) => a.type === "quiz") || [];

    // Base level on XP
    const xpLevel = Math.floor(xp / 100) + 1;

    // Adjust based on quiz performance
    const avgQuizScore =
      quizScores.length > 0
        ? quizScores.reduce((sum, q) => sum + (q.score || 0), 0) /
          quizScores.length
        : 0;

    if (avgQuizScore > 85 && completedLessons > 20) {
      return Math.min(xpLevel + 1, 10);
    } else if (avgQuizScore < 60 && completedLessons > 10) {
      return Math.max(xpLevel - 1, 1);
    }

    return xpLevel;
  }

  /**
   * Identify student strengths based on performance
   */
  identifyStrengths(student) {
    const strengths = [];
    const quizScores =
      student.activities?.filter((a) => a.type === "quiz") || [];

    // Group quiz scores by topic/course
    const topicPerformance = {};
    quizScores.forEach((quiz) => {
      const topic = quiz.topic || "general";
      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { total: 0, count: 0 };
      }
      topicPerformance[topic].total += quiz.score || 0;
      topicPerformance[topic].count++;
    });

    // Identify topics with consistently high scores
    Object.entries(topicPerformance).forEach(([topic, data]) => {
      const avgScore = data.total / data.count;
      if (avgScore >= this.masteryThreshold) {
        strengths.push({
          topic,
          averageScore: avgScore,
          confidence: "high",
        });
      }
    });

    return strengths;
  }

  /**
   * Identify student weaknesses based on performance
   */
  identifyWeaknesses(student) {
    const weaknesses = [];
    const quizScores =
      student.activities?.filter((a) => a.type === "quiz") || [];

    // Group quiz scores by topic
    const topicPerformance = {};
    quizScores.forEach((quiz) => {
      const topic = quiz.topic || "general";
      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { total: 0, count: 0, attempts: [] };
      }
      topicPerformance[topic].total += quiz.score || 0;
      topicPerformance[topic].count++;
      topicPerformance[topic].attempts.push(quiz.score || 0);
    });

    // Identify topics with low scores or declining performance
    Object.entries(topicPerformance).forEach(([topic, data]) => {
      const avgScore = data.total / data.count;

      // Check for declining trend
      const isDeclining = this.checkDecliningTrend(data.attempts);

      if (avgScore < 60 || isDeclining) {
        weaknesses.push({
          topic,
          averageScore: avgScore,
          priority: avgScore < 50 ? "high" : "medium",
          suggestedReview: true,
        });
      }
    });

    return weaknesses;
  }

  /**
   * Check if performance is declining over time
   */
  checkDecliningTrend(scores) {
    if (scores.length < 3) return false;

    const recent = scores.slice(-3);
    return recent[0] > recent[1] && recent[1] > recent[2];
  }

  /**
   * Calculate student's learning pace
   */
  calculateLearningPace(student) {
    const activities = student.activities || [];

    if (activities.length < 5) return "normal";

    // Calculate average time between activities
    const timestamps = activities
      .filter((a) => a.date)
      .map((a) => new Date(a.date).getTime())
      .sort();

    if (timestamps.length < 2) return "normal";

    const intervals = [];
    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(timestamps[i] - timestamps[i - 1]);
    }

    const avgInterval =
      intervals.reduce((sum, i) => sum + i, 0) / intervals.length;
    const hoursBetween = avgInterval / (1000 * 60 * 60);

    if (hoursBetween < 12) return "fast";
    if (hoursBetween > 48) return "slow";
    return "normal";
  }

  /**
   * Analyze overall student performance
   */
  analyzePerformance(student) {
    const activities = student.activities || [];
    const quizAttempts = activities.filter((a) => a.type === "quiz");
    const lessonsCompleted = activities.filter(
      (a) => a.type === "lesson",
    ).length;

    // Calculate average quiz score
    const avgQuizScore =
      quizAttempts.length > 0
        ? quizAttempts.reduce((sum, q) => sum + (q.xp || 0), 0) /
          quizAttempts.length
        : 0;

    // Calculate consistency score
    const consistencyScore = this.calculateConsistency(student);

    // Calculate engagement level
    const engagementLevel = this.calculateEngagement(student);

    return {
      totalXP: student.xp || 0,
      lessonsCompleted,
      quizAttempts: quizAttempts.length,
      averageQuizScore: Math.round(avgQuizScore),
      consistencyScore,
      engagementLevel,
      strengths: this.identifyStrengths(student),
      weaknesses: this.identifyWeaknesses(student),
      recommendedPace: this.calculateLearningPace(student),
    };
  }

  /**
   * Calculate student consistency
   */
  calculateConsistency(student) {
    const activities = student.activities || [];
    if (activities.length < 7) return 50; // Not enough data

    // Group activities by day
    const dailyActivity = {};
    activities.forEach((a) => {
      const day = new Date(a.date).toDateString();
      dailyActivity[day] = (dailyActivity[day] || 0) + 1;
    });

    const activeDays = Object.keys(dailyActivity).length;
    const totalDays = 7; // Last 7 days

    return Math.round((activeDays / totalDays) * 100);
  }

  /**
   * Calculate engagement level
   */
  calculateEngagement(student) {
    const activities = student.activities || [];
    const lastWeek = activities.filter((a) => {
      const activityDate = new Date(a.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return activityDate >= weekAgo;
    });

    const weeklyActivity = lastWeek.length;

    if (weeklyActivity >= 10) return "very high";
    if (weeklyActivity >= 5) return "high";
    if (weeklyActivity >= 2) return "medium";
    return "low";
  }

  /**
   * Generate personalized recommendations
   */
  generateRecommendations(profile, performance, availableCourses) {
    const recommendations = {
      nextCourses: [],
      recommendedModules: [],
      focusAreas: [],
      learningStyle: profile.learningStyle,
      difficulty: this.recommendDifficulty(performance),
      pace: profile.learningPace,
    };

    // Recommend courses based on interests and weaknesses
    availableCourses.forEach((course) => {
      let relevanceScore = 0;

      // Check if course matches interests
      if (
        profile.interests.some((i) =>
          course.title.toLowerCase().includes(i.toLowerCase()),
        )
      ) {
        relevanceScore += 30;
      }

      // Check if course addresses weaknesses
      performance.weaknesses.forEach((weakness) => {
        if (course.title.toLowerCase().includes(weakness.topic.toLowerCase())) {
          relevanceScore += 50;
        }
      });

      // Check difficulty appropriateness
      const courseLevel = this.mapDifficultyToLevel(course.level);
      const studentLevel = profile.currentLevel;

      if (Math.abs(courseLevel - studentLevel) <= 1) {
        relevanceScore += 20;
      }

      if (relevanceScore > 50) {
        recommendations.nextCourses.push({
          ...course,
          relevanceScore,
          reason: this.getRecommendationReason(relevanceScore, course, profile),
        });
      }
    });

    // Sort by relevance
    recommendations.nextCourses.sort(
      (a, b) => b.relevanceScore - a.relevanceScore,
    );

    // Add focus areas based on weaknesses
    performance.weaknesses.forEach((weakness) => {
      recommendations.focusAreas.push({
        topic: weakness.topic,
        priority: weakness.priority,
        suggestedAction: `Review ${weakness.topic} fundamentals`,
      });
    });

    return recommendations;
  }

  /**
   * Map course level to numeric value
   */
  mapDifficultyToLevel(level) {
    const map = {
      Beginner: 1,
      Intermediate: 2,
      Advanced: 3,
      "All Levels": 2,
    };
    return map[level] || 2;
  }

  /**
   * Recommend appropriate difficulty level
   */
  recommendDifficulty(performance) {
    const avgScore = performance.averageQuizScore;
    const lessonsCompleted = performance.lessonsCompleted;

    if (avgScore > 85 && lessonsCompleted > 20) {
      return "advanced";
    } else if (avgScore > 70 || lessonsCompleted > 10) {
      return "intermediate";
    }
    return "beginner";
  }

  /**
   * Get human-readable recommendation reason
   */
  getRecommendationReason(score, course, profile) {
    if (score > 80) {
      return `This course matches your interest in ${profile.interests[0] || "this topic"}`;
    } else if (score > 60) {
      return "Recommended based on your learning goals";
    }
    return "Popular among students with similar profiles";
  }

  /**
   * Build structured learning path
   */
  buildLearningPath(recommendations) {
    const path = [];

    recommendations.nextCourses.slice(0, 3).forEach((course, index) => {
      const coursePath = {
        week: index + 1,
        course: course.title,
        modules: [],
        estimatedHours: this.estimateCourseHours(course),
        difficulty: course.level,
        reason: course.reason,
      };

      // Add modules from the course
      if (course.modules) {
        course.modules.forEach((module) => {
          coursePath.modules.push({
            title: module.title,
            lessons: module.lessons?.length || 0,
            hasQuiz: !!module.quiz,
          });
        });
      }

      path.push(coursePath);
    });

    return path;
  }

  /**
   * Estimate hours needed for course
   */
  estimateCourseHours(course) {
    const moduleCount = course.modules?.length || 5;
    const lessonsPerModule = 3;
    const minutesPerLesson = 15;

    const totalMinutes = moduleCount * lessonsPerModule * minutesPerModule;
    return Math.round(totalMinutes / 60);
  }

  /**
   * Get immediate next steps for student
   */
  getNextSteps(path, student) {
    const nextSteps = [];

    // Check if there's an incomplete course
    const enrolledCourses = student.profile?.enrolledCourses || [];
    const incompleteCourse = enrolledCourses.find((c) => c.progress < 100);

    if (incompleteCourse) {
      nextSteps.push({
        type: "continue",
        action: `Continue with ${incompleteCourse.title}`,
        priority: "high",
      });
    } else if (path.length > 0) {
      nextSteps.push({
        type: "start",
        action: `Start ${path[0].course}`,
        priority: "high",
      });
    }

    // Add review recommendations for weaknesses
    if (student.weaknesses?.length > 0) {
      nextSteps.push({
        type: "review",
        action: `Review ${student.weaknesses[0].topic}`,
        priority: "medium",
      });
    }

    return nextSteps;
  }

  /**
   * Update learning path based on new performance data
   */
  updatePath(currentPath, newPerformance) {
    // Check if path needs adjustment
    const needsAdjustment = this.checkPathAdjustment(
      currentPath,
      newPerformance,
    );

    if (!needsAdjustment) {
      return currentPath;
    }

    // Adjust difficulty or content
    const adjustedPath = { ...currentPath };

    // Increase difficulty if student is acing everything
    if (
      newPerformance.averageQuizScore > 90 &&
      newPerformance.consistencyScore > 80
    ) {
      adjustedPath.difficulty = "advanced";
    }

    // Add remedial modules if struggling
    if (newPerformance.averageQuizScore < 60) {
      adjustedPath.needsRemedial = true;
    }

    return adjustedPath;
  }

  /**
   * Check if path needs adjustment
   */
  checkPathAdjustment(path, performance) {
    if (!path) return true;

    // Check if performance has changed significantly
    const expectedDifficulty = this.recommendDifficulty(performance);
    const currentDifficulty = path.difficulty || "intermediate";

    return expectedDifficulty !== currentDifficulty;
  }
}

export default new AdaptiveLearningEngine();
