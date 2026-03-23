import React, { useState } from "react";

function CourseBuilder({
  activeTab,
  setActiveTab,
  courseData,
  updateCourseData,
  saveCourse,
}) {
  const [units, setUnits] = useState(courseData.units || []);

  // Calculate duration based on start/end dates
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "Not set";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.ceil(diffDays / 7);

    if (diffWeeks >= 1) {
      return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""}`;
    }
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  };

  const addUnit = () => {
    const newUnits = [
      ...units,
      {
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
        releaseDate: null,
      },
    ];
    setUnits(newUnits);
    updateCourseData({ units: newUnits });
  };

  const updateUnit = (index, field, value) => {
    const updatedUnits = [...units];
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      if (!updatedUnits[index][parent]) {
        updatedUnits[index][parent] = {};
      }
      updatedUnits[index][parent][child] = value;
    } else {
      updatedUnits[index][field] = value;
    }
    setUnits(updatedUnits);
    updateCourseData({ units: updatedUnits });
  };

  const addQuestion = (unitIndex) => {
    const updatedUnits = [...units];
    if (!updatedUnits[unitIndex].quiz) {
      updatedUnits[unitIndex].quiz = { questions: [] };
    }
    if (!updatedUnits[unitIndex].quiz.questions) {
      updatedUnits[unitIndex].quiz.questions = [];
    }
    updatedUnits[unitIndex].quiz.questions.push({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
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

  const deleteQuestion = (unitIndex, qIndex) => {
    if (window.confirm("Delete this question?")) {
      const updatedUnits = [...units];
      updatedUnits[unitIndex].quiz.questions = updatedUnits[
        unitIndex
      ].quiz.questions.filter((_, i) => i !== qIndex);
      setUnits(updatedUnits);
      updateCourseData({ units: updatedUnits });
    }
  };

  const deleteUnit = (index) => {
    if (window.confirm("Delete this unit?")) {
      const newUnits = units.filter((_, i) => i !== index);
      setUnits(newUnits);
      updateCourseData({ units: newUnits });
    }
  };

  // File upload handling
  const handleFileUpload = (unitIndex, event) => {
    const files = Array.from(event.target.files);
    const updatedUnits = [...units];

    if (!updatedUnits[unitIndex].lecture.materials) {
      updatedUnits[unitIndex].lecture.materials = [];
    }

    files.forEach((file) => {
      const cleanFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      };
      updatedUnits[unitIndex].lecture.materials.push(cleanFile);
    });

    setUnits(updatedUnits);
    updateCourseData({ units: updatedUnits });
  };

  const removeFile = (unitIndex, fileIndex) => {
    const updatedUnits = [...units];
    updatedUnits[unitIndex].lecture.materials = updatedUnits[
      unitIndex
    ].lecture.materials.filter((_, i) => i !== fileIndex);
    setUnits(updatedUnits);
    updateCourseData({ units: updatedUnits });
  };

  // BASIC INFO TAB
  if (activeTab === "basic") {
    const duration = calculateDuration(
      courseData.startDate,
      courseData.endDate,
    );

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Course Details</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Title *
          </label>
          <input
            type="text"
            placeholder="e.g., Web Development"
            value={courseData.title || ""}
            onChange={(e) => updateCourseData({ title: e.target.value })}
            className="w-full border p-3 rounded-lg"
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
              className="w-full border p-3 rounded-lg"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <input
              type="text"
              placeholder="Calculated from dates"
              value={duration}
              readOnly
              className="w-full border p-3 rounded-lg bg-gray-50"
            />
            <p className="text-xs text-gray-400 mt-1">
              Auto-calculated from start/end dates
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            placeholder="What will students learn?"
            value={courseData.description || ""}
            onChange={(e) => updateCourseData({ description: e.target.value })}
            rows="4"
            className="w-full border p-3 rounded-lg"
          />
        </div>

        {/* Course Timeline Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>📅</span> Course Timeline
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={courseData.startDate || ""}
                onChange={(e) => {
                  updateCourseData({ startDate: e.target.value });
                  if (
                    courseData.endDate &&
                    new Date(e.target.value) > new Date(courseData.endDate)
                  ) {
                    updateCourseData({ endDate: "" });
                  }
                }}
                className="w-full border p-2 rounded"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={courseData.endDate || ""}
                onChange={(e) => updateCourseData({ endDate: e.target.value })}
                className="w-full border p-2 rounded"
                min={courseData.startDate}
                disabled={!courseData.startDate}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              if (!courseData.title || !courseData.description) {
                alert("Please fill in all required fields");
                return;
              }
              setActiveTab("modules");
            }}
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

        {units.length === 0 ? (
          <div className="bg-gray-50 p-8 text-center rounded-lg mb-4">
            <p className="text-gray-400 mb-2">No units yet</p>
            <button
              onClick={addUnit}
              className="text-[#5a6499] hover:underline"
            >
              Click here to add your first unit
            </button>
          </div>
        ) : (
          units.map((unit, index) => {
            const lecture = unit.lecture || {
              content: "",
              videoUrl: "",
              materials: [],
            };
            const quiz = unit.quiz || { questions: [] };

            return (
              <div
                key={index}
                className="border rounded-lg p-6 mb-6 relative bg-white"
              >
                <button
                  onClick={() => deleteUnit(index)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm"
                >
                  🗑️ Delete Unit
                </button>

                <h3 className="text-lg font-semibold mb-4">Unit {index + 1}</h3>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Unit Title"
                    value={unit.title || ""}
                    onChange={(e) => updateUnit(index, "title", e.target.value)}
                    className="w-full border p-3 rounded-lg"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      📖 Lecture Content
                    </label>
                    <textarea
                      placeholder="Write your lecture content here..."
                      value={lecture.content}
                      onChange={(e) =>
                        updateUnit(index, "lecture.content", e.target.value)
                      }
                      rows="6"
                      className="w-full border p-3 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      🎥 YouTube Video URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/embed/..."
                      value={lecture.videoUrl}
                      onChange={(e) =>
                        updateUnit(index, "lecture.videoUrl", e.target.value)
                      }
                      className="w-full border p-3 rounded-lg"
                    />
                  </div>

                  {/* Materials Upload */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📁 Upload Materials (Optional)
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileUpload(index, e)}
                      className="mb-3 text-sm"
                    />
                    {lecture.materials && lecture.materials.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {lecture.materials.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-white p-2 rounded border"
                          >
                            <span className="text-sm truncate">
                              {file.name}
                            </span>
                            <button
                              onClick={() => removeFile(index, idx)}
                              className="text-red-500 text-xs hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quiz Section */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">📝 Quiz Questions</h4>

                    {quiz.questions.map((q, qIndex) => (
                      <div
                        key={qIndex}
                        className="bg-gray-50 p-4 rounded-lg mb-4 relative"
                      >
                        <button
                          onClick={() => deleteQuestion(index, qIndex)}
                          className="absolute top-2 right-2 text-red-500 text-sm"
                        >
                          ✕ Remove
                        </button>

                        <input
                          type="text"
                          placeholder={`Question ${qIndex + 1}`}
                          value={q.question || ""}
                          onChange={(e) =>
                            updateQuestion(
                              index,
                              qIndex,
                              "question",
                              e.target.value,
                            )
                          }
                          className="w-full border p-2 rounded mb-3"
                        />

                        {q.options &&
                          q.options.map((opt, oIndex) => (
                            <div
                              key={oIndex}
                              className="flex items-center gap-2 mb-2"
                            >
                              <input
                                type="radio"
                                name={`q-${index}-${qIndex}`}
                                checked={q.correctAnswer === oIndex}
                                onChange={() =>
                                  updateQuestion(
                                    index,
                                    qIndex,
                                    "correctAnswer",
                                    oIndex,
                                  )
                                }
                                className="w-4 h-4"
                              />
                              <input
                                type="text"
                                placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                value={opt || ""}
                                onChange={(e) => {
                                  const newOptions = [...(q.options || [])];
                                  newOptions[oIndex] = e.target.value;
                                  updateQuestion(
                                    index,
                                    qIndex,
                                    "options",
                                    newOptions,
                                  );
                                }}
                                className="flex-1 border p-2 rounded"
                              />
                            </div>
                          ))}

                        <input
                          type="text"
                          placeholder="Explanation (optional)"
                          value={q.explanation || ""}
                          onChange={(e) =>
                            updateQuestion(
                              index,
                              qIndex,
                              "explanation",
                              e.target.value,
                            )
                          }
                          className="w-full border p-2 rounded mt-2 text-sm"
                        />
                      </div>
                    ))}

                    <button
                      onClick={() => addQuestion(index)}
                      className="text-[#5a6499] font-medium text-sm"
                    >
                      + Add Question
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        <button
          onClick={addUnit}
          className="w-full border-2 border-dashed border-gray-300 p-4 rounded-lg text-gray-500 hover:text-[#5a6499] mb-4"
        >
          + Add Unit
        </button>

        <div className="flex justify-between">
          <button
            onClick={() => setActiveTab("basic")}
            className="px-6 py-2 rounded border"
          >
            ← Back
          </button>
          <button
            onClick={() => setActiveTab("publish")}
            className="bg-[#5a6499] text-white px-6 py-2 rounded"
          >
            Next: Review →
          </button>
        </div>
      </div>
    );
  }

  // PUBLISH TAB
  if (activeTab === "publish") {
    const totalQuestions = units.reduce(
      (sum, unit) => sum + (unit.quiz?.questions?.length || 0),
      0,
    );

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Review & Publish</h2>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">
            {courseData.title || "Untitled Course"}
          </h3>
          <p className="text-gray-600 mb-4">
            {courseData.description || "No description"}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500">Level</p>
              <p className="font-medium">{courseData.level || "Not set"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="font-medium">
                {courseData.startDate && courseData.endDate
                  ? `${new Date(courseData.startDate).toLocaleDateString()} - ${new Date(courseData.endDate).toLocaleDateString()}`
                  : "Not set"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Units</p>
              <p className="font-medium">{units.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Questions</p>
              <p className="font-medium">{totalQuestions}</p>
            </div>
          </div>

          <h4 className="font-semibold mt-4 mb-2">Units Preview:</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {units.map((unit, i) => (
              <div key={i} className="p-3 bg-white rounded border">
                <p className="font-medium">
                  Unit {i + 1}: {unit.title || "Untitled"}
                </p>
                <p className="text-sm text-gray-500">
                  {unit.quiz?.questions?.length || 0} question(s)
                  {unit.lecture?.materials?.length > 0 &&
                    ` • ${unit.lecture.materials.length} material(s)`}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={saveCourse}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold"
          >
            🚀 Publish Course
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default CourseBuilder;
