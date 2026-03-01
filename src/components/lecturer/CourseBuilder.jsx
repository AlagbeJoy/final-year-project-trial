import React from "react";
import ModuleBuilder from "./ModuleBuilder"; // This is correct if in same folder
import LessonEditor from "./LessonEditor"; // This is correct if in same folder
import QuizBuilder from "./QuizBuilder"; // This is correct if in same folder

function CourseBuilder({
  activeTab,
  courseData,
  updateCourseData,
  saveCourse,
}) {
  console.log("CourseBuilder rendered with tab:", activeTab);

  if (activeTab === "basic") {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Course Details</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Title *
          </label>
          <input
            type="text"
            value={courseData.title || ""}
            onChange={(e) => updateCourseData({ title: e.target.value })}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499] focus:border-transparent"
            placeholder="e.g., Advanced JavaScript Mastery"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              value={courseData.level || "Beginner"}
              onChange={(e) => updateCourseData({ level: e.target.value })}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="All Levels">All Levels</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <input
              type="text"
              value={courseData.duration || ""}
              onChange={(e) => updateCourseData({ duration: e.target.value })}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
              placeholder="e.g., 8 weeks"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={courseData.description || ""}
            onChange={(e) => updateCourseData({ description: e.target.value })}
            rows="4"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
            placeholder="Describe what students will learn..."
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              if (!courseData.title || !courseData.description) {
                alert("Please fill in all required fields");
                return;
              }
           
              if (window.confirm("Move to modules tab?")) {
               
              }
            }}
            className="bg-[#5a6499] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4a5499] transition"
          >
            Next: Build Modules →
          </button>
        </div>
      </div>
    );
  }

  if (activeTab === "modules") {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Course Modules</h2>
        <p className="text-gray-600 mb-6">
          Create modules, add lessons, and create quizzes for each module.
        </p>

        <ModuleBuilder
          modules={courseData.modules || []}
          updateModules={(newModules) =>
            updateCourseData({ modules: newModules })
          }
        />
      </div>
    );
  }

  if (activeTab === "publish") {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Review Course</h2>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">
            {courseData.title || "Untitled Course"}
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-gray-600">Level:</span>{" "}
              <span className="font-medium">{courseData.level}</span>
            </div>
            <div>
              <span className="text-gray-600">Duration:</span>{" "}
              <span className="font-medium">
                {courseData.duration || "Not set"}
              </span>
            </div>
          </div>

          <p className="text-gray-700 mb-4">
            {courseData.description || "No description"}
          </p>

          <div className="mb-4">
            <span className="text-gray-600">Modules:</span>{" "}
            <span className="font-medium">
              {courseData.modules?.length || 0}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={saveCourse}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Publish Course
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default CourseBuilder;
