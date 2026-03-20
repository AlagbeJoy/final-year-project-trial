import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

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

      // Get all users to calculate student data
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

        // Calculate course progress from enrolled students
        let courseProgress = 0;
        let courseCompletions = 0;

        courseEnrollments.forEach((enrollment) => {
          // Find student progress in localStorage (temporary)
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

          // Add to XP total
          const studentXP =
            students.find((s) => s.email === enrollment.studentId)?.xp || 0;
          totalXPGenerated += studentXP;
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
        });

        totalProgress += avgProgress;
        totalCompletions += courseCompletions;
      });

      const totalStudents = allEnrollments.length;
      const avgProgressOverall =
        myCourses.length > 0 ? totalProgress / myCourses.length : 0;
      const completionRateOverall =
        totalEnrollments > 0 ? (totalCompletions / totalEnrollments) * 100 : 0;

      // Get recent activity
      const recentActivity = [];
      students.forEach((student) => {
        if (student.activities) {
          student.activities.slice(0, 3).forEach((activity) => {
            recentActivity.push({
              studentName: student.name,
              ...activity,
              date: new Date(activity.date),
            });
          });
        }
      });

      // Sort by date and take latest 10
      const sortedActivity = recentActivity
        .sort((a, b) => b.date - a.date)
        .slice(0, 10);

      // Get popular courses (by enrollment)
      const popularCourses = [...coursePerformance]
        .sort((a, b) => b.students - a.students)
        .slice(0, 5);

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
        recentActivity: sortedActivity,
        popularCourses,
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
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-8">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">📊</span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                analytics.totalEnrollments > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {analytics.totalEnrollments > 0 ? "Active" : "No data"}
            </span>
          </div>
          <p className="text-2xl font-bold text-[#5a6499]">
            {analytics.totalEnrollments}
          </p>
          <p className="text-sm text-gray-500">Total Enrollments</p>
          <p className="text-xs text-gray-400 mt-1">
            Across {analytics.totalCourses} courses
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">👥</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {analytics.totalStudents}
          </p>
          <p className="text-sm text-gray-500">Unique Students</p>
          <p className="text-xs text-gray-400 mt-1">
            Avg{" "}
            {analytics.totalCourses > 0
              ? Math.round(analytics.totalEnrollments / analytics.totalCourses)
              : 0}{" "}
            per course
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">📈</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">
            {analytics.averageProgress}%
          </p>
          <p className="text-sm text-gray-500">Avg. Progress</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-yellow-500 h-2 rounded-full"
              style={{ width: `${analytics.averageProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">🎓</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {analytics.completionRate}%
          </p>
          <p className="text-sm text-gray-500">Completion Rate</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${analytics.completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-500 mb-1">Content Created</p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-3xl font-bold text-[#5a6499]">
                {analytics.totalUnits}
              </p>
              <p className="text-xs text-gray-400">Learning Units</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                {analytics.totalQuizzes}
              </p>
              <p className="text-xs text-gray-400">Quizzes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-500 mb-1">XP Generated</p>
          <p className="text-3xl font-bold text-orange-600">
            {analytics.totalXPGenerated.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Total XP earned by students
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-sm text-gray-500 mb-1">Course Health</p>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                analytics.completionRate > 70
                  ? "bg-green-500"
                  : analytics.completionRate > 40
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm font-medium">
              {analytics.completionRate > 70
                ? "Excellent"
                : analytics.completionRate > 40
                  ? "Good"
                  : "Needs Improvement"}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {analytics.totalCourses -
              analytics.coursePerformance.filter((c) => c.students > 0)
                .length}{" "}
            courses with no students
          </p>
        </div>
      </div>

      {/* Course Performance Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
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
                    Completed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {analytics.coursePerformance.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{course.title}</td>
                    <td className="px-4 py-3 text-center">{course.students}</td>
                    <td className="px-4 py-3 text-center">{course.units}</td>
                    <td className="px-4 py-3 text-center">{course.quizzes}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{course.avgProgress}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#5a6499] h-2 rounded-full"
                            style={{ width: `${course.avgProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        {course.completions} students
                      </span>
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
                    <p className="text-xs text-gray-500">
                      {course.students} students enrolled
                    </p>
                  </div>
                  <span className="bg-[#5a6499] text-white px-2 py-1 rounded text-sm">
                    {course.students}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4">🕒 Recent Activity</h3>

          {analytics.recentActivity.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No recent activity</p>
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
                    <p className="text-xs text-gray-600">{activity.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.date.toLocaleDateString()} at{" "}
                      {activity.date.toLocaleTimeString()}
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
    </div>
  );
}

export default LecturerAnalytics;
