import React from "react";

function StudentAchievements({ user }) {
  const badges = user?.badges || [];

  // Define available achievements
  const achievements = [
    {
      name: "Starter",
      icon: "🌱",
      requirement: 50,
      color: "bg-green-100 text-green-700",
    },
    {
      name: "Consistent Learner",
      icon: "📚",
      requirement: 150,
      color: "bg-blue-100 text-blue-700",
    },
    {
      name: "Master",
      icon: "👑",
      requirement: 300,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      name: "Streak Master",
      icon: "🔥",
      requirement: "7 day streak",
      color: "bg-orange-100 text-orange-700",
    },
    {
      name: "Quiz Champion",
      icon: "📝",
      requirement: "Perfect quiz score",
      color: "bg-purple-100 text-purple-700",
    },
    {
      name: "Course Completer",
      icon: "🎓",
      requirement: "Complete first course",
      color: "bg-indigo-100 text-indigo-700",
    },
  ];

  const nextAchievement = achievements.find((a) => !badges.includes(a.name));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">🏆 Achievements</h2>

      {/* Current Badges */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-3">Earned ({badges.length})</p>
        {badges.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {badges.map((badge, index) => {
              const achievement = achievements.find((a) => a.name === badge);
              return (
                <div
                  key={index}
                  className={`${achievement?.color || "bg-gray-100"} px-4 py-2 rounded-full flex items-center gap-2`}
                >
                  <span>{achievement?.icon || "🏅"}</span>
                  <span className="text-sm font-medium">{badge}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No badges yet. Keep learning!</p>
        )}
      </div>

      {/* Next Achievement */}
      {nextAchievement && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-2">Next Achievement</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{nextAchievement.icon}</span>
            <div>
              <p className="font-semibold">{nextAchievement.name}</p>
              <p className="text-sm text-gray-500">
                Requirement: {nextAchievement.requirement}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentAchievements;
