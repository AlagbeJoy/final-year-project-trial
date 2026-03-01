import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import LecturerSidebar from "../components/LecturerSidebar";

function LecturerAnalytics() {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    // Load courses
    const allCourses = JSON.parse(
      localStorage.getItem("lecturer_courses") || "[]",
    );
    const myCourses = allCourses.filter(
      (c) => c.instructorId === currentUser?.email,
    );
    setCourses(myCourses);

    // Calculate analytics
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    let studentCount = 0;
    let xpTotal = 0;

    allUsers.forEach((user) => {
      if (user.role === "student") {
        studentCount++;
        xpTotal += user.xp || 0;
      }
    });

    setTotalStudents(studentCount);
    setTotalXP(xpTotal);
  }, [currentUser]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LecturerSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Analytics Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500 text-sm mb-2">Total Courses</h3>
            <p className="text-3xl font-bold text-[#5a6499]">
              {courses.length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500 text-sm mb-2">Total Students</h3>
            <p className="text-3xl font-bold text-[#5a6499]">{totalStudents}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500 text-sm mb-2">Total XP Earned</h3>
            <p className="text-3xl font-bold text-[#5a6499]">{totalXP}</p>
          </div>
        </div>

        {/* Course Performance */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Course Performance</h2>

          {courses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No courses created yet.
            </p>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{course.title}</h3>
                    <span className="text-sm text-gray-500">
                      {course.level}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Modules:</span>{" "}
                      <span className="font-medium">
                        {course.modules?.length || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Students:</span>{" "}
                      <span className="font-medium">0</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Completion:</span>{" "}
                      <span className="font-medium">0%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default LecturerAnalytics;
