import React from "react";
import { useAuth } from "../../context/AuthContext";
import adaptiveEngine from "../../engine/adaptiveLearningEngine";

function SkillGapAnalysis() {
  const { currentUser } = useAuth();

  const analysis = adaptiveEngine.analyzePerformance(currentUser);

  const getSkillLevelColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">📊 Skill Gap Analysis</h3>

      <div className="space-y-4">
        {/* Strengths */}
        {analysis.strengths.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Your Strengths
            </p>
            {analysis.strengths.map((strength, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{strength.topic}</span>
                  <span className="text-green-600">
                    {Math.round(strength.averageScore)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${strength.averageScore}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Areas to Improve */}
        {analysis.weaknesses.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Areas to Improve
            </p>
            {analysis.weaknesses.map((weakness, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{weakness.topic}</span>
                  <span className="text-red-600">
                    {Math.round(weakness.averageScore)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${weakness.averageScore}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Priority: {weakness.priority} • Review recommended
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Recommendations
          </p>
          <ul className="space-y-2">
            {analysis.weaknesses.map((weakness, index) => (
              <li
                key={index}
                className="text-sm text-gray-600 flex items-start gap-2"
              >
                <span className="text-[#5a6499]">•</span>
                <span>
                  Review <span className="font-medium">{weakness.topic}</span>{" "}
                  fundamentals
                </span>
              </li>
            ))}
            {analysis.weaknesses.length === 0 && (
              <li className="text-sm text-green-600">
                Great job! You're doing well across all topics. Consider
                advancing to harder material.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SkillGapAnalysis;
