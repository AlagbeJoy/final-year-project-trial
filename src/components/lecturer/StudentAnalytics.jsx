import React, { useState, useEffect } from "react";

function StudentAnalytics({ courseId }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const allCourses = JSON.parse(
      localStorage.getItem("lecturer_courses") || "[]",
    );
    const course = allCourses.find((c) => c.id === courseId);
    if (course) {
      setStudents(course.students || []);
    }
  }, [courseId]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h3 className="font-semibold mb-3">Student Progress</h3>
      {students.length === 0 ? (
        <p className="text-gray-400 text-sm">No students yet</p>
      ) : (
        <div className="space-y-2">
          {students.map((student, i) => (
            <div
              key={i}
              className="flex justify-between text-sm p-2 bg-gray-50 rounded"
            >
              <span>{student.studentName}</span>
              <span className="text-green-600">Enrolled</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentAnalytics;
