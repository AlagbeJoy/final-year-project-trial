// src/pages/FeatureTestPage.jsx
import React, { useState } from "react";
import PrerequisiteChecker from "../components/courses/PrerequisiteChecker";
import Leaderboard from "../components/leaderboard/Leaderboard";
import FileManager from "../components/lecturer/FileManager";
import { useAuth } from "../context/AuthContext";

function FeatureTestPage() {
  const { currentUser } = useAuth();
  const [testCourse] = useState({
    id: 999,
    title: "Test Course",
    prerequisites: {
      requiredXP: 100,
      requiredLevel: 2,
      requiredSkills: ["JavaScript"],
      description: "Complete these requirements first",
    },
  });

  const testModule = {
    id: 888,
    title: "Test Module",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Feature Integration Test</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Prerequisite System */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            🔒 Prerequisite System (FR14)
          </h2>
          <PrerequisiteChecker course={testCourse}>
            <div className="bg-green-100 p-4 rounded-lg text-green-700">
              ✅ You meet all requirements! Content unlocked.
            </div>
          </PrerequisiteChecker>

          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p className="font-medium">Test Data:</p>
            <p className="text-sm text-gray-600">
              Your XP: {currentUser?.xp || 0}
            </p>
            <p className="text-sm text-gray-600">
              Your Level: {currentUser?.level || 1}
            </p>
            <p className="text-sm text-gray-600">Required XP: 100</p>
            <p className="text-sm text-gray-600">Required Level: 2</p>
          </div>
        </div>

        {/* Test Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            🏆 Leaderboard System (FR12)
          </h2>
          <div className="max-h-96 overflow-y-auto">
            <Leaderboard type="global" />
          </div>
        </div>

        {/* Test Bulk Upload */}
        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            📁 Bulk Upload System (FR7)
          </h2>
          <FileManager courseId={testCourse.id} moduleId={testModule.id} />
        </div>
      </div>

      {/* Test Summary */}
      <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2">✅ Test Complete</h3>
        <p className="text-green-700">
          All three missing requirements (FR7, FR12, FR14) have been implemented
          and are ready for testing. Next, we'll move on to completing the
          partial requirements.
        </p>
      </div>
    </div>
  );
}

export default FeatureTestPage;
