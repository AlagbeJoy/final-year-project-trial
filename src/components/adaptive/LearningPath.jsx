import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import adaptiveEngine from "../../engine/adaptiveLearningEngine";
import { sampleCourses } from "../../data/sampleCourses";

function LearningPath() {
  const { currentUser } = useAuth();
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeWeek, setActiveWeek] = useState(0);

  useEffect(() => {
    if (currentUser) {
      const path = adaptiveEngine.generatePersonalizedPath(
        currentUser,
        sampleCourses,
      );
      setLearningPath(path);
      setLoading(false);

      // Save to user profile
      saveLearningPathToUser(path);
    }
  }, [currentUser]);

  const saveLearningPathToUser = (path) => {
    const updatedUser = {
      ...currentUser,
      learningPath: path,
      lastPathUpdate: new Date().toISOString(),
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // Update in users array
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u) =>
      u.email === currentUser.email ? updatedUser : u,
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-500">
          Unable to generate learning path. Please complete your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Summary */}
      <div className="bg-gradient-to-r from-[#5a6499] to-[#7c83b3] rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">
          Your Personalized Learning Path
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm opacity-90">Learning Style</p>
            <p className="text-lg font-semibold capitalize">
              {learningPath.profile.learningStyle}
            </p>
          </div>
          <div>
            <p className="text-sm opacity-90">Current Level</p>
            <p className="text-lg font-semibold">
              Level {learningPath.profile.currentLevel}
            </p>
          </div>
          <div>
            <p className="text-sm opacity-90">Learning Pace</p>
            <p className="text-lg font-semibold capitalize">
              {learningPath.profile.learningPace}
            </p>
          </div>
          <div>
            <p className="text-sm opacity-90">Recommended Difficulty</p>
            <p className="text-lg font-semibold capitalize">
              {learningPath.recommendations.difficulty}
            </p>
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            📊 Performance Overview
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Quiz Average</span>
                <span className="text-sm font-semibold">
                  {learningPath.performance.averageQuizScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${learningPath.performance.averageQuizScore}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Consistency</span>
                <span className="text-sm font-semibold">
                  {learningPath.performance.consistencyScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${learningPath.performance.consistencyScore}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-sm text-gray-600">Engagement Level</p>
              <p className="text-lg font-semibold capitalize text-[#5a6499]">
                {learningPath.performance.engagementLevel}
              </p>
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            💪 Strengths & Areas to Improve
          </h3>

          {learningPath.performance.strengths.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Strengths</p>
              <div className="flex flex-wrap gap-2">
                {learningPath.performance.strengths.map((strength, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                  >
                    {strength.topic} ({Math.round(strength.averageScore)}%)
                  </span>
                ))}
              </div>
            </div>
          )}

          {learningPath.performance.weaknesses.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Need Review</p>
              <div className="flex flex-wrap gap-2">
                {learningPath.performance.weaknesses.map((weakness, index) => (
                  <span
                    key={index}
                    className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm"
                  >
                    {weakness.topic} ({Math.round(weakness.averageScore)}%)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Next Steps */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🎯 Your Next Steps</h3>

        <div className="space-y-4">
          {learningPath.nextSteps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                  step.priority === "high" ? "bg-green-500" : "bg-yellow-500"
                }`}
              >
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{step.action}</p>
                <p className="text-sm text-gray-500 mt-1 capitalize">
                  {step.type} • {step.priority} priority
                </p>
              </div>
              <button className="text-[#5a6499] hover:text-[#4a5499] font-medium">
                Start →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Courses Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          📅 Your Learning Timeline
        </h3>

        <div className="space-y-4">
          {learningPath.path.map((week, index) => (
            <div key={index} className="border-l-4 border-[#5a6499] pl-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg">
                  Week {week.week}: {week.course}
                </h4>
                <span className="text-sm text-gray-500">
                  {week.estimatedHours} hours estimated
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{week.reason}</p>
              <div className="flex gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {week.difficulty}
                </span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                  {week.modules.length} modules
                </span>
              </div>

              {/* Expandable module list */}
              {activeWeek === index && (
                <div className="mt-3 space-y-2">
                  {week.modules.map((module, mIndex) => (
                    <div key={mIndex} className="text-sm text-gray-600 ml-2">
                      • {module.title} ({module.lessons} lessons
                      {module.hasQuiz ? ", has quiz" : ""})
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() =>
                  setActiveWeek(activeWeek === index ? null : index)
                }
                className="text-[#5a6499] text-sm mt-2 hover:underline"
              >
                {activeWeek === index ? "Show less" : "Show details"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Focus Areas */}
      {learningPath.recommendations.focusAreas.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            🎯 Recommended Focus Areas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningPath.recommendations.focusAreas.map((area, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{area.topic}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      area.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {area.priority} priority
                  </span>
                </div>
                <p className="text-sm text-gray-600">{area.suggestedAction}</p>
                <button className="text-[#5a6499] text-sm mt-2 hover:underline">
                  Find resources →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LearningPath;
