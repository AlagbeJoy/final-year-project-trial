import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LecturerSidebar from "../components/LecturerSidebar";
import CourseBuilder from "../components/lecturer/CourseBuilder";
import api from "../services/api"; 

function LecturerCreateCourse() {
  const { courseId } = useParams(); // Get courseId from URL if editing
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState({
    title: "",
    level: "Beginner",
    duration: "",
    description: "",
    instructor: currentUser?.name || "",
    thumbnail: "https://via.placeholder.com/300x200",
    units: [], // Changed from modules to units
    published: false,
    createdAt: new Date().toISOString(),
  });

  // Load course data if editing
  useEffect(() => {
    if (courseId) {
      setLoading(true);
      // Try to find course in localStorage first (for now)
      const existingCourses = JSON.parse(
        localStorage.getItem("lecturer_courses") || "[]",
      );
      const courseToEdit = existingCourses.find(
        (c) => c.id === parseInt(courseId) || c.id === courseId,
      );

      if (courseToEdit) {
        console.log("📝 Editing course:", courseToEdit);
        setCourseData(courseToEdit);
      } else {
        // If not in localStorage, maybe fetch from API later
        console.log("Course not found for editing");
      }
      setLoading(false);
    }
  }, [courseId]);

  const saveCourse = async () => {
    try {
      console.log("📦 Saving course to MongoDB...");
      console.log("📦 Course data BEFORE save:", courseData);
      console.log("📦 Units being saved:", courseData.units);
      console.log("📦 Units count:", courseData.units?.length || 0);
      
        if (courseData.units && courseData.units.length > 0) {
          console.log("📦 First unit:", courseData.units[0]);
        }

      let response;

      if (courseId) {
        // Update existing course
        response = await api.updateCourse(courseId, courseData);
        console.log("✅ Course updated:", response);
      } else {
        // Create new course
        response = await api.createCourse(courseData);
        console.log("✅ Course created:", response);
         console.log("🆔 NEW COURSE ID:", response._id); // ADD THIS LINE
         console.log("🔗 Course URL:", `/course/${response._id}`);
      }

      alert(
        courseId
          ? "Course updated successfully!"
          : "Course created successfully!",
      );
      navigate("/lecturer/courses");
    } catch (error) {
      console.error("❌ Error saving course:", error);
      alert("Failed to save course. Check console for details.");
    }
  };

  const updateCourseData = (newData) => {
    setCourseData({ ...courseData, ...newData });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <LecturerSidebar />
        <main className="flex-1 p-8">
          <div className="text-center">Loading course...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LecturerSidebar />

      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {courseId ? "Edit Course" : "Create New Course"}
          </h1>
          <p className="text-gray-600 mt-2">
            {courseId
              ? "Update your course content"
              : "Build your course with units and quizzes"}
          </p>
        </div>

        {/* Progress Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab("basic")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "basic"
                ? "text-[#5a6499] border-b-2 border-[#5a6499]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            1. Basic Information
          </button>
          <button
            onClick={() => setActiveTab("modules")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "modules"
                ? "text-[#5a6499] border-b-2 border-[#5a6499]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            2. Build Units
          </button>
          <button
            onClick={() => setActiveTab("publish")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "publish"
                ? "text-[#5a6499] border-b-2 border-[#5a6499]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            3. Review & Publish
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <CourseBuilder
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            courseData={courseData}
            updateCourseData={updateCourseData}
            saveCourse={saveCourse}
          />
        </div>
      </main>
    </div>
  );
}

export default LecturerCreateCourse;
