import React from "react";

function StudentStats({ user }) {
  // Calculate XP needed for next level
  const currentXP = user?.xp || 0;
  const currentLevel = user?.level || 1;
  const xpForNextLevel = currentLevel * 100;
  const xpProgress = ((currentXP % 100) / 100) * 100;

  const stats = [
    {
      label: "Level",
      value: currentLevel,
      icon: "⭐",
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Total XP",
      value: currentXP,
      icon: "💫",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      label: "Courses",
      value: user?.profile?.enrolledCourses?.length || 0,
      icon: "📚",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      label: "Completed",
      value:
        user?.activities?.filter(
          (a) => a.type === "lesson" || a.type === "unit",
        ).length || 0,
      icon: "✅",
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-xl p-4 hover:shadow-lg transition`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{stat.icon}</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
        </div>
      ))}

      {/* XP Progress Bar */}
      <div className="col-span-4 bg-white rounded-xl p-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Level {currentLevel}</span>
          <span>
            {currentXP} / {currentLevel * 100} XP to Level {currentLevel + 1}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#5a6499] h-2 rounded-full transition-all duration-500"
            style={{ width: `${xpProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default StudentStats;
