import React from 'react'
import { Link } from 'react-router-dom';
import LecturerSidebar from '../components/LecturerSidebar';
import LecturerWelcome from '../components/lecturer/LecturerWelcome';
import LecturerStats from '../components/lecturer/LecturerStats';
import LecturerAnalytics from '../components/lecturer/LecturerAnalytics';
import LecturerRecentActivity from '../components/lecturer/LecturerRecentActivity';
import { useAuth } from '../context/AuthContext';

function LecturerDashboard() {
  const {currentUser} = useAuth();

  if (!currentUser) return <div>Loading.........</div>

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <LecturerSidebar/>

      {/* MAIN CONTENT */}
      <main className="flex-1 px-6 py-6 space-y-6">
        <LecturerWelcome name={currentUser.firstName}/>

        <LecturerStats/>

        <LecturerAnalytics/>

        <LecturerRecentActivity/>




        {/* HEADER
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-[#5a6499]">
            Lecturer Dashboard
          </h2>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5a6499] text-white flex items-center justify-center">
              D
            </div>
          </div>
          <span className='font-medium'>Dr. John </span>
        </header> */}

        {/* WELCOME
        <section className="mb-8">
          <h3 className="text-xl font-semibold">Welcome Back 👋</h3>
          <p className="text-gray-600">Here's an overview of your activities</p>
        </section> */}

        {/* STATS CARDS
        <section className="grid grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-5 rounded-lg shadow">
            <p className="text-gray-500">Courses</p>
            <h3 className="text-2xl font-bold">5</h3>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <p className="text-gray-500">Students</p>
            <h3 className="text-2xl font-bold">200</h3>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <p className="text-gray-500">Materials</p>
            <h3 className="text-2xl font-bold">25</h3>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <p className="text-gray-500">Quizzes</p>
            <h3 className="text-2xl font-bold">10</h3>
          </div>
        </section> */}

        {/* QUICK ACTIONS
        <section className="flex gap-5">
          <button className="bg-[#5a6499] text-white px-6 py-3 rounded">
            + Upload Material
          </button>
          <button className="border border-[#5a6499] text-[#5a6499] px-6 py-3 rounded">
            + Create Quiz
          </button>
          <button className="border border-[#5a6499] text-[#5a6499] px-6 py-3 rounded">
            + Add Course
          </button>
        </section> */}
      </main>
    </div>
  );
}

export default LecturerDashboard