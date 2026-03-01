import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function LecturerAnalytics() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [recentCourses, setRecentCourses] = useState([]);

  useEffect(() => {
    // Load recent courses
    const allCourses = JSON.parse(
      localStorage.getItem("lecturer_courses") || "[]",
    );
    const myCourses = allCourses
      .filter((c) => c.instructorId === currentUser?.email)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);

    setRecentCourses(myCourses);
  }, [currentUser]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">📊 Recent Courses</h2>
        <button
          onClick={() => navigate("/lecturer/courses")}
          className="text-[#5a6499] hover:text-[#4a5499] text-sm font-medium"
        >
          View All →
        </button>
      </div>

      {recentCourses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">No courses created yet</p>
          <button
            onClick={() => navigate("/lecturer/create-course")}
            className="bg-[#5a6499] text-white px-6 py-2 rounded-lg hover:bg-[#4a5499] transition"
          >
            Create Your First Course
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {recentCourses.map((course) => (
            <div
              key={course.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                    {course.description}
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {course.modules?.length || 0} modules
                </span>
              </div>

              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span>
                  📅 {new Date(course.createdAt).toLocaleDateString()}
                </span>
                <span>📊 {course.level}</span>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigate(`/lecturer/edit-course/${course.id}`)}
                  className="text-[#5a6499] hover:text-[#4a5499] text-sm font-medium"
                >
                  Edit Course
                </button>
                <button
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LecturerAnalytics;
