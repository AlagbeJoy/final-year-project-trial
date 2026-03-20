import React, { useState, useEffect } from "react";
import StudentSidebar from "../components/StudentSidebar";
import Leaderboard from "../components/leaderboard/Leaderboard";
import { useAuth } from "../context/AuthContext";

function LeaderboardPage() {
  const { currentUser } = useAuth();
  const [timeframe, setTimeframe] = useState("allTime");
  const [category, setCategory] = useState("global");
  const [userRank, setUserRank] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    // Get user's rank (this would come from your leaderboard service)
    if (currentUser) {
      // This is simulated - you'd get real data from your service
      const rank = Math.floor(Math.random() * 50) + 1;
      setUserRank(rank);
      setTotalUsers(156);
    }
  }, [currentUser]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8">
        {/* Header with User Rank */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                🏆 Leaderboards
              </h1>
              <p className="text-gray-600 mt-2">
                See how you rank against other learners
              </p>
            </div>
            {userRank && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-xl shadow-lg">
                <p className="text-sm opacity-90">Your Rank</p>
                <p className="text-2xl font-bold">
                  #{userRank} of {totalUsers}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-gray-500 text-sm">Top 3 Reward</p>
            <p className="text-xl font-bold text-yellow-600">500 XP</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-gray-500 text-sm">Active Learners</p>
            <p className="text-xl font-bold text-green-600">{totalUsers}+</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-gray-500 text-sm">Update Frequency</p>
            <p className="text-xl font-bold text-blue-600">Real-time</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
            >
              <option value="global">🌍 Global Rankings</option>
              <option value="course">📚 Course Rankings</option>
              <option value="department">🏛️ Department Rankings</option>
            </select>

            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
            >
              <option value="weekly">📅 This Week</option>
              <option value="monthly">📆 This Month</option>
              <option value="allTime">🏆 All Time</option>
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
