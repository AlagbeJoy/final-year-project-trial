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
    startDate: "",
    endDate: "",
    releaseSchedule: "all",
  });

  // Load course data if editing
  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

 const fetchCourseData = async () => {
   try {
     setLoading(true);
     console.log("📝 Loading course for editing from API:", courseId);

     const response = await api.getCourse(courseId);
     console.log("✅ Course data loaded from API:", response);
     console.log("📚 Units loaded:", response.units);
     console.log("📚 Units count:", response.units?.length || 0);

     // Convert loaded units to the format expected by the form
     const loadedUnits =
       response.units?.map((unit) => ({
         title: unit.title || "",
         lecture: {
           content: unit.lecture?.content || "",
           videoUrl: unit.lecture?.videoUrl || "",
           materials: unit.lecture?.materials || [],
         },
         quiz: {
           questions:
             unit.quiz?.questions?.map((q) => ({
               question: q.question || "",
               options: q.options || ["", "", "", ""],
               correctAnswer: q.correctAnswer || 0,
               explanation: q.explanation || "",
             })) || [],
         },
         xpReward: unit.xpReward || 80,
         releaseDate: unit.releaseDate || null,
       })) || [];

     setCourseData({
       title: response.title || "",
       level: response.level || "Beginner",
       duration: response.duration || "",
       description: response.description || "",
       thumbnail: response.thumbnail || "https://via.placeholder.com/300x200",
       units: loadedUnits,
       published: response.published || false,
       createdAt: response.createdAt || new Date().toISOString(),
       startDate: response.startDate || "",
       endDate: response.endDate || "",
       releaseSchedule: response.releaseSchedule || "all",
     });

     console.log("✅ Course data set with units:", loadedUnits.length);
   } catch (error) {
     console.error("❌ Error loading course from API:", error);
     alert("Failed to load course data");
   } finally {
     setLoading(false);
   }
 };

 const saveCourse = async () => {
   try {
     console.log("📦 Saving course to MongoDB...");
     console.log("📦 Course data BEFORE save:", courseData);
     console.log("📦 Units being saved:", courseData.units);
     console.log("📦 Units count:", courseData.units?.length || 0);

     if (courseData.units && courseData.units.length > 0) {
       console.log("📦 First unit:", courseData.units[0]);
     }

     // Clean each unit: remove _id, lessons, and any other problematic fields
     const cleanedUnits =
       courseData.units?.map((unit) => {
         // Create a clean unit with only the fields we want
         const cleanUnit = {
           title: unit.title,
           lecture: {
             content: unit.lecture?.content || "",
             videoUrl: unit.lecture?.videoUrl || "",
             materials: unit.lecture?.materials || [],
           },
           quiz: {
             questions:
               unit.quiz?.questions?.map((q) => ({
                 question: q.question,
                 options: q.options,
                 correctAnswer: q.correctAnswer,
                 explanation: q.explanation,
               })) || [],
           },
           xpReward: unit.xpReward || 80,
           releaseDate: unit.releaseDate || null,
         };
         return cleanUnit;
       }) || [];

     // Also clean materials to ensure no _id fields
     const cleanedMaterialsUnits = cleanedUnits.map((unit) => ({
       ...unit,
       lecture: {
         ...unit.lecture,
         materials: unit.lecture.materials.map((m) => ({
           name: m.name,
           size: m.size,
           type: m.type,
           url: m.url,
         })),
       },
     }));

     const cleanedCourseData = {
       title: courseData.title,
       description: courseData.description,
       level: courseData.level,
       duration: courseData.duration,
       thumbnail: courseData.thumbnail,
       units: cleanedMaterialsUnits,
       published: courseData.published,
       startDate: courseData.startDate,
       endDate: courseData.endDate,
       releaseSchedule: courseData.releaseSchedule,
     };

     console.log("📦 Cleaned units to save:", cleanedCourseData.units);

     let response;

     if (courseId) {
       // EDITING EXISTING COURSE
       response = await api.updateCourse(courseId, cleanedCourseData);
       console.log("✅ Course updated:", response);
     } else {
       // CREATING NEW COURSE - THIS IS WHAT WAS MISSING
       response = await api.createCourse(cleanedCourseData);
       console.log("✅ Course created:", response);
       console.log("🆔 NEW COURSE ID:", response._id);
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
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#5a6499] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading course...</p>
            </div>
          </div>
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
