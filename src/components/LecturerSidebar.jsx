import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LecturerSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition ${
      isActive ? "bg-[#5a6499] text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6 flex flex-col">
      <h2 className="text-xl font-bold text-[#5a6499] mb-8">Lecturer Portal</h2>

      <nav className="space-y-2 flex-1">
        <NavLink className={linkClass} to="/lecturerdashboard">
          📊 Dashboard
        </NavLink>

        <NavLink className={linkClass} to="/lecturer/create-course">
          ✏️ Create Course
        </NavLink>

        <NavLink className={linkClass} to="/lecturer/courses">
          📚 My Courses
        </NavLink>

        <NavLink className={linkClass} to="/lecturer/analytics">
          📈 Analytics
        </NavLink>

        <NavLink className={linkClass} to="/lecturer/profile">
          👤 Profile
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="text-left text-red-500 hover:text-red-700 rounded-lg transition px-4 py-3 mt-4"
      >
        🚪 Logout
      </button>
    </aside>
  );
}

export default LecturerSidebar;
