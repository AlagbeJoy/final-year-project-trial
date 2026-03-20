import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LecturerSidebar from "../components/LecturerSidebar";
import api from "../services/api";

function LecturerAnalytics() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEnrollments: 0,
    totalUnits: 0,
    totalQuizzes: 0,
    totalXPGenerated: 0,
    averageProgress: 0,
    completionRate: 0,
    coursePerformance: [],
    recentActivity: [],
    popularCourses: [],
    dailyActivity: [],
    studentGrowth: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Get all courses from API
      const courses = await api.getCourses();
      console.log("📚 All courses:", courses);

      // Filter courses by current lecturer
      const myCourses = Array.isArray(courses)
        ? courses.filter(
            (c) =>
              c.instructor?.email === currentUser?.email ||
              c.instructor === currentUser?.id,
          )
        : [];

      console.log("👨‍🏫 My courses:", myCourses);

      // Get all users
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const students = users.filter((u) => u.role === "student");

      // Calculate analytics
      let totalEnrollments = 0;
      let totalUnits = 0;
      let totalQuizzes = 0;
      let totalXPGenerated = 0;
      let totalProgress = 0;
      let totalCompletions = 0;
      let allEnrollments = [];
      let coursePerformance = [];
      let allActivities = [];

      myCourses.forEach((course) => {
        const courseEnrollments = course.students || [];
        const units = course.units || course.modules || [];
        const unitCount = units.length;
        const quizCount = units.filter(
          (u) => u.quiz && u.quiz.questions?.length > 0,
        ).length;

        totalUnits += unitCount;
        totalQuizzes += quizCount;
        totalEnrollments += courseEnrollments.length;

        // Track unique students
        courseEnrollments.forEach((s) => {
          if (!allEnrollments.find((e) => e.studentId === s.studentId)) {
            allEnrollments.push(s);
          }
        });

        // Calculate course progress
        let courseProgress = 0;
        let courseCompletions = 0;

        courseEnrollments.forEach((enrollment) => {
          const progress = JSON.parse(
            localStorage.getItem(`course_${course._id}_progress`) || "{}",
          );
          const unitsCompleted = Object.values(progress).filter(
            (p) => p.quizPassed,
          ).length;
          const progressPercent =
            unitCount > 0 ? (unitsCompleted / unitCount) * 100 : 0;

          courseProgress += progressPercent;
          if (progressPercent >= 100) courseCompletions++;

          // Track activities
          const student = students.find(
            (s) => s.email === enrollment.studentId,
          );
          if (student?.activities) {
            student.activities.forEach((activity) => {
              allActivities.push({
                studentName: student.name,
                ...activity,
                courseTitle: course.title,
                date: new Date(activity.date),
              });
            });
          }
        });

        const avgProgress =
          courseEnrollments.length > 0
            ? courseProgress / courseEnrollments.length
            : 0;
        const completionRate =
          courseEnrollments.length > 0
            ? (courseCompletions / courseEnrollments.length) * 100
            : 0;

        coursePerformance.push({
          id: course._id,
          title: course.title,
          students: courseEnrollments.length,
          units: unitCount,
          quizzes: quizCount,
          avgProgress: Math.round(avgProgress),
          completionRate: Math.round(completionRate),
          completions: courseCompletions,
          createdAt: new Date(course.createdAt).toLocaleDateString(),
        });

        totalProgress += avgProgress;
        totalCompletions += courseCompletions;
      });

      const totalStudents = allEnrollments.length;
      const avgProgressOverall =
        myCourses.length > 0 ? totalProgress / myCourses.length : 0;
      const completionRateOverall =
        totalEnrollments > 0 ? (totalCompletions / totalEnrollments) * 100 : 0;

      // Calculate total XP
      students.forEach((student) => {
        totalXPGenerated += student.xp || 0;
      });

      // Get recent activity (last 20)
      const recentActivity = allActivities
        .sort((a, b) => b.date - a.date)
        .slice(0, 20);

      // Get popular courses
      const popularCourses = [...coursePerformance]
        .sort((a, b) => b.students - a.students)
        .slice(0, 5);

      // Calculate daily activity for last 7 days
      const dailyActivity = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();

        const dayActivities = allActivities.filter(
          (a) => a.date.toDateString() === dateStr,
        ).length;

        dailyActivity.push({
          date: dateStr.slice(0, 3),
          count: dayActivities,
        });
      }

      // Student growth over time
      const studentGrowth = [];
      const enrollmentsByMonth = {};

      allEnrollments.forEach((e) => {
        const month = new Date(e.enrolledAt).toLocaleString("default", {
          month: "short",
        });
        enrollmentsByMonth[month] = (enrollmentsByMonth[month] || 0) + 1;
      });

      Object.entries(enrollmentsByMonth).forEach(([month, count]) => {
        studentGrowth.push({ month, count });
      });

      setAnalytics({
        totalCourses: myCourses.length,
        totalStudents,
        totalEnrollments,
        totalUnits,
        totalQuizzes,
        totalXPGenerated,
        averageProgress: Math.round(avgProgressOverall),
        completionRate: Math.round(completionRateOverall),
        coursePerformance,
        recentActivity,
        popularCourses,
        dailyActivity,
        studentGrowth,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "enrollment":
        return "📚";
      case "lesson":
        return "📖";
      case "quiz":
        return "📝";
      case "unit":
        return "📗";
      case "achievement":
        return "🏆";
      default:
        return "⭐";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <LecturerSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#5a6499] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LecturerSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            📈 Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Detailed insights into your courses and student engagement
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">📚</span>
            </div>
            <p className="text-2xl font-bold text-[#5a6499]">
              {analytics.totalCourses}
            </p>
            <p className="text-sm text-gray-500">Total Courses</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">👥</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {analytics.totalStudents}
            </p>
            <p className="text-sm text-gray-500">Unique Students</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {analytics.totalEnrollments}
            </p>
            <p className="text-sm text-gray-500">Total Enrollments</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">⭐</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {analytics.totalXPGenerated.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Total XP Generated</p>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">📈 Average Progress</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="#5a6499"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - analytics.averageProgress / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-[#5a6499]">
                    {analytics.averageProgress}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-gray-600">Students are</p>
                <p className="text-2xl font-bold">
                  {analytics.averageProgress > 70
                    ? "🚀 Ahead"
                    : analytics.averageProgress > 40
                      ? "📚 On Track"
                      : "🐢 Getting Started"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">🎓 Completion Rate</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - analytics.completionRate / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-green-600">
                    {analytics.completionRate}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-gray-600">Courses completed</p>
                <p className="text-2xl font-bold">
                  {analytics.completionRate > 70
                    ? "🏆 Excellent"
                    : analytics.completionRate > 40
                      ? "👍 Good"
                      : "💪 Need Improvement"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">📚 Content Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">
                  {analytics.totalUnits}
                </p>
                <p className="text-sm text-gray-600">Learning Units</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">
                  {analytics.totalQuizzes}
                </p>
                <p className="text-sm text-gray-600">Quizzes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              📊 Daily Activity (Last 7 Days)
            </h3>
            <div className="flex items-end justify-between h-32 gap-2">
              {analytics.dailyActivity.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-[#5a6499] rounded-t"
                    style={{ height: `${Math.max(day.count * 8, 4)}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">{day.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Performance Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">📋 Course Performance</h3>

          {analytics.coursePerformance.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No courses yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Course
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                      Students
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                      Units
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                      Quizzes
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                      Avg Progress
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                      Completion
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {analytics.coursePerformance.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{course.title}</td>
                      <td className="px-4 py-3 text-center">
                        {course.students}
                      </td>
                      <td className="px-4 py-3 text-center">{course.units}</td>
                      <td className="px-4 py-3 text-center">
                        {course.quizzes}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm w-8">
                            {course.avgProgress}%
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#5a6499] h-2 rounded-full"
                              style={{ width: `${course.avgProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            course.completionRate > 70
                              ? "bg-green-100 text-green-700"
                              : course.completionRate > 40
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {course.completionRate}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-500">
                        {course.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Popular Courses & Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Popular Courses */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">🔥 Popular Courses</h3>

            {analytics.popularCourses.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No data yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.popularCourses.map((course, index) => (
                  <div key={course.id} className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400 w-6">
                      #{index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{course.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {course.students} students
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {course.completions} completed
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">🕒 Recent Activity</h3>

            {analytics.recentActivity.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                No recent activity
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {analytics.recentActivity.map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded"
                  >
                    <span className="text-2xl">
                      {getActivityIcon(activity.type)}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {activity.studentName}
                      </p>
                      <p className="text-xs text-gray-600">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.date.toLocaleDateString()} at{" "}
                        {activity.date.toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-[#5a6499] mt-1">
                        {activity.courseTitle}
                      </p>
                    </div>
                    {activity.xp > 0 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        +{activity.xp} XP
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default LecturerAnalytics;
