import React from "react";

function StudentProgress({ user }) {
  const enrolledCourses = user?.profile?.enrolledCourses || [];

  // Calculate overall progress
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

  const overallProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Time-based greeting for progress
  const getProgressMessage = () => {
    if (overallProgress === 0) return "Start your learning journey! 🚀";
    if (overallProgress < 25) return "Great start! Keep going! 💪";
    if (overallProgress < 50) return "You're making good progress! 🌟";
    if (overallProgress < 75) return "Almost halfway to mastery! 🎯";
    if (overallProgress < 100) return "So close to completing! 🔥";
    return "Congratulations on completing your courses! 🎉";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">📈 Your Progress</h2>
        <span className="text-sm text-gray-500">
          {completedLessons}/{totalLessons} lessons
        </span>
      </div>

      {/* Overall Progress Circle */}
      <div className="flex items-center gap-8">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="#5a6499"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 58}`}
              strokeDashoffset={`${2 * Math.PI * 58 * (1 - overallProgress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-[#5a6499]">
              {overallProgress}%
            </span>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-gray-700 mb-2">{getProgressMessage()}</p>

          {/* Course Progress Bars */}
          <div className="space-y-3">
            {enrolledCourses.slice(0, 3).map((course, index) => {
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
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 truncate max-w-[150px]">
                      {course.title}
                    </span>
                    <span className="text-gray-500">{courseProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#5a6499] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${courseProgress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProgress;
