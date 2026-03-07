import React, { useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import Leaderboard from "../components/leaderboard/Leaderboard";

function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("global");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🏆 Leaderboards</h1>
          <p className="text-gray-600 mt-2">
            See how you rank against other learners
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab("global")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "global"
                ? "text-[#5a6499] border-b-2 border-[#5a6499]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Global Rankings
          </button>
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "courses"
                ? "text-[#5a6499] border-b-2 border-[#5a6499]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Course Rankings
          </button>
          <button
            onClick={() => setActiveTab("department")}
            className={`px-6 py-3 font-medium transition ${
              activeTab === "department"
                ? "text-[#5a6499] border-b-2 border-[#5a6499]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Department Rankings
          </button>
        </div>

        {/* Leaderboard Content */}
        <Leaderboard type={activeTab} />
      </main>
    </div>
  );
}

export default LeaderboardPage;
