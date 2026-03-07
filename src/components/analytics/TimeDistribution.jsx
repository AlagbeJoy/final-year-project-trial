import React from "react";

function TimeDistribution({ data }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);

  const segments = [
    {
      key: "morning",
      label: "Morning (6am-12pm)",
      color: "bg-yellow-400",
      icon: "🌅",
    },
    {
      key: "afternoon",
      label: "Afternoon (12pm-6pm)",
      color: "bg-orange-400",
      icon: "☀️",
    },
    {
      key: "evening",
      label: "Evening (6pm-10pm)",
      color: "bg-purple-400",
      icon: "🌆",
    },
    {
      key: "night",
      label: "Night (10pm-6am)",
      color: "bg-indigo-400",
      icon: "🌙",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">⏰ Study Time Distribution</h3>

      <div className="space-y-4">
        {segments.map((segment) => {
          const value = data[segment.key] || 0;
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

          return (
            <div key={segment.key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2">
                  <span>{segment.icon}</span>
                  <span>{segment.label}</span>
                </span>
                <span className="font-medium">
                  {value} activities ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${segment.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TimeDistribution;
