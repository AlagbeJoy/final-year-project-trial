import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LecturerSidebar() {
  const {logout} = useAuth();
  const navigate = useNavigate();
   
  const handleLogout = () => {
    logout();
    navigate("/login");
  }
  return (
    <aside className="w-[20%] bg-[#5a6299] text-white p-6">
      <h1 className="text-2xl font-bold mb-10">Logo</h1>

      <nav className="flex flex-col gap-10">
        <Link to="/lecturerdashboard" className="cursor-pointer font-medium">
          🏠 Dashboard
        </Link>
        <Link to="/courses" className="cursor-pointer">
          📚 My Courses
        </Link>
        <Link to="/upload" className="cursor-pointer">
          📤 Upload Materials
        </Link>
        <Link to="/quiz" className="cursor-pointer">
          📝 Create Quiz
        </Link>
        <Link to="/progress" className="cursor-pointer">
          🎯 Student Progress
        </Link>
        <Link to="/lecturerprofile" className="cursor-pointer">
          👤 Profile
        </Link>
        {/* <Link to="/gamification" className="opacity-50 cursor-not-allowed">
          🏆 Gamification
        </Link>
        <Link to="/settings" className="cursor-pointer">
          ⚙ Settings
        </Link> */}
      </nav>

      <div className="pt-10 border-t border-white/30 cursor-pointer">
        <button
          onClick={handleLogout}
          className="w-full text-left hover:text-red-300 transition"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

export default LecturerSidebar