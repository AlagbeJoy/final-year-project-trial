// src/pages/TestFeatures.jsx
import React from "react";
import PrerequisiteChecker from "../components/courses/PrerequisiteChecker";
import Leaderboard from "../components/leaderboard/Leaderboard";
import BulkUploader from "../components/lecturer/BulkUploader";

function TestFeatures() {
  const testCourse = {
    prerequisites: {
      requiredXP: 100,
      requiredLevel: 2,
      requiredSkills: ["JavaScript"],
      description: "Test prerequisites",
    },
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Feature Testing</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Prerequisite Checker</h2>
        <PrerequisiteChecker course={testCourse}>
          <div className="bg-green-100 p-4 rounded">
            You can access this content!
          </div>
        </PrerequisiteChecker>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Leaderboard</h2>
        <Leaderboard />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Bulk Uploader</h2>
        <BulkUploader />
      </section>
    </div>
  );
}

export default TestFeatures;
