import React, { useState, useEffect } from "react";
import StudentSidebar from "../components/StudentSidebar";

function StudentActivity() {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    totalXP: 0,
    weeklyXP: 0,
    achievements: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      console.log("📡 Fetching activities...");

      const response = await fetch(
        "https://elearning-api-j0d9.onrender.com/api/activities",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      console.log("✅ Activities received:", data);
      setActivities(data || []);

      // Calculate stats
      const totalXP = data.reduce((sum, a) => sum + (a.xp || 0), 0);

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weeklyXP = data
        .filter((a) => new Date(a.date) > oneWeekAgo)
        .reduce((sum, a) => sum + (a.xp || 0), 0);

      const achievements = data.filter((a) => a.type === "achievement").length;

      setStats({ totalXP, weeklyXP, achievements });
    } catch (error) {
      console.error("❌ Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "enrollment":
        return "📚";
      case "lesson":
        return "📖";
      case "quiz":
        return "📝";
      case "achievement":
        return "🏆";
      case "onboarding":
        return "🎉";
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
      case "onboarding":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <StudentSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#5a6499] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading activities...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6 text-[#5a6499]">
          Activity Feed
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-gray-500 text-sm">Total XP</p>
            <p className="text-2xl font-bold text-[#5a6499]">{stats.totalXP}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-gray-500 text-sm">This Week</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.weeklyXP}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-gray-500 text-sm">Achievements</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.achievements}
            </p>
          </div>
        </div>

        {/* Activity List */}
        {activities.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <p className="text-gray-400">No activity yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Complete lessons, take quizzes, and earn achievements to see your
              activity here!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center text-xl`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.message}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {activity.xp > 0 && (
                        <span className="text-sm text-green-600">
                          +{activity.xp} XP
                        </span>
                      )}
                      <span className="text-sm text-gray-400">
                        {new Date(activity.date).toLocaleDateString()} at{" "}
                        {new Date(activity.date).toLocaleTimeString()}
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
