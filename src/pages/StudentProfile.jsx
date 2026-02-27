import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import StudentSidebar from '../components/StudentSidebar';
import { useNavigate } from 'react-router-dom';

function StudentProfile() {
    const {currentUser} = useAuth();
    const navigate = useNavigate();

    if (!currentUser) return <div>Loading..........</div>;

     const calculateProfileCompletion = () => {
       const profile = currentUser.profile || {};
       let completed = 0;
       const total = 5; // name, email, department, level, learning style

       if (currentUser.name) completed++;
       if (currentUser.email) completed++;
       if (profile.department) completed++;
       if (profile.level) completed++;
       if (profile.lessonStyle) completed++;

       return Math.round((completed / total) * 100);
     };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-[#5a6499]">My Profile</h2>

          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Profile Completion</span>
              <span className="text-[#5a6499] font-bold">
                {calculateProfileCompletion()}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-[#5a6499] h-2.5 rounded-full"
                style={{ width: `${calculateProfileCompletion()}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Total XP</p>
              <p className="text-2xl font-bold text-[#5a6499]">
                {currentUser.xp || 0}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Level</p>
              <p className="text-2xl font-bold text-[#5a6499]">
                {currentUser.level || 1}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-gray-500 text-sm">Courses</p>
              <p className="text-2xl font-bold text-[#5a6499]">
                {currentUser.profile?.enrolledCourses?.length || 0}
              </p>
            </div>
          </div>
       <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <img
                src={currentUser.profile?.image || "https://via.placeholder.com/100"}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#5a6499]"
                alt="profile"
              />
              <div>
                <h3 className="text-xl font-bold">{currentUser.name}</h3>
                <p className="text-gray-500">{currentUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-500 text-sm block">Department</label>
                <p className="font-medium bg-gray-50 p-2 rounded">
                  {currentUser.profile?.department || "Not set"}
                </p>
              </div>

              <div>
                <label className="text-gray-500 text-sm block">Level</label>
                <p className="font-medium bg-gray-50 p-2 rounded">
                  {currentUser.profile?.level || "Not set"}
                </p>
              </div>

              <div>
                <label className="text-gray-500 text-sm block">Learning Style</label>
                <p className="font-medium bg-gray-50 p-2 rounded">
                  {currentUser.profile?.lessonStyle || "Not set"}
                </p>
              </div>

              <div>
                <label className="text-gray-500 text-sm block">Study Time</label>
                <p className="font-medium bg-gray-50 p-2 rounded">
                  {currentUser.profile?.studyTime || "Not set"}
                </p>
              </div>
            </div>

            {currentUser.profile?.enrolledCourses?.length > 0 && (
              <div className="pt-4 border-t">
                <label className="text-gray-500 text-sm block mb-2">Enrolled Courses</label>
                <div className="flex flex-wrap gap-2">
                  {currentUser.profile.enrolledCourses.map((course, i) => (
                    <span key={i} className="bg-[#5a6499] text-white px-3 py-1 rounded-full text-sm">
                      {typeof course === 'string' ? course : course.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => navigate("/editstudentprofile")}
              className="bg-[#5a6499] text-white px-6 py-2 rounded hover:bg-[#4a5499] transition mt-4"
            >
              Edit Profile
            </button>
          </div>
        </div>
        </main>
    </div>
  );
}

export default StudentProfile