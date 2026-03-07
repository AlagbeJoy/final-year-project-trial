import React, { useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import Leaderboard from "../components/leaderboard/Leaderboard";

function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState("allTime");
  const [category, setCategory] = useState("global");

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

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option value="global">Global Rankings</option>
              <option value="course">Course Rankings</option>
              <option value="department">Department Rankings</option>
            </select>

            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="allTime">All Time</option>
            </select>
          </div>
        </div>

        {/* Leaderboard */}
        <Leaderboard type={category} timeframe={timeframe} />
      </main>
    </div>
  );
}

export default LeaderboardPage;
