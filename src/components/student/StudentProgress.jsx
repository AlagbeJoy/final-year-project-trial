import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentProgress({ user }) {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [stats, setStats] = useState({
    totalUnits: 0,
    completedUnits: 0,
    overallProgress: 0,
    coursesCompleted: 0,
  });

  useEffect(() => {
    if (user?.profile?.enrolledCourses) {
      const courses = user.profile.enrolledCourses;
      setEnrolledCourses(courses);

      // Calculate real stats
      let totalUnits = 0;
      let completedUnits = 0;
      let coursesCompleted = 0;

      courses.forEach((course) => {
        const courseId = course.courseId || course.id;

        // Get saved progress for this course
        const savedProgress = JSON.parse(
          localStorage.getItem(`course_${courseId}_progress`) || "{}",
        );

        // Get total units from the stored course data
        const totalUnitsInCourse = course.units?.length || 1;
        const completedUnitsInCourse = Object.keys(savedProgress).filter(
          (key) => savedProgress[key].quizPassed,
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
        totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

      setStats({
        totalUnits,
        completedUnits,
        overallProgress,
        coursesCompleted,
      });
    }
  }, [user]);

  const getCourseProgress = (course) => {
    const courseId = course.courseId || course.id;
    const savedProgress = JSON.parse(
      localStorage.getItem(`course_${courseId}_progress`) || "{}",
    );
    const completedUnits = Object.keys(savedProgress).filter(
      (key) => savedProgress[key].quizPassed,
    ).length;
    const totalUnits = course.units?.length || 1;
    return Math.round((completedUnits / totalUnits) * 100);
  };

  if (enrolledCourses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <p className="text-gray-400">No courses enrolled yet</p>
        <button
          onClick={() => navigate("/studentcourses")}
          className="mt-4 bg-[#5a6499] text-white px-4 py-2 rounded-lg text-sm"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">📈 Your Progress</h2>
        <span className="text-sm text-gray-500">
          {stats.completedUnits}/{stats.totalUnits} units
        </span>
      </div>

      <div className="flex items-center gap-6">
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
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - stats.overallProgress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-[#5a6499]">
              {stats.overallProgress}%
            </span>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-gray-600 text-sm mb-3">
            {stats.completedUnits} of {stats.totalUnits} units completed
          </p>

          {enrolledCourses.slice(0, 3).map((course, index) => {
            const courseProgress = getCourseProgress(course);
            const courseTitle = course.title || `Course ${index + 1}`;

            return (
              <div key={index} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 truncate max-w-[180px]">
                    {courseTitle}
                  </span>
                  <span className="text-gray-500">{courseProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-[#5a6499] h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${courseProgress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}

          {enrolledCourses.length > 3 && (
            <button
              onClick={() => navigate("/progress")}
              className="text-xs text-[#5a6499] hover:underline mt-2"
            >
              View all {enrolledCourses.length} courses →
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t">
        <div className="text-center">
          <p className="text-xs text-gray-500">Courses</p>
          <p className="text-lg font-bold text-[#5a6499]">
            {enrolledCourses.length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Completed</p>
          <p className="text-lg font-bold text-green-600">
            {stats.coursesCompleted}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Units Done</p>
          <p className="text-lg font-bold text-yellow-600">
            {stats.completedUnits}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentProgress;
