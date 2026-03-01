import React from "react";
import StudentSidebar from "../components/StudentSidebar";
import { useAuth } from "../context/AuthContext";

function StudentProgress() {
  const { currentUser } = useAuth();

  if (!currentUser) return <div>Loading...</div>;

  const enrolledCourses = currentUser?.profile?.enrolledCourses || [];

  // Calculate statistics
  const totalLessons = enrolledCourses.reduce((acc, course) => {
    return (
      acc +
      (course.modules?.reduce(
        (mAcc, module) => mAcc + (module.lessons?.length || 0),
        0,
      ) || 0)
    );
  }, 0);

  const completedLessons = enrolledCourses.reduce((acc, course) => {
    return acc + (course.completedLessons?.length || 0);
  }, 0);

  const totalQuizzes = enrolledCourses.reduce((acc, course) => {
    return acc + (course.modules?.filter((m) => m.quiz).length || 0);
  }, 0);

  const completedQuizzes = enrolledCourses.reduce((acc, course) => {
    return acc + (course.completedQuizzes?.length || 0);
  }, 0);

  const overallProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Progress</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-500 text-sm mb-2">Overall Progress</p>
            <p className="text-3xl font-bold text-[#5a6499]">
              {overallProgress}%
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-500 text-sm mb-2">Lessons Completed</p>
            <p className="text-3xl font-bold text-green-600">
              {completedLessons}/{totalLessons}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-500 text-sm mb-2">Quizzes Passed</p>
            <p className="text-3xl font-bold text-yellow-600">
              {completedQuizzes}/{totalQuizzes}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-500 text-sm mb-2">Total XP</p>
            <p className="text-3xl font-bold text-purple-600">
              {currentUser.xp || 0}
            </p>
          </div>
        </div>

        {/* Course Progress Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">
            Course Progress Details
          </h2>

          {enrolledCourses.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No courses enrolled yet.
            </p>
          ) : (
            <div className="space-y-6">
              {enrolledCourses.map((course, index) => {
                const courseLessons =
                  course.modules?.reduce(
                    (acc, m) => acc + (m.lessons?.length || 0),
                    0,
                  ) || 0;
                const courseCompleted = course.completedLessons?.length || 0;
                const courseProgress =
                  courseLessons > 0
                    ? Math.round((courseCompleted / courseLessons) * 100)
                    : 0;

                return (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{course.title}</h3>
                      <span className="text-sm text-gray-500">
                        {courseProgress}% Complete
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div
                        className="bg-[#5a6499] h-2.5 rounded-full"
                        style={{ width: `${courseProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>
                        📚 {courseCompleted}/{courseLessons} lessons
                      </span>
                      <span>
                        📝 {course.completedQuizzes?.length || 0}/
                        {course.modules?.filter((m) => m.quiz).length || 0}{" "}
                        quizzes
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentProgress;
