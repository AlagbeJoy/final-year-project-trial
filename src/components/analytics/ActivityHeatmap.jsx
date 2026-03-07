import React from "react";

function ActivityHeatmap({ data }) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate last 12 weeks of data
  const weeks = [];
  const now = new Date();

  for (let w = 11; w >= 0; w--) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      const dateStr = date.toDateString();
      const count = data?.find((d) => d.date === dateStr)?.count || 0;

      // Determine color intensity based on count
      let bgColor = "bg-gray-100";
      if (count > 0) bgColor = "bg-green-200";
      if (count > 2) bgColor = "bg-green-300";
      if (count > 4) bgColor = "bg-green-400";
      if (count > 6) bgColor = "bg-green-500";

      week.push({
        date: dateStr,
        count,
        bgColor,
      });
    }
    weeks.push(week);
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">🔥 Activity Heatmap</h3>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day labels */}
          <div className="flex ml-8 mb-2">
            {days.map((day) => (
              <div
                key={day}
                className="flex-1 text-center text-xs text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="space-y-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex">
                <div className="w-8 text-xs text-gray-500 flex items-center">
                  {weekIndex === 0 ? "This week" : `${weekIndex * 7} days ago`}
                </div>
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`flex-1 h-8 mx-0.5 rounded ${day.bgColor} relative group cursor-pointer`}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                      {day.count} activities on{" "}
                      {new Date(day.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <div className="w-4 h-4 bg-green-200 rounded"></div>
              <div className="w-4 h-4 bg-green-300 rounded"></div>
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <div className="w-4 h-4 bg-green-500 rounded"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityHeatmap;
