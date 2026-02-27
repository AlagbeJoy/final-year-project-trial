import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import StudentSidebar from '../components/StudentSidebar';
import { useNavigate } from 'react-router-dom';

function StudentProfile() {
    const {currentUser} = useAuth();
    const navigate = useNavigate();

    if (!currentUser) return <div>Loading..........</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6 text-[#5a6499]">My Profile</h2>

        <div className="bg-white p-6 rounded-xl shadow space-y-4 max-w-xl">
          <div className="flex flex-col items-center gap-3">
            <img
              src={
                currentUser.profile?.image || "https://via.placeholder.com/100"
              }
              className="w-24 h-24 rounded-full object-cover border"
              alt=""
            />
          </div>

          <div>
            <label className="text-gray-500 text-sm">Full Name</label>
            <p className="font-medium">{currentUser.name}</p>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Email</label>
            <p className="font-medium">{currentUser.email}</p>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Department</label>
            <p className="font-medium">
              {currentUser.profile?.department || "-"}
            </p>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Level</label>
            <p className="font-medium">
              {currentUser.profile?.level || "-"}
            </p>
          </div>

          <button
            onClick={() => navigate("/editstudentprofile")}
            className="bg-[#5a6499] text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>

          {/* <div>
            <label className="text-gray-500 text-sm">Courses</label>
            <ul className="list-disc ml-5">
              {(currentUser.profile?.enrolledCourses || []).map((course, i) => (
                <li key={i}>{course}</li>
              ))}
            </ul>
          </div> */}

          {/* <div>
            <label className="text-gray-500 text-sm">XP</label>
            <p className="font-medium">{currentUser.xp || 0}</p>
          </div> */}
        </div>
      </main>
    </div>
  );
}

export default StudentProfile