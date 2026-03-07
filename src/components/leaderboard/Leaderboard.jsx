import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import leaderboardService from "../../services/leaderboardService";

function Leaderboard() {
  const { currentUser } = useAuth();
  const [timeframe, setTimeframe] = useState("allTime");
  const [type, setType] = useState("global");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);

  useEffect(() => {
    // Load available courses for dropdown
    const courses = JSON.parse(
      localStorage.getItem("lecturer_courses") || "[]",
    );
    setAvailableCourses(courses);
  }, []);

  useEffect(() => {
    let data = [];
    let rank = null;

    if (type === "global") {
      data = leaderboardService.getGlobalLeaderboard(timeframe, 100);
      rank = leaderboardService.getUserRank(currentUser?.email, timeframe);
    } else if (type === "course" && selectedCourse) {
      data = leaderboardService.getCourseLeaderboard(selectedCourse, timeframe);
    } else if (type === "department" && currentUser?.profile?.department) {
      data = leaderboardService.getDepartmentLeaderboard(
        currentUser.profile.department,
        timeframe,
      );
    }

    setLeaderboardData(data);
    setUserRank(rank);
  }, [timeframe, type, selectedCourse, currentUser]);

  const getMedalEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  const getTimeframeLabel = (tf) => {
    const labels = {
      weekly: "This Week",
      monthly: "This Month",
      allTime: "All Time",
    };
    return labels[tf];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🏆 Leaderboard</h2>

        <div className="flex gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 rounded-lg text-sm"
          >
            <option value="global">Global</option>
            <option value="course">By Course</option>
            {currentUser?.profile?.department && (
              <option value="department">My Department</option>
            )}
          </select>

          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="border p-2 rounded-lg text-sm"
          >
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="allTime">All Time</option>
          </select>

          {type === "course" && (
            <select
              value={selectedCourse || ""}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border p-2 rounded-lg text-sm"
            >
              <option value="">Select Course</option>
              {availableCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* User's Rank Card */}
      {userRank && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#5a6499] rounded-full flex items-center justify-center text-white text-xl font-bold">
                {currentUser?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-gray-600">Your Ranking</p>
                <p className="text-2xl font-bold text-[#5a6499]">
                  #{userRank.rank} of {userRank.totalUsers}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total XP</p>
              <p className="text-xl font-bold">{userRank.totalXP} XP</p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Student
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                Level
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                {timeframe === "allTime" ? "Total XP" : "Recent XP"}
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                Streak
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                Badges
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {leaderboardData.map((user) => (
              <tr
                key={user.id}
                className={`hover:bg-gray-50 transition ${
                  user.id === currentUser?.email ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg w-8">
                      {getMedalEmoji(user.rank) || `#${user.rank}`}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        user.avatar?.color || "bg-[#5a6499]"
                      }`}
                    >
                      {user.avatar?.emoji || user.name?.charAt(0)}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">Level {user.level}</td>
                <td className="px-4 py-3 text-center font-semibold">
                  {type === "course" ? user.courseXP : user.totalXP} XP
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="flex items-center justify-center gap-1">
                    🔥 {user.streak || 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                    {user.badges || 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {leaderboardData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">
            No data available for this leaderboard
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        Updated in real-time • {getTimeframeLabel(timeframe)}
      </div>
    </div>
  );
}

export default Leaderboard;
