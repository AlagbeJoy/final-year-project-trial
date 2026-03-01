import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function StudentSidebar() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/studentdashboard", icon: "📊", label: "Dashboard" },
    { path: "/studentcourses", icon: "📚", label: "My Courses" },
    { path: "/studentactivity", icon: "📈", label: "Activity" },
    { path: "/profile", icon: "👤", label: "Profile" },
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

      {/* User Info */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#5a6499] rounded-full flex items-center justify-center text-white font-bold">
            {currentUser?.name?.charAt(0) || "S"}
          </div>
          <div>
            <p className="font-medium text-sm">
              {currentUser?.name || "Student"}
            </p>
            <p className="text-xs text-gray-500">
              Level {currentUser?.level || 1}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <NavLink key={item.path} className={linkClass} to={item.path}>
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

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
