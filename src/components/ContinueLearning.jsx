import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Hardcoded title map as fallback (from your database)
const TITLE_MAP = {
  "69b35183fd4cc2bfcd798aa9": "Test Case",
  "69c05a5ab202059dae3b06ab": "Introduction to Programming",
  "69c079d4b202059dae3b0c85": "Introduction to Programming",
  "69c084bdbcb76c5067bb2d72": "Andrew's Programming Course",
  "69c09debca0c1f52f6cf7ffa": "Web Development Basics",
  "69c0ac63ca0c1f52f6cf87f5": "Fresh Test Course",
};

function ContinueLearning({ courses }) {
  const navigate = useNavigate();
  const [enrichedCourses, setEnrichedCourses] = useState([]);

  useEffect(() => {
    if (courses && courses.length > 0) {
      console.log("Raw courses received:", courses);

      const enriched = courses.map((course) => {
        const courseId = course.courseId || course.id;

        // Get title from various sources
        let title = course.title;

        // If title is missing or "Course", try the map
        if (!title || title === "Course" || title === "Untitled Course") {
          title = TITLE_MAP[courseId];
        }

        // If still no title, use a default
        if (!title) {
          title = `Course (${courseId.slice(-6)})`;
        }

        // Get saved progress
        const savedProgress = JSON.parse(
          localStorage.getItem(`course_${courseId}_progress`) || "{}",
        );
        const totalUnits = course.units?.length || 1;
        const completedUnits = Object.values(savedProgress).filter(
          (p) => p.quizPassed === true,
        ).length;
        let progress = Math.min(
          Math.round((completedUnits / totalUnits) * 100),
          100,
        );

        const isCompleted = course.completed === true || progress === 100;

        console.log(`Course: ${title} (${courseId}) - Progress: ${progress}%`);

        return {
          ...course,
          title: title,
          progress: progress,
          isCompleted: isCompleted,
          totalUnits: totalUnits,
          completedUnits: completedUnits,
          courseId: courseId,
        };
      });

      setEnrichedCourses(enriched);
    }
  }, [courses]);

  const handleContinueLearning = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  if (!enrichedCourses || enrichedCourses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">📚 Continue Learning</h2>
        <p className="text-gray-400 text-center py-4">No courses in progress</p>
        <button
          onClick={() => navigate("/studentcourses")}
          className="w-full mt-2 text-[#5a6499] hover:underline text-sm"
        >
          Browse Courses →
        </button>
      </div>
    );
  }

  const sortedCourses = [...enrichedCourses].sort((a, b) => {
    if (a.isCompleted === b.isCompleted) return 0;
    return a.isCompleted ? 1 : -1;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">📚 Continue Learning</h2>
        <span className="text-xs text-gray-400">
          {enrichedCourses.filter((c) => !c.isCompleted).length} in progress
        </span>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {sortedCourses.map((course, index) => (
          <div
            key={course.courseId || index}
            className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition ${course.isCompleted ? "bg-gray-50" : "hover:bg-gray-50"}`}
            onClick={() => handleContinueLearning(course.courseId)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-800">{course.title}</h3>
                  {course.isCompleted && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      ✓ Completed
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {course.completedUnits} of {course.totalUnits} units completed
                </p>
              </div>
              <span className="text-sm font-medium text-[#5a6499]">
                {course.progress}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  course.isCompleted ? "bg-green-500" : "bg-[#5a6499]"
                }`}
                style={{ width: `${Math.min(course.progress, 100)}%` }}
              ></div>
            </div>

            {course.progress > 0 && !course.isCompleted && (
              <p className="text-xs text-gray-400 mt-2">
                {course.progress === 100
                  ? "🎉 Almost done! Complete the quiz to finish."
                  : "Keep going!"}
              </p>
            )}

            {course.isCompleted && (
              <p className="text-xs text-green-600 mt-2">
                🎓 Course completed! Great job!
              </p>
            )}
          </div>
        ))}
      </div>

      {enrichedCourses.filter((c) => !c.isCompleted).length === 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-green-600 mb-2">
            🎉 You've completed all your courses!
          </p>
          <button
            onClick={() => navigate("/studentcourses")}
            className="text-[#5a6499] hover:underline text-sm"
          >
            Find new courses →
          </button>
        </div>
      )}
    </div>
  );
}

export default ContinueLearning;
