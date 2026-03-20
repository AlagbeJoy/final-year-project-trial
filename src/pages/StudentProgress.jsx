import React, { useState, useEffect } from "react";
import StudentSidebar from "../components/StudentSidebar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function StudentProgress() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [statistics, setStatistics] = useState({
    totalXP: 0,
    totalLessons: 0,
    completedLessons: 0,
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    coursesCompleted: 0,
  });

  if (!currentUser) return <div>Loading...</div>;

  const enrolledCourses = currentUser?.profile?.enrolledCourses || [];

  useEffect(() => {
    // Calculate detailed statistics
    let totalLessons = 0;
    let completedLessons = 0;
    let totalQuizzes = 0;
    let completedQuizzes = 0;
    let totalScore = 0;
    let quizCount = 0;
    let coursesCompleted = 0;

    enrolledCourses.forEach((course) => {
      const courseLessons =
        course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) ||
        0;

      const courseCompleted = course.completedLessons?.length || 0;
      const courseQuizzes = course.modules?.filter((m) => m.quiz).length || 0;
      const courseQuizzesCompleted = course.completedQuizzes?.length || 0;

      totalLessons += courseLessons;
      completedLessons += courseCompleted;
      totalQuizzes += courseQuizzes;
      completedQuizzes += courseQuizzesCompleted;

      if (course.progress === 100) coursesCompleted++;
    });

    // Get quiz scores from activities
    const quizActivities =
      currentUser.activities?.filter((a) => a.type === "quiz") || [];
    quizActivities.forEach((quiz) => {
      const score = parseInt(quiz.message.match(/\d+%/)?.[0] || "0");
      if (score > 0) {
        totalScore += score;
        quizCount++;
      }
    });

    setStatistics({
      totalXP: currentUser.xp || 0,
      totalLessons,
      completedLessons,
      totalQuizzes,
      completedQuizzes,
      averageScore: quizCount > 0 ? Math.round(totalScore / quizCount) : 0,
      totalTimeSpent: completedLessons * 15 + completedQuizzes * 10, // estimate
      coursesCompleted,
    });
  }, [currentUser, enrolledCourses]);

  const overallProgress =
    statistics.totalLessons > 0
      ? Math.round(
          (statistics.completedLessons / statistics.totalLessons) * 100,
        )
      : 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📊 My Progress
          </h1>
          <p className="text-gray-600">
            Track your learning journey and achievements
          </p>
        </div>

        {/* Overall Progress Card */}
        <div className="bg-gradient-to-r from-[#5a6499] to-[#7c83b3] rounded-xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Overall Progress</p>
              <p className="text-4xl font-bold">{overallProgress}%</p>
              <p className="text-sm opacity-90 mt-2">
                {statistics.completedLessons} of {statistics.totalLessons}{" "}
                lessons completed
              </p>
            </div>
            <div className="w-32 h-32 relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke="white"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - overallProgress / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{overallProgress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-gray-500 text-sm">Total XP</p>
            <p className="text-2xl font-bold text-[#5a6499]">
              {statistics.totalXP}
            </p>
            <p className="text-xs text-gray-400 mt-1">Lifetime earnings</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-gray-500 text-sm">Lessons Done</p>
            <p className="text-2xl font-bold text-green-600">
              {statistics.completedLessons}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              of {statistics.totalLessons} total
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-gray-500 text-sm">Quizzes Passed</p>
            <p className="text-2xl font-bold text-yellow-600">
              {statistics.completedQuizzes}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              of {statistics.totalQuizzes} total
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-gray-500 text-sm">Average Score</p>
            <p className="text-2xl font-bold text-purple-600">
              {statistics.averageScore}%
            </p>
            <p className="text-xs text-gray-400 mt-1">on quizzes</p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-gray-500 text-sm">Time Invested</p>
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(statistics.totalTimeSpent / 60)} hours
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Approximately {statistics.totalTimeSpent} minutes
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-gray-500 text-sm">Courses Completed</p>
            <p className="text-2xl font-bold text-orange-600">
              {statistics.coursesCompleted}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              of {enrolledCourses.length} enrolled
            </p>
          </div>
        </div>

        {/* Course Progress Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">
            Course Progress Details
          </h2>

          {enrolledCourses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No courses enrolled yet.</p>
              <button
                onClick={() => navigate("/studentcourses")}
                className="bg-[#5a6499] text-white px-6 py-2 rounded-lg"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {enrolledCourses.map((course, index) => {
                const courseLessons =
                  course.modules?.reduce(
                    (acc, m) => acc + (m.lessons?.length || 0),
                    0,
                  ) || 0;
                const courseCompleted = course.completedLessons?.length || 0;
                const courseProgress =
                  courseLessons > 0
                    ? Math.round((courseCompleted / courseLessons) * 100)
                    : 0;

                return (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() =>
                        setExpandedCourse(
                          expandedCourse === index ? null : index,
                        )
                      }
                    >
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <p className="text-sm text-gray-500">
                          {courseCompleted} of {courseLessons} lessons completed
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-[#5a6499]">
                          {courseProgress}%
                        </span>
                        <span className="text-gray-400">
                          {expandedCourse === index ? "▼" : "▶"}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-[#5a6499] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${courseProgress}%` }}
                      ></div>
                    </div>

                    {expandedCourse === index && (
                      <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400">Lessons</p>
                          <p className="font-medium">
                            {courseCompleted}/{courseLessons}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Quizzes</p>
                          <p className="font-medium">
                            {course.completedQuizzes?.length || 0}/
                            {course.modules?.filter((m) => m.quiz).length || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Last Activity</p>
                          <p className="font-medium text-sm">
                            {course.lastActivity
                              ? new Date(
                                  course.lastActivity,
                                ).toLocaleDateString()
                              : "Not started"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Enrolled</p>
                          <p className="font-medium text-sm">
                            {new Date(course.enrolledAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentProgress;
