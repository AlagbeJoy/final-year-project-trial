import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LecturerSidebar from "../components/LecturerSidebar";
import api from "../services/api";


function LecturerDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEnrollments: 0,
    totalUnits: 0,
    totalQuizzes: 0,
    recentEnrollments: [],
    courseStats: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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

      // Calculate statistics
      let totalStudents = 0;
      let totalEnrollments = 0;
      let totalUnits = 0;
      let totalQuizzes = 0;
      let allEnrollments = [];

      const courseStats = myCourses.map((course) => {
        const students = course.students || [];
        const units = course.units || course.modules || [];
        const unitCount = units.length;
        const quizCount = units.filter(
          (u) => u.quiz && u.quiz.questions?.length > 0,
        ).length;

        totalUnits += unitCount;
        totalQuizzes += quizCount;
        totalEnrollments += students.length;

        // Collect unique students
        students.forEach((s) => {
          if (!allEnrollments.find((e) => e.studentId === s.studentId)) {
            allEnrollments.push(s);
          }
        });

        return {
          id: course._id,
          title: course.title,
          students: students.length,
          units: unitCount,
          quizzes: quizCount,
          recentStudents: students.slice(-3), // Last 3 students
        };
      });

      totalStudents = allEnrollments.length;

      // Get recent enrollments (last 5)
      const recentEnrollments = allEnrollments
        .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
        .slice(0, 5);

      setStats({
        totalCourses: myCourses.length,
        totalStudents,
        totalEnrollments,
        totalUnits,
        totalQuizzes,
        recentEnrollments,
        courseStats,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <LecturerSidebar />
        <main className="flex-1 p-8">
          <div className="text-center">Loading dashboard...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LecturerSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#5a6499] to-[#7c83b3] rounded-xl shadow-lg p-6 mb-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {currentUser?.name?.split(" ")[0]}! 👨‍🏫
          </h1>
          <p className="opacity-90">
            Here's what's happening with your courses
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📚</span>
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <p className="text-2xl font-bold text-[#5a6499]">
              {stats.totalCourses}
            </p>
            <p className="text-sm text-gray-500">Courses Created</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">👥</span>
              <span className="text-xs text-gray-400">Unique</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {stats.totalStudents}
            </p>
            <p className="text-sm text-gray-500">Total Students</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📊</span>
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.totalEnrollments}
            </p>
            <p className="text-sm text-gray-500">Course Enrollments</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📖</span>
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {stats.totalUnits}
            </p>
            <p className="text-sm text-gray-500">Learning Units</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📝</span>
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {stats.totalQuizzes}
            </p>
            <p className="text-sm text-gray-500">Quizzes</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Course List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Your Courses</h2>
                <button
                  onClick={() => navigate("/lecturer/create-course")}
                  className="bg-[#5a6499] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#4a5499]"
                >
                  + New Course
                </button>
              </div>

              {stats.courseStats.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No courses yet</p>
                  <button
                    onClick={() => navigate("/lecturer/create-course")}
                    className="bg-[#5a6499] text-white px-4 py-2 rounded-lg"
                  >
                    Create Your First Course
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.courseStats.map((course) => (
                    <div
                      key={course.id}
                      className="border rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">
                          {course.title}
                        </h3>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {course.students} students
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-3 text-sm text-gray-500">
                        <div>📚 {course.units} units</div>
                        <div>📝 {course.quizzes} quizzes</div>
                        <div>👥 {course.students} enrolled</div>
                      </div>

                      {course.recentStudents.length > 0 && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs text-gray-400 mb-1">
                            Recent enrollments:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {course.recentStudents.map((student, i) => (
                              <span
                                key={i}
                                className="bg-gray-100 text-xs px-2 py-1 rounded"
                              >
                                {student.studentName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() =>
                            navigate(`/lecturer/edit-course/${course.id}`)
                          }
                          className="text-sm text-[#5a6499] hover:underline"
                        >
                          Edit Course
                        </button>
                        <button
                          onClick={() => navigate(`/course/${course.id}`)}
                          className="text-sm text-gray-500 hover:underline"
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Recent Enrollments</h2>

              {stats.recentEnrollments.length === 0 ? (
                <p className="text-gray-400 text-center py-4">
                  No enrollments yet
                </p>
              ) : (
                <div className="space-y-4">
                  {stats.recentEnrollments.map((enrollment, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-[#5a6499] rounded-full flex items-center justify-center text-white text-sm">
                        {enrollment.studentName?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {enrollment.studentName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Enrolled{" "}
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Stats */}
              <div className="mt-6 pt-4 border-t">
                <h3 className="font-semibold mb-3">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Avg students per course:
                    </span>
                    <span className="font-medium">
                      {stats.totalCourses > 0
                        ? Math.round(
                            stats.totalEnrollments / stats.totalCourses,
                          )
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Most popular course:</span>
                    <span className="font-medium">
                      {stats.courseStats.length > 0
                        ? stats.courseStats.reduce((max, c) =>
                            c.students > max.students ? c : max,
                          ).title
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LecturerDashboard;
