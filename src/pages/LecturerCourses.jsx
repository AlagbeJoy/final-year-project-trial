import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LecturerSidebar from "../components/LecturerSidebar";

function LecturerCourses() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Load courses created by this lecturer
    const allCourses = JSON.parse(
      localStorage.getItem("lecturer_courses") || "[]",
    );
    const myCourses = allCourses.filter(
      (c) => c.instructorId === currentUser?.email,
    );
    setCourses(myCourses);
  }, [currentUser]);

  const deleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      const allCourses = JSON.parse(
        localStorage.getItem("lecturer_courses") || "[]",
      );
      const updatedCourses = allCourses.filter((c) => c.id !== courseId);
      localStorage.setItem("lecturer_courses", JSON.stringify(updatedCourses));
      setCourses(
        updatedCourses.filter((c) => c.instructorId === currentUser?.email),
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LecturerSidebar />

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
          <button
            onClick={() => navigate("/lecturer/create-course")}
            className="bg-[#5a6499] text-white px-4 py-2 rounded-lg hover:bg-[#4a5499] transition"
          >
            + Create New Course
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-500 mb-4">
              You haven't created any courses yet.
            </p>
            <button
              onClick={() => navigate("/lecturer/create-course")}
              className="bg-[#5a6499] text-white px-6 py-3 rounded-lg hover:bg-[#4a5499] transition"
            >
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <img
                  src={
                    course.thumbnail || "https://via.placeholder.com/300x200"
                  }
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {course.level}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {course.duration}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/lecturer/edit-course/${course.id}`)
                      }
                      className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default LecturerCourses;
