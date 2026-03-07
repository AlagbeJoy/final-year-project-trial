import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

function BulkUploader({
  onUploadComplete,
  acceptedFileTypes = [".pdf", ".mp4", ".jpg", ".png"],
}) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadErrors, setUploadErrors] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map((f) => ({
        file: f.file.name,
        error: f.errors[0]?.message || "Invalid file type",
      }));
      setUploadErrors((prev) => [...prev, ...errors]);
    }

    // Add accepted files
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
      progress: 0,
      status: "pending",
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      if (type === ".pdf") acc["application/pdf"] = [];
      if (type === ".mp4") acc["video/mp4"] = [];
      if (type === ".jpg" || type === ".jpeg") acc["image/jpeg"] = [];
      if (type === ".png") acc["image/png"] = [];
      return acc;
    }, {}),
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const removeFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const clearErrors = () => {
    setUploadErrors([]);
  };

  const uploadFiles = async () => {
    setUploading(true);
    const successfulUploads = [];

    for (let i = 0; i < files.length; i++) {
      const fileData = files[i];

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((r) => setTimeout(r, 100));
        setUploadProgress((prev) => ({
          ...prev,
          [fileData.id]: progress,
        }));
      }

      // Simulate successful upload
      successfulUploads.push({
        id: fileData.id,
        name: fileData.file.name,
        type: fileData.file.type,
        size: fileData.file.size,
        url: URL.createObjectURL(fileData.file), // In reality, this would be a server URL
      });

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileData.id ? { ...f, status: "completed" } : f,
        ),
      );
    }

    setUploading(false);

    if (onUploadComplete) {
      onUploadComplete(successfulUploads);
    }

    // Clear files after successful upload
    setTimeout(() => {
      setFiles([]);
      setUploadProgress({});
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          isDragActive
            ? "border-[#5a6499] bg-blue-50"
            : "border-gray-300 hover:border-[#5a6499] hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <span className="text-4xl block mb-2">📁</span>
          {isDragActive ? (
            <p className="text-[#5a6499] font-medium">Drop files here...</p>
          ) : (
            <>
              <p className="text-gray-600 font-medium">
                Drag & drop files here, or click to select
              </p>
              <p className="text-sm text-gray-400">
                Accepted: {acceptedFileTypes.join(", ")} (Max: 100MB each)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error List */}
      {uploadErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-red-800">Upload Errors</h4>
            <button
              onClick={clearErrors}
              className="text-red-600 hover:text-red-800"
            >
              Clear
            </button>
          </div>
          <ul className="space-y-1">
            {uploadErrors.map((error, index) => (
              <li key={index} className="text-sm text-red-600">
                {error.file}: {error.error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-semibold mb-3">
            Files to Upload ({files.length})
          </h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {files.map((fileData) => (
              <div
                key={fileData.id}
                className="flex items-center gap-3 p-2 bg-gray-50 rounded"
              >
                {/* Preview */}
                {fileData.preview ? (
                  <img
                    src={fileData.preview}
                    alt={fileData.file.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                    {fileData.file.type.includes("pdf") ? "📄" : "🎥"}
                  </div>
                )}

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {fileData.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {/* Progress or Remove */}
                {uploadProgress[fileData.id] !== undefined ? (
                  <div className="w-20">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${uploadProgress[fileData.id]}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => removeFile(fileData.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={uploading}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <button
            onClick={uploadFiles}
            disabled={uploading || files.length === 0}
            className="w-full mt-4 bg-[#5a6499] text-white py-2 rounded-lg hover:bg-[#4a5499] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading
              ? "Uploading..."
              : `Upload ${files.length} File${files.length > 1 ? "s" : ""}`}
          </button>
        </div>
      )}
    </div>
  );
}

export default BulkUploader;
