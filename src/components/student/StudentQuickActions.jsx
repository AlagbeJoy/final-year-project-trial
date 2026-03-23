import React from "react";
import { useNavigate } from "react-router-dom";

function StudentQuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Browse Courses",
      icon: "🔍",
      color: "bg-blue-500",
      onClick: () => navigate("/studentcourses"),
    },
    {
      label: "Continue Learning",
      icon: "▶️",
      color: "bg-green-500",
      onClick: () => navigate("/studentcourses"),
    },
    {
      label: "View Profile",
      icon: "👤",
      color: "bg-purple-500",
      onClick: () => navigate("/profile"),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4">⚡ Quick Actions</h2>
      <div className="grid grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="group relative overflow-hidden rounded-lg hover:shadow-lg transition"
          >
            <div className={`${action.color} p-4 text-white text-center`}>
              <span className="text-2xl block mb-1">{action.icon}</span>
              <p className="text-xs font-medium">{action.label}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default StudentQuickActions;
