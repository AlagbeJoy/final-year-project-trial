import React, { useState, useEffect } from "react";
import BulkUploader from "./BulkUploader";

function FileManager({ courseId, moduleId, onFilesUpdate }) {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  useEffect(() => {
    // Load existing files for this course/module
    const storedFiles = JSON.parse(
      localStorage.getItem(`course_${courseId}_files`) || "[]",
    );
    const moduleFiles = storedFiles.filter((f) => f.moduleId === moduleId);
    setFiles(moduleFiles);
  }, [courseId, moduleId]);

  const handleUploadComplete = (uploadedFiles) => {
    const newFiles = uploadedFiles.map((f) => ({
      ...f,
      moduleId,
      courseId,
      uploadedAt: new Date().toISOString(),
      size: (f.size / 1024 / 1024).toFixed(2) + " MB",
    }));

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);

    // Save to localStorage
    const allFiles = JSON.parse(
      localStorage.getItem(`course_${courseId}_files`) || "[]",
    );
    localStorage.setItem(
      `course_${courseId}_files`,
      JSON.stringify([...allFiles, ...newFiles]),
    );

    if (onFilesUpdate) {
      onFilesUpdate(updatedFiles);
    }
  };

  const deleteFile = (fileId) => {
    if (window.confirm("Delete this file?")) {
      const updatedFiles = files.filter((f) => f.id !== fileId);
      setFiles(updatedFiles);

      // Update localStorage
      const allFiles = JSON.parse(
        localStorage.getItem(`course_${courseId}_files`) || "[]",
      );
      localStorage.setItem(
        `course_${courseId}_files`,
        JSON.stringify(allFiles.filter((f) => f.id !== fileId)),
      );
    }
  };

  const deleteSelected = () => {
    if (window.confirm(`Delete ${selectedFiles.length} selected files?`)) {
      const updatedFiles = files.filter((f) => !selectedFiles.includes(f.id));
      setFiles(updatedFiles);
      setSelectedFiles([]);

      const allFiles = JSON.parse(
        localStorage.getItem(`course_${courseId}_files`) || "[]",
      );
      localStorage.setItem(
        `course_${courseId}_files`,
        JSON.stringify(allFiles.filter((f) => !selectedFiles.includes(f.id))),
      );
    }
  };

  const toggleFileSelection = (fileId) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId],
    );
  };

  const selectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map((f) => f.id));
    }
  };

  const getFileIcon = (type) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("video")) return "🎥";
    if (type.includes("image")) return "🖼️";
    return "📁";
  };

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-3">Upload Materials</h3>
        <BulkUploader
          onUploadComplete={handleUploadComplete}
          acceptedFileTypes={[".pdf", ".mp4", ".jpg", ".png", ".pptx", ".docx"]}
        />
      </div>

      {/* File Manager */}
      {files.length > 0 && (
        <div className="bg-white border rounded-lg p-4">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={selectAll}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                {selectedFiles.length === files.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
              {selectedFiles.length > 0 && (
                <>
                  <span className="text-sm text-gray-500">
                    {selectedFiles.length} selected
                  </span>
                  <button
                    onClick={deleteSelected}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Delete Selected
                  </button>
                </>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-200" : "hover:bg-gray-100"}`}
              >
                🔲 Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-gray-200" : "hover:bg-gray-100"}`}
              >
                📋 List
              </button>
            </div>
          </div>

          {/* File Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`relative group border rounded-lg p-3 hover:shadow-md transition ${
                    selectedFiles.includes(file.id)
                      ? "border-[#5a6499] bg-blue-50"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => toggleFileSelection(file.id)}
                    className="absolute top-2 left-2 w-4 h-4"
                  />

                  <div className="text-4xl text-center mb-2">
                    {getFileIcon(file.type)}
                  </div>
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.size}</p>

                  <button
                    onClick={() => deleteFile(file.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center gap-3 p-2 border rounded hover:bg-gray-50 ${
                    selectedFiles.includes(file.id)
                      ? "bg-blue-50 border-[#5a6499]"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => toggleFileSelection(file.id)}
                    className="w-4 h-4"
                  />

                  <span className="text-2xl">{getFileIcon(file.type)}</span>

                  <div className="flex-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {file.size} • {file.uploadedAt}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteFile(file.id)}
                    className="text-red-500 hover:text-red-700 px-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileManager;
