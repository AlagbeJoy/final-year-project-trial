import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function PrerequisiteChecker({ course, children }) {
  const { currentUser } = useAuth();

  const checkPrerequisites = () => {
    const issues = [];
    const prereqs = course.prerequisites || {};

    // Check required courses
    if (prereqs.requiredCourses?.length > 0) {
      const completedCourses =
        currentUser?.profile?.enrolledCourses
          ?.filter((c) => c.progress === 100)
          .map((c) => c.id) || [];

      const missingCourses = prereqs.requiredCourses.filter(
        (id) => !completedCourses.includes(id),
      );

      if (missingCourses.length > 0) {
        issues.push({
          type: "courses",
          message: "Complete these courses first:",
          items: missingCourses,
        });
      }
    }

    // Check XP requirement
    if (prereqs.requiredXP > (currentUser?.xp || 0)) {
      issues.push({
        type: "xp",
        message: `Need ${prereqs.requiredXP} XP (you have ${currentUser?.xp || 0})`,
        required: prereqs.requiredXP,
        current: currentUser?.xp || 0,
      });
    }

    // Check level requirement
    if (prereqs.requiredLevel > (currentUser?.level || 1)) {
      issues.push({
        type: "level",
        message: `Reach Level ${prereqs.requiredLevel} (you are Level ${currentUser?.level || 1})`,
        required: prereqs.requiredLevel,
        current: currentUser?.level || 1,
      });
    }

    return issues;
  };

  const issues = checkPrerequisites();
  const canAccess = issues.length === 0;

  if (canAccess) {
    return children;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <span className="text-3xl">🔒</span>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Prerequisites Required
          </h3>
          <p className="text-gray-600 mb-4">
            You need to complete the following before accessing this course:
          </p>

          <div className="space-y-4">
            {issues.map((issue, index) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <p className="font-medium text-gray-800 mb-2">
                  {issue.message}
                </p>

                {issue.type === "courses" && (
                  <div className="space-y-2">
                    {issue.items.map((courseId) => {
                      // Find course details (you'd need to pass courses data)
                      return (
                        <Link
                          key={courseId}
                          to={`/course/${courseId}`}
                          className="block text-[#5a6499] hover:underline"
                        >
                          → Complete required course
                        </Link>
                      );
                    })}
                  </div>
                )}

                {issue.type === "xp" && (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{
                          width: `${(issue.current / issue.required) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {issue.current} / {issue.required} XP
                    </p>
                  </div>
                )}

                {issue.type === "level" && (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${(issue.current / issue.required) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Level {issue.current} / {issue.required}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              to="/studentcourses"
              className="bg-[#5a6499] text-white px-4 py-2 rounded-lg hover:bg-[#4a5499] transition"
            >
              Browse Available Courses
            </Link>
            <Link
              to="/profile"
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              View Your Progress
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrerequisiteChecker;
