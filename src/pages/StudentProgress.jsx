import React, { useState, useEffect } from "react";
import StudentSidebar from "../components/StudentSidebar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function StudentProgress() {
  const { currentUser } = useAuth(); // Make sure this is here
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [stats, setStats] = useState({
    totalUnits: 0,
    completedUnits: 0,
    overallProgress: 0,
    coursesCompleted: 0,
  });

  useEffect(() => {
    if (currentUser?.profile?.enrolledCourses) {
      const courses = currentUser.profile.enrolledCourses;
      console.log("📚 Enrolled courses:", courses);
      setEnrolledCourses(courses);
      calculateStats(courses);
    }
  }, [currentUser]);

  const calculateStats = (courses) => {
    let totalUnits = 0;
    let completedUnits = 0;
    let coursesCompleted = 0;

    courses.forEach((course) => {
      const courseId = course.courseId || course.id;

      const savedProgress = JSON.parse(
        localStorage.getItem(`course_${courseId}_progress`) || "{}",
      );
      const totalUnitsInCourse = course.units?.length || 1;
      const completedUnitsInCourse = Object.values(savedProgress).filter(
        (p) => p.quizPassed === true,
      ).length;

      totalUnits += totalUnitsInCourse;
      completedUnits += completedUnitsInCourse;

      if (
        completedUnitsInCourse === totalUnitsInCourse &&
        totalUnitsInCourse > 0
      ) {
        coursesCompleted++;
      }
    });

    const overallProgress =
      totalUnits > 0
        ? Math.min(Math.round((completedUnits / totalUnits) * 100), 100)
        : 0;

    setStats({
      totalUnits,
      completedUnits,
      overallProgress,
      coursesCompleted,
    });
  };

  const getCourseProgress = (course) => {
    const courseId = course.courseId || course.id;
    const savedProgress = JSON.parse(
      localStorage.getItem(`course_${courseId}_progress`) || "{}",
    );
    const completedUnits = Object.values(savedProgress).filter(
      (p) => p.quizPassed === true,
    ).length;
    const totalUnits = course.units?.length || 1;
    return Math.min(Math.round((completedUnits / totalUnits) * 100), 100);
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <StudentSidebar />
        <main className="flex-1 p-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <StudentSidebar />
        <main className="flex-1 p-8">
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500">No courses enrolled yet</p>
            <button
              onClick={() => navigate("/studentcourses")}
              className="mt-4 bg-[#5a6499] text-white px-6 py-2 rounded-lg"
            >
              Browse Courses
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📊 My Progress</h1>
          <p className="text-gray-600">
            Track your learning journey and achievements
          </p>
        </div>

        {/* Overall Progress Card */}
        <div className="bg-gradient-to-r from-[#5a6499] to-[#7c83b3] rounded-xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Overall Progress</p>
              <p className="text-4xl font-bold">{stats.overallProgress}%</p>
              <p className="text-sm opacity-90 mt-2">
                {stats.completedUnits} of {stats.totalUnits} units completed
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
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - stats.overallProgress / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {stats.overallProgress}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-gray-500 text-sm">Total XP</p>
            <p className="text-2xl font-bold text-[#5a6499]">
              {currentUser.xp || 0}
            </p>
            <p className="text-xs text-gray-400 mt-1">Lifetime earnings</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-gray-500 text-sm">Units Done</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.completedUnits}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              of {stats.totalUnits} total
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-gray-500 text-sm">Courses</p>
            <p className="text-2xl font-bold text-yellow-600">
              {enrolledCourses.length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Enrolled</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.coursesCompleted}
            </p>
            <p className="text-xs text-gray-400 mt-1">Courses finished</p>
          </div>
        </div>

        {/* Course Progress Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">
            Course Progress Details
          </h2>
          <div className="space-y-4">
            {enrolledCourses.map((course, index) => {
              const courseProgress = getCourseProgress(course);
              const totalUnits = course.units?.length || 1;
              const completedUnits = Math.round(
                (courseProgress / 100) * totalUnits,
              );
              const courseTitle = course.title || "Course";

              return (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{courseTitle}</h3>
                    <span className="text-sm font-bold text-[#5a6499]">
                      {courseProgress}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-[#5a6499] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${courseProgress}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      {completedUnits} of {totalUnits} units completed
                    </span>
                    {courseProgress === 100 && (
                      <span className="text-green-600">✓ Completed</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentProgress;
