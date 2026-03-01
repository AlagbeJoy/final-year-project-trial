import React from "react";

function LessonEditor({ lessons, moduleId, updateModule }) {
  const updateLesson = (lessonId, updatedData) => {
    const updatedLessons = lessons.map((lesson) =>
      lesson.id === lessonId ? { ...lesson, ...updatedData } : lesson,
    );
    updateModule(moduleId, { lessons: updatedLessons });
  };

  const deleteLesson = (lessonId) => {
    if (window.confirm("Delete this lesson?")) {
      const updatedLessons = lessons.filter((l) => l.id !== lessonId);
      updateModule(moduleId, { lessons: updatedLessons });
    }
  };

  const addLesson = () => {
    const newLesson = {
      id: Date.now(),
      title: "",
      type: "reading",
      content: "",
      duration: "",
      videoUrl: "",
      xpReward: 10,
      completed: false,
    };

    updateModule(moduleId, { lessons: [...lessons, newLesson] });
  };

  return (
    <div className="space-y-3">
      {lessons.map((lesson, index) => (
        <div key={lesson.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Lesson {index + 1}</span>
            <button
              onClick={() => deleteLesson(lesson.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Lesson Title"
              value={lesson.title || ""}
              onChange={(e) =>
                updateLesson(lesson.id, { title: e.target.value })
              }
              className="border p-2 rounded"
            />

            <select
              value={lesson.type || "reading"}
              onChange={(e) =>
                updateLesson(lesson.id, { type: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="reading">Reading</option>
              <option value="video">Video</option>
            </select>

            <input
              type="text"
              placeholder="Duration (e.g., 10 min)"
              value={lesson.duration || ""}
              onChange={(e) =>
                updateLesson(lesson.id, { duration: e.target.value })
              }
              className="border p-2 rounded"
            />

            <input
              type="number"
              placeholder="XP Reward"
              value={lesson.xpReward || 10}
              onChange={(e) =>
                updateLesson(lesson.id, { xpReward: parseInt(e.target.value) })
              }
              className="border p-2 rounded"
              min="5"
              max="50"
            />
          </div>

          {lesson.type === "video" ? (
            <input
              type="text"
              placeholder="YouTube Video URL"
              value={lesson.videoUrl || ""}
              onChange={(e) =>
                updateLesson(lesson.id, { videoUrl: e.target.value })
              }
              className="w-full border p-2 rounded mt-3"
            />
          ) : (
            <textarea
              placeholder="Lesson content..."
              value={lesson.content || ""}
              onChange={(e) =>
                updateLesson(lesson.id, { content: e.target.value })
              }
              rows="3"
              className="w-full border p-2 rounded mt-3"
            />
          )}
        </div>
      ))}

      {lessons.length === 0 && (
        <p className="text-gray-400 text-center py-4">No lessons yet.</p>
      )}

      <button
        onClick={addLesson}
        className="mt-3 text-[#5a6499] hover:text-[#4a5499] text-sm font-medium"
      >
        + Add Lesson
      </button>
    </div>
  );
}

export default LessonEditor;
