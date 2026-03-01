import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LecturerSidebar from "../components/LecturerSidebar";
import CourseBuilder from "../components/lecturer/CourseBuilder"; // Path updated

function LecturerCreateCourse() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic"); // basic, modules, publish

  const [courseData, setCourseData] = useState({
    title: "",
    level: "Beginner",
    duration: "",
    description: "",
    instructor: currentUser?.name || "",
    thumbnail: "https://via.placeholder.com/300x200",
    modules: [],
    published: false,
    createdAt: new Date().toISOString(),
  });

  const saveCourse = () => {
    // Get existing courses from localStorage
    const existingCourses = JSON.parse(
      localStorage.getItem("lecturer_courses") || "[]",
    );

    // Add new course with unique ID
    const newCourse = {
      ...courseData,
      id: Date.now(),
      instructorId: currentUser?.email,
      lastUpdated: new Date().toISOString(),
    };

    existingCourses.push(newCourse);
    localStorage.setItem("lecturer_courses", JSON.stringify(existingCourses));

    alert("Course saved successfully!");
    navigate("/lecturerdashboard");
  };

  const updateCourseData = (newData) => {
    setCourseData({ ...courseData, ...newData });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LecturerSidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Create New Course
          </h1>
          <p className="text-gray-600 mt-2">
            Build your course with modules, lessons, and quizzes
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
            2. Build Modules
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
