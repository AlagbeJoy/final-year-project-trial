import React, { useState } from "react";
import LessonEditor from "./LessonEditor";
import QuizBuilder from "./QuizBuilder";
import BulkUploader from "./BulkUploader";
import FileManager from "./FileManager";


function ModuleBuilder({ modules, updateModules }) {
  const [expandedModule, setExpandedModule] = useState(null);

  const addModule = () => {
    const newModule = {
      id: Date.now(),
      title: "",
      description: "",
      lessons: [],
      quiz: {
        title: "",
        questions: [],
        passingScore: 70,
        xpReward: 30,
      },
    };
    updateModules([...modules, newModule]);
    setExpandedModule(newModule.id);
  };

  const updateModule = (moduleId, updatedData) => {
    const updatedModules = modules.map((m) =>
      m.id === moduleId ? { ...m, ...updatedData } : m,
    );
    updateModules(updatedModules);
  };

  const deleteModule = (moduleId) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      updateModules(modules.filter((m) => m.id !== moduleId));
      if (expandedModule === moduleId) setExpandedModule(null);
    }

const handleBulkUpload = (uploadedFiles) => {
  const newLessons = uploadedFiles.map((file, index) => ({
    id: Date.now() + index,
    title: file.name,
    type: file.type.includes("video") ? "video" : "reading",
    content: file.url,
    duration: "Auto",
    xpReward: 10,
    completed: false,
  }));

  updateModule(module.id, {
    lessons: [...(module.lessons || []), ...newLessons],
  });
};

    const [showFileManager, setShowFileManager] = useState(false);

  };

  return (
    <div className="space-y-4">
      {modules.map((module, index) => (
        <div key={module.id} className="border rounded-lg overflow-hidden">
          {/* Module Header */}
          <div
            className="bg-gray-50 p-4 flex items-center justify-between cursor-pointer"
            onClick={() =>
              setExpandedModule(expandedModule === module.id ? null : module.id)
            }
          >
            <div className="flex items-center gap-3">
              <span className="bg-[#5a6499] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                {index + 1}
              </span>
              <div>
                <input
                  type="text"
                  placeholder="Module Title"
                  value={module.title || ""}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    updateModule(module.id, { title: e.target.value })
                  }
                  className="font-medium bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#5a6499] focus:outline-none px-1"
                />
                <p className="text-sm text-gray-500">
                  {module.lessons?.length || 0} lessons
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteModule(module.id);
                }}
                className="text-red-500 hover:text-red-700 p-2"
              >
                🗑️
              </button>
              <span className="text-gray-400">
                {expandedModule === module.id ? "▼" : "▶"}
              </span>
            </div>
          </div>

          {/* Expanded Content */}
          {expandedModule === module.id && (
            <div className="p-4 border-t">
              {/* Module Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module Description
                </label>
                <textarea
                  value={module.description || ""}
                  onChange={(e) =>
                    updateModule(module.id, { description: e.target.value })
                  }
                  rows="2"
                  className="w-full border p-2 rounded"
                  placeholder="Describe what this module covers..."
                />
                <div className="mb-4">
                  <h4 className="font-medium mb-2">📤 Bulk Upload Materials</h4>
                  <BulkUploader
                    onUploadComplete={handleBulkUpload}
                    acceptedFileTypes={[".pdf", ".mp4", ".jpg", ".png"]}
                  />
                </div>
              </div>

              {/* Lessons Section */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Lessons</h4>
                <LessonEditor
                  lessons={module.lessons || []}
                  moduleId={module.id}
                  updateModule={updateModule}
                />
              </div>

              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => setShowFileManager(!showFileManager)}
                  className="text-[#5a6499] hover:text-[#4a5499] font-medium flex items-center gap-2"
                >
                  <span>{showFileManager ? "▼" : "▶"}</span>
                  📁 Course Materials
                </button>

                {showFileManager && (
                  <div className="mt-4">
                    <FileManager
                      courseId={courseData.id}
                      moduleId={module.id}
                      onFilesUpdate={(files) => {
                        // Optionally update module with file references
                        updateModule(module.id, { materials: files });
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Quiz Section */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Module Quiz</h4>
                <QuizBuilder
                  quiz={module.quiz}
                  moduleId={module.id}
                  updateModule={updateModule}
                />
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Module Button */}
      <button
        onClick={addModule}
        className="w-full border-2 border-dashed border-gray-300 p-4 rounded-lg text-gray-500 hover:text-[#5a6499] hover:border-[#5a6499] transition"
      >
        + Add New Module
      </button>
    </div>
  );
}

export default ModuleBuilder;
