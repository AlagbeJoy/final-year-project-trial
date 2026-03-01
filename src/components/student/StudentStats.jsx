import React from "react";

function StudentStats({ user }) {
  const stats = [
    {
      label: "Current Level",
      value: user?.level || 1,
      icon: "⭐",
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Total XP",
      value: user?.xp || 0,
      icon: "💫",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      label: "Courses Enrolled",
      value: user?.profile?.enrolledCourses?.length || 0,
      icon: "📚",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      label: "Lessons Completed",
      value: user?.activities?.filter((a) => a.type === "lesson").length || 0,
      icon: "✅",
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      label: "Streak Days",
      value: user?.streak || 0,
      icon: "🔥",
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      label: "Badges Earned",
      value: user?.badges?.length || 0,
      icon: "🏆",
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} rounded-xl p-4 hover:shadow-lg transition transform hover:-translate-y-1`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{stat.icon}</span>
            <span className={`${stat.color} w-2 h-2 rounded-full`}></span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default StudentStats;
