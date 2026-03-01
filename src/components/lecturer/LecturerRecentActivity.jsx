import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function LecturerRecentActivity() {
  const { currentUser } = useAuth();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Get recent student activities related to lecturer's courses
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const students = allUsers.filter((u) => u.role === "student");

    const recentActivities = [];

    students.forEach((student) => {
      if (student.activities) {
        student.activities.slice(0, 3).forEach((activity) => {
          recentActivities.push({
            studentName: student.name,
            ...activity,
            date: new Date(activity.date),
          });
        });
      }
    });

    // Sort by date and take latest 5
    const sorted = recentActivities.sort((a, b) => b.date - a.date).slice(0, 5);

    setActivities(sorted);
  }, []);

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
      default:
        return "⭐";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6">🕒 Recent Student Activity</h2>

      {activities.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No recent activity</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition"
            >
              <span className="text-2xl">{getActivityIcon(activity.type)}</span>
              <div className="flex-1">
                <p className="font-medium">{activity.studentName}</p>
                <p className="text-sm text-gray-600">{activity.message}</p>
                <div className="flex items-center gap-3 mt-1">
                  {activity.xp > 0 && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      +{activity.xp} XP
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(activity.date).toLocaleDateString()} at{" "}
                    {new Date(activity.date).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LecturerRecentActivity;
