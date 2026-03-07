import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import analyticsService from "../../services/analyticsService";
import ActivityHeatmap from "./ActivityHeatmap";
import EngagementChart from "./EngagementChart";
import TimeDistribution from "./TimeDistribution";

function StudentAnalytics() {
  const { currentUser } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [timeframe, setTimeframe] = useState("all");

  useEffect(() => {
    if (currentUser) {
      const data = analyticsService.getStudentEngagement(currentUser);
      setMetrics(data);
    }
  }, [currentUser]);

  if (!metrics) return <div>Loading analytics...</div>;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <p className="text-gray-500 text-sm">Total Activities</p>
          <p className="text-2xl font-bold text-[#5a6499]">
            {metrics.summary.totalActivities}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <p className="text-gray-500 text-sm">Active Days</p>
          <p className="text-2xl font-bold text-green-600">
            {metrics.summary.totalDays}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <p className="text-gray-500 text-sm">Avg per Day</p>
          <p className="text-2xl font-bold text-yellow-600">
            {metrics.summary.avgPerDay}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <p className="text-gray-500 text-sm">Best Day</p>
          <p className="text-2xl font-bold text-purple-600">
            {metrics.summary.mostActiveCount}
          </p>
        </div>
      </div>

      {/* Activity by Type */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">📋 Activity Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(metrics.byType).map(([type, count]) => (
            <div key={type} className="text-center p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl block mb-1">
                {type === "lesson" && "📚"}
                {type === "quiz" && "📝"}
                {type === "enrollment" && "📋"}
                {type === "achievement" && "🏆"}
              </span>
              <p className="font-semibold capitalize">{type}s</p>
              <p className="text-sm text-gray-500">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <ActivityHeatmap data={metrics.dailyActivity} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EngagementChart data={metrics.weeklyTrend} />
        <TimeDistribution data={metrics.timeDistribution} />
      </div>
    </div>
  );
}

export default StudentAnalytics;
