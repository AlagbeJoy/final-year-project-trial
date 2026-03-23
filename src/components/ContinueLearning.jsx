import React from "react";

function ContinueLearning({ courses }) {
  console.log(
    "ContinueLearning component rendering with",
    courses?.length,
    "courses",
  );

  if (!courses || courses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">📚 Continue Learning</h2>
        <p className="text-gray-400">No courses in progress</p>
        <button className="mt-2 text-[#5a6499]">Browse Courses</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4">📚 Continue Learning</h2>
      {courses.map((course, index) => (
        <div
          key={course.courseId || index}
          className="mb-4 p-3 border rounded-lg"
        >
          <h3 className="font-medium">{course.title || "Untitled Course"}</h3>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-[#5a6499] h-2 rounded-full"
              style={{ width: `${course.progress || 0}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {course.progress || 0}% complete
          </p>
        </div>
      ))}
    </div>
  );
}

export default ContinueLearning;
