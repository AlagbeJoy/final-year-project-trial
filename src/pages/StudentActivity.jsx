import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import StudentSidebar from "../components/StudentSidebar";

function StudentActivity() {
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState("all");

  if (!currentUser) return <div>Loading...</div>;

  const activities = currentUser.activities || [];

  // Use useMemo to calculate stats only when activities change
  const stats = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weekActivities = activities.filter(
      (a) => new Date(a.date) > oneWeekAgo,
    );
    const weekXP = weekActivities.reduce((sum, a) => sum + (a.xp || 0), 0);
    const achievements = activities.filter(
      (a) => a.type === "achievement",
    ).length;
    const totalXP = activities.reduce((sum, a) => sum + (a.xp || 0), 0);

    return {
      totalXP,
      thisWeek: weekXP,
      achievements,
    };
  }, [activities]); // Only recalculate when activities change

  // Filter activities based on selected filter
  const filteredActivities = useMemo(() => {
    return activities.filter((a) => {
      if (filter === "all") return true;
      if (filter === "thisWeek") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(a.date) > oneWeekAgo;
      }
      return a.type === filter;
    });
  }, [activities, filter]);

  const sortedActivities = [...filteredActivities].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const getActivityIcon = (type) => {
    switch (type) {
      case "enrollment":
        return "📚";
      case "lesson":
        return "📖";
      case "quiz":
        return "📝";
      case "onboarding":
        return "🎉";
      case "profile":
        return "👤";
      case "achievement":
        return "🏆";
      default:
        return "⭐";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "enrollment":
        return "bg-blue-100 text-blue-700";
      case "lesson":
        return "bg-green-100 text-green-700";
      case "quiz":
        return "bg-yellow-100 text-yellow-700";
      case "achievement":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8">
        {/* Header with Stats */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-[#5a6499]">
            Activity Feed
          </h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <p className="text-gray-500 text-sm">Total XP Earned</p>
              <p className="text-2xl font-bold text-[#5a6499]">
                {stats.totalXP} XP
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4">
              <p className="text-gray-500 text-sm">This Week</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.thisWeek} XP
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4">
              <p className="text-gray-500 text-sm">Achievements</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.achievements}
              </p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
                filter === "all"
                  ? "bg-[#5a6499] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              All Activity
            </button>
            <button
              onClick={() => setFilter("thisWeek")}
              className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
                filter === "thisWeek"
                  ? "bg-[#5a6499] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setFilter("lesson")}
              className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
                filter === "lesson"
                  ? "bg-[#5a6499] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              📖 Lessons
            </button>
            <button
              onClick={() => setFilter("quiz")}
              className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
                filter === "quiz"
                  ? "bg-[#5a6499] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              📝 Quizzes
            </button>
            <button
              onClick={() => setFilter("achievement")}
              className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
                filter === "achievement"
                  ? "bg-[#5a6499] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              🏆 Achievements
            </button>
          </div>
        </div>

        {/* Activity List */}
        {sortedActivities.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-lg text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg mb-2">No activity yet</p>
            <p className="text-sm text-gray-400">
              Complete your profile or enroll in a course to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedActivities.map((a, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition border-l-4 border-[#5a6499]"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 ${getActivityColor(a.type)} rounded-xl flex items-center justify-center text-2xl`}
                  >
                    {getActivityIcon(a.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{a.message}</p>
                      {a.xp > 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          +{a.xp} XP
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-400">
                        {new Date(a.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">
                        {a.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentActivity;
