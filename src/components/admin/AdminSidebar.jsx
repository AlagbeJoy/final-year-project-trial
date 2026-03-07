import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/admin", icon: "📊", label: "Dashboard" },
    { path: "/admin/users", icon: "👥", label: "Users" },
    { path: "/admin/courses", icon: "📚", label: "Courses" },
    { path: "/admin/analytics", icon: "📈", label: "Analytics" },
    { path: "/admin/settings", icon: "⚙️", label: "Settings" },
    { path: "/admin/logs", icon: "📋", label: "System Logs" },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive ? "bg-[#5a6499] text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#5a6499]">Admin Portal</h2>
        <p className="text-xs text-gray-500 mt-1">System Management</p>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <NavLink key={item.path} className={linkClass} to={item.path}>
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition mt-4"
      >
        <span className="text-xl">🚪</span>
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default AdminSidebar;
