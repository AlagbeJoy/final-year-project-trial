import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LecturerSidebar from "../components/LecturerSidebar";
import api from "../services/api"; // Import api

function LecturerCourses() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching courses from API...");

      // Get ALL courses from API
      const response = await api.getCourses();
      console.log("✅ API Response:", response);

      // Handle different response formats
      const allCourses = Array.isArray(response)
        ? response
        : response.courses || [];
      console.log("📚 All courses:", allCourses);

      // Filter courses created by this lecturer
      const myCourses = allCourses.filter(
        (c) =>
          c.instructor?.email === currentUser?.email ||
          c.instructorId === currentUser?.id ||
          c.instructor === currentUser?.id,
      );

      console.log("👨‍🏫 My courses:", myCourses);
      setCourses(myCourses);
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    if (window.confirm("Delete this course?")) {
      try {
        await api.deleteCourse(courseId);
        // Refresh list after delete
        fetchCourses();
      } catch (error) {
        console.error("❌ Error deleting course:", error);
        alert("Failed to delete course");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <LecturerSidebar />
        <main className="flex-1 p-8">
          <div className="text-center">Loading courses...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LecturerSidebar />

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <button
            onClick={() => navigate("/lecturer/create-course")}
            className="bg-[#5a6499] text-white px-4 py-2 rounded"
          >
            + Create Course
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-lg">
            <p className="text-gray-500 mb-4">No courses yet</p>
            <button
              onClick={() => navigate("/lecturer/create-course")}
              className="bg-[#5a6499] text-white px-4 py-2 rounded"
            >
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Units: {course.units?.length || 0}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/lecturer/edit-course/${course._id}`)
                      }
                      className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCourse(course._id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
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
