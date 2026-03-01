import React from "react";
import { useNavigate } from "react-router-dom";

function StudentQuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Browse Courses",
      icon: "🔍",
      description: "Discover new learning opportunities",
      color: "bg-blue-500",
      onClick: () => navigate("/studentcourses"),
    },
    {
      label: "Continue Learning",
      icon: "▶️",
      description: "Pick up where you left off",
      color: "bg-green-500",
      onClick: () => navigate("/studentcourses"),
    },
    {
      label: "Daily Challenge",
      icon: "⚡",
      description: "Earn bonus XP today",
      color: "bg-yellow-500",
      onClick: () => alert("Daily Challenge coming soon!"),
    },
    {
      label: "View Profile",
      icon: "👤",
      description: "Check your achievements",
      color: "bg-purple-500",
      onClick: () => navigate("/profile"),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">⚡ Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="group relative overflow-hidden rounded-xl hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <div className={`${action.color} p-4 text-white`}>
              <span className="text-3xl block mb-2">{action.icon}</span>
              <h3 className="font-semibold text-sm mb-1">{action.label}</h3>
              <p className="text-xs opacity-90">{action.description}</p>
            </div>
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition"></div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default StudentQuickActions;
