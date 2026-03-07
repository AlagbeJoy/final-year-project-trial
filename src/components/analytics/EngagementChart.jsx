import React from "react";

function EngagementChart({ data }) {
  const maxValue = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">📊 Weekly Activity</h3>

      <div className="h-64 flex items-end justify-between gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center group">
            {/* Bar */}
            <div className="w-full relative">
              <div
                className="bg-[#5a6499] rounded-t hover:bg-[#4a5499] transition-all duration-300"
                style={{
                  height: `${Math.max((item.count / maxValue) * 200, 4)}px`,
                  minHeight: "4px",
                }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  {item.count} activities
                </div>
              </div>
            </div>

            {/* Label */}
            <span className="text-xs text-gray-500 mt-2">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EngagementChart;
