import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import api from "../../services/api";

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await api.getCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">Loading courses...</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          📚 Course Management
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-lg mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {course.description?.substring(0, 100)}...
              </p>
              <p className="text-sm text-gray-500">
                Instructor: {course.instructor?.name || "Unknown"}
              </p>
              <p className="text-sm text-gray-500">Level: {course.level}</p>
              <p className="text-sm text-gray-500">
                Units: {course.units?.length || 0}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminCourses;
