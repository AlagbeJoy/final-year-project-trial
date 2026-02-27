import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function StudentSidebar() {
  const {logout} = useAuth();
  const navigate = useNavigate();

    const isGamified = true

    const dashboardPath = isGamified
    ? '/studentdashboard'
    : '/studentdashboardbasic'

    
    const linkClass = ({ isActive }) =>
        `block px-3 py-2 rounded-md transition
    ${isActive
        ?'bg-[#5a6499] text-white font-medium'
        : 'text-gray-700 hover:bg-gray-100'
    }`

    const handleLogout = () => {
      logout();
      navigate("/login")
    }

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6">
      <h2 className="text-xl font-bold text-[#5a6499] mb-8">Logo</h2>

      <nav className="space-y-2">
        <NavLink className={linkClass} to={dashboardPath} end>
          Dashboard
        </NavLink>

        <NavLink className={linkClass} to="/studentcourses">
          My Courses
        </NavLink>

        <NavLink className={linkClass} to="/studentactivity">
          Activity
        </NavLink>

        <NavLink className={linkClass} to="/profile">
          Profile
        </NavLink>

        <NavLink className={linkClass} to="/progress">
          Progress
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="text-left text-[#5a6499] hover:text-red-700 rounded-md transition px-3 py-2"
      >
        Logout
      </button>
    </aside>
  );
}

export default StudentSidebar