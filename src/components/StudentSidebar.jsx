import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function StudentSidebar() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  // Safe calculations
  const enrolledCount = currentUser?.profile?.enrolledCourses?.length || 0;
  const currentLevel = currentUser?.level || 1;
  const currentXP = currentUser?.xp || 0;
  const streak = currentUser?.streak || 0;

  // Simple profile completion (optional)
  const profile = currentUser?.profile || {};
  const profileComplete = profile.department && profile.level ? true : false;

  const menuItems = [
    { path: "/studentdashboard", icon: "📊", label: "Dashboard" },
    {
      path: "/studentcourses",
      icon: "📚",
      label: "My Courses",
      badge: enrolledCount > 0 ? enrolledCount : null,
    },
    { path: "/leaderboard", icon: "🏆", label: "Leaderboard" },
    { path: "/studentactivity", icon: "📈", label: "Activity" },
    {
      path: "/profile",
      icon: "👤",
      label: "Profile",
      badge: profileComplete ? null : "!",
    },
    { path: "/progress", icon: "🎯", label: "Progress" },
    { path: "/settings", icon: "⚙️", label: "Settings" },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive ? "bg-[#5a6499] text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#5a6499]">E-Learn</h2>
        <p className="text-xs text-gray-500 mt-1">Student Portal</p>
      </div>

      {/* User Info - Enhanced but safe */}
      <div className="mb-6 p-4 bg-gradient-to-br from-[#5a6499] to-[#7c83b3] rounded-lg text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
            {currentUser?.name?.charAt(0) || "S"}
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm truncate">
              {currentUser?.name?.split(" ")[0] || "Student"}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                Level {currentUser?.level || 1}
              </span>
              <span className="text-xs bg-yellow-400/20 px-2 py-0.5 rounded-full">
                {currentUser?.xp || 0} XP
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => (
          <NavLink key={item.path} className={linkClass} to={item.path}>
            <span className="text-xl">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  item.label === "Profile" ? "bg-yellow-500" : "bg-blue-500"
                } text-white`}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      {/* XP Progress Bar */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Level {currentLevel}</span>
          <span>
            {currentXP} / {currentLevel * 100} XP
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#5a6499] h-2 rounded-full transition-all duration-300"
            style={{ width: `${currentXP % 100}%` }}
          ></div>
        </div>
      </div>
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition mt-4"
      >
        <span className="text-xl">🚪</span>
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default StudentSidebar;
