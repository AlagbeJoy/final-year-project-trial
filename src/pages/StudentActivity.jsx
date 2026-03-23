import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import StudentSidebar from "../components/StudentSidebar";

function StudentActivity() {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    totalXP: 0,
    weeklyXP: 0,
    achievements: 0,
  });

 useEffect(() => {
   const fetchActivities = async () => {
     try {
       const activities = await api.getActivities();
       setActivities(activities);

       // Calculate stats
       const totalXP = activities.reduce((sum, a) => sum + (a.xp || 0), 0);
       const oneWeekAgo = new Date();
       oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
       const weeklyXP = activities
         .filter((a) => new Date(a.date) > oneWeekAgo)
         .reduce((sum, a) => sum + (a.xp || 0), 0);
       const achievements = activities.filter(
         (a) => a.type === "achievement",
       ).length;

       setStats({ totalXP, weeklyXP, achievements });
     } catch (error) {
       console.error("Error fetching activities:", error);
     }
   };

   fetchActivities();
 }, []);

  if (!currentUser) return <div>Loading...</div>;

  const sortedActivities = [...activities].sort(
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
      case "achievement":
        return "🏆";
      case "unit":
        return "📗";
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
        {sortedActivities.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <p className="text-gray-400">No activity yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Complete lessons, take quizzes, and earn achievements to see your
              activity here!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedActivities.map((a, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 ${getActivityColor(a.type)} rounded-full flex items-center justify-center text-xl`}
                  >
                    {getActivityIcon(a.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{a.message}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {a.xp > 0 && (
                        <span className="text-sm text-green-600">
                          +{a.xp} XP
                        </span>
                      )}
                      <span className="text-sm text-gray-400">
                        {new Date(a.date).toLocaleDateString()} at{" "}
                        {new Date(a.date).toLocaleTimeString()}
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
