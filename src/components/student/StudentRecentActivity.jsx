import React from "react";

function StudentRecentActivity({ activities }) {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const sortedActivities = [...(activities || [])]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">🕒 Recent Activity</h2>

      {sortedActivities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">No activity yet</p>
          <p className="text-sm text-gray-500">
            Start learning to see your activity here!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedActivities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition"
            >
              <div
                className={`w-10 h-10 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center text-xl`}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{activity.message}</p>
                <div className="flex items-center gap-3 mt-1">
                  {activity.xp > 0 && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      +{activity.xp} XP
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {formatDate(activity.date)}
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

export default StudentRecentActivity;
