import React, { useState } from "react";

function CourseBuilder({
  activeTab,
  setActiveTab,
  courseData,
  updateCourseData,
  saveCourse,
}) {
  const [units, setUnits] = useState(courseData.units || []);

  const addUnit = () => {
    const newUnits = [
      ...units,
      {
        // DON'T SEND id TO BACKEND
        title: "",
        lecture: {
          content: "",
          videoUrl: "",
          materials: [],
        },
        quiz: {
          questions: [],
        },
        xpReward: 80,
      },
    ];
    setUnits(newUnits);
    updateCourseData({ units: newUnits });
  };
  const updateUnit = (index, field, value) => {
    const updatedUnits = [...units];
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      updatedUnits[index][parent][child] = value;
    } else {
      updatedUnits[index][field] = value;
    }
    setUnits(updatedUnits);
    updateCourseData({ units: updatedUnits });
  };

  // File upload handler
  const handleFileUpload = (index, event) => {
    const files = Array.from(event.target.files);
    const updatedUnits = [...units];

    if (!updatedUnits[index].lecture.materials) {
      updatedUnits[index].lecture.materials = [];
    }

    files.forEach((file) => {
      updatedUnits[index].lecture.materials.push({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file), // For preview/download
      });
    });

    setUnits(updatedUnits);
    updateCourseData({ units: updatedUnits });
  };

  const removeFile = (unitIndex, fileId) => {
    const updatedUnits = [...units];
    updatedUnits[unitIndex].lecture.materials = updatedUnits[
      unitIndex
    ].lecture.materials.filter((f) => f.id !== fileId);
    setUnits(updatedUnits);
    updateCourseData({ units: updatedUnits });
  };

  const addQuestion = (unitIndex) => {
    const updatedUnits = [...units];
    if (!updatedUnits[unitIndex].quiz.questions) {
      updatedUnits[unitIndex].quiz.questions = [];
    }
    updatedUnits[unitIndex].quiz.questions.push({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    });
    setUnits(updatedUnits);
    updateCourseData({ units: updatedUnits });
  };

  const updateQuestion = (unitIndex, qIndex, field, value) => {
    const updatedUnits = [...units];
    if (field === "options") {
      updatedUnits[unitIndex].quiz.questions[qIndex].options = value;
    } else {
      updatedUnits[unitIndex].quiz.questions[qIndex][field] = value;
    }
    setUnits(updatedUnits);
    updateCourseData({ units: updatedUnits });
  };

  const deleteUnit = (index) => {
    if (window.confirm("Delete this unit?")) {
      const newUnits = units.filter((_, i) => i !== index);
      setUnits(newUnits);
      updateCourseData({ units: newUnits });
    }
  };

  // BASIC INFO TAB
  if (activeTab === "basic") {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Course Details</h2>

        <input
          type="text"
          placeholder="Course Title"
          value={courseData.title || ""}
          onChange={(e) => updateCourseData({ title: e.target.value })}
          className="w-full border p-3 rounded-lg"
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            value={courseData.level || "Beginner"}
            onChange={(e) => updateCourseData({ level: e.target.value })}
            className="border p-3 rounded-lg"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <input
            type="text"
            placeholder="Duration"
            value={courseData.duration || ""}
            onChange={(e) => updateCourseData({ duration: e.target.value })}
            className="border p-3 rounded-lg"
          />
        </div>

        <textarea
          placeholder="Description"
          value={courseData.description || ""}
          onChange={(e) => updateCourseData({ description: e.target.value })}
          rows="4"
          className="w-full border p-3 rounded-lg"
        />

        <div className="flex justify-end">
          <button
            onClick={() => setActiveTab("modules")}
            className="bg-[#5a6499] text-white px-6 py-3 rounded-lg"
          >
            Next: Add Units →
          </button>
        </div>
      </div>
    );
  }

  // UNITS TAB
  if (activeTab === "modules") {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Course Units</h2>

        {units.map((unit, index) => (
          <div key={unit.id} className="border rounded-lg p-6 mb-4 relative">
            <button
              onClick={() => deleteUnit(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            >
              🗑️ Delete Unit
            </button>

            <h3 className="text-lg font-semibold mb-4">Unit {index + 1}</h3>

            <input
              type="text"
              placeholder="Unit Title"
              value={unit.title}
              onChange={(e) => updateUnit(index, "title", e.target.value)}
              className="w-full border p-3 rounded-lg mb-4"
            />

            {/* File Upload Section */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <label className="block font-medium mb-2">
                📁 Upload Lecture Materials
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => handleFileUpload(index, e)}
                className="mb-3"
              />

              {/* Display uploaded files */}
              {unit.lecture.materials && unit.lecture.materials.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-2">Uploaded Files:</p>
                  {unit.lecture.materials.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between bg-white p-2 rounded mb-2"
                    >
                      <span className="text-sm truncate">{file.name}</span>
                      <button
                        onClick={() => removeFile(index, file.id)}
                        className="text-red-500 text-sm ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Optional Video URL */}
            <input
              type="text"
              placeholder="YouTube Video URL (optional)"
              value={unit.lecture.videoUrl}
              onChange={(e) =>
                updateUnit(index, "lecture.videoUrl", e.target.value)
              }
              className="w-full border p-3 rounded-lg mb-4"
            />

            {/* Lecture Text Content (optional - for additional notes) */}
            <textarea
              placeholder="Additional lecture notes (optional)"
              value={unit.lecture.content}
              onChange={(e) =>
                updateUnit(index, "lecture.content", e.target.value)
              }
              rows="4"
              className="w-full border p-3 rounded-lg mb-4"
            />

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Quiz Questions</h4>

              {unit.quiz.questions.map((q, qIndex) => (
                <div
                  key={q.id}
                  className="bg-gray-50 p-4 rounded-lg mb-4 relative"
                >
                  <button
                    onClick={() => {
                      const updated = [...units];
                      updated[index].quiz.questions = updated[
                        index
                      ].quiz.questions.filter((_, i) => i !== qIndex);
                      setUnits(updated);
                      updateCourseData({ units: updated });
                    }}
                    className="absolute top-2 right-2 text-red-500 text-sm"
                  >
                    ✕ Remove
                  </button>

                  <input
                    type="text"
                    placeholder={`Question ${qIndex + 1}`}
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...units];
                      updated[index].quiz.questions[qIndex].question =
                        e.target.value;
                      setUnits(updated);
                      updateCourseData({ units: updated });
                    }}
                    className="w-full border p-2 rounded mb-3"
                  />

                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2 mb-2">
                      <input
                        type="radio"
                        name={`q-${unit.id}-${qIndex}`}
                        checked={q.correctAnswer === oIndex}
                        onChange={() => {
                          const updated = [...units];
                          updated[index].quiz.questions[qIndex].correctAnswer =
                            oIndex;
                          setUnits(updated);
                          updateCourseData({ units: updated });
                        }}
                      />
                      <input
                        type="text"
                        placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...units];
                          updated[index].quiz.questions[qIndex].options[
                            oIndex
                          ] = e.target.value;
                          setUnits(updated);
                          updateCourseData({ units: updated });
                        }}
                        className="flex-1 border p-2 rounded"
                      />
                    </div>
                  ))}
                </div>
              ))}

              <button
                onClick={() => addQuestion(index)}
                className="text-[#5a6499] font-medium"
              >
                + Add Question
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={addUnit}
          className="w-full border-2 border-dashed p-4 rounded-lg text-gray-500 hover:text-[#5a6499] mb-4"
        >
          + Add Unit
        </button>

        <div className="flex justify-between">
          <button
            onClick={() => setActiveTab("basic")}
            className="px-6 py-2 rounded border"
          >
            Back
          </button>
          <button
            onClick={() => setActiveTab("publish")}
            className="bg-[#5a6499] text-white px-6 py-2 rounded"
          >
            Next: Review
          </button>
        </div>
      </div>
    );
  }

  // PUBLISH TAB
  if (activeTab === "publish") {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Review Course</h2>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">
            {courseData.title || "Untitled"}
          </h3>
          <p className="text-gray-600 mb-2">{courseData.description}</p>
          <p>
            Level: {courseData.level} | Units: {units.length}
          </p>

          {units.map((unit, i) => (
            <div key={unit.id} className="mt-4 p-3 bg-white rounded">
              <p className="font-medium">
                Unit {i + 1}: {unit.title}
              </p>
              <p className="text-sm text-gray-600">
                Materials: {unit.lecture.materials?.length || 0} | Quiz:{" "}
                {unit.quiz.questions.length} questions
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={saveCourse}
            className="bg-green-600 text-white px-8 py-3 rounded-lg"
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
