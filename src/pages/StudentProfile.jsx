import React from "react";
import { useAuth } from "../context/AuthContext";
import StudentSidebar from "../components/StudentSidebar";
import { useNavigate } from "react-router-dom";
import { avatars } from "../components/AvatarSelector";
import BadgeGallery from "../components/badges/BadgeGallery";

function StudentProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return <div>Loading...</div>;

  // Get user's avatar
  const userAvatar =
    avatars.find((a) => a.id === currentUser?.profile?.avatarId) || avatars[0];

  // Calculate profile completion
  const calculateProfileCompletion = () => {
    const profile = currentUser.profile || {};
    let completed = 0;
    const total = 10; // Number of fields we're tracking

    if (currentUser.name) completed++;
    if (currentUser.email) completed++;
    if (profile.department) completed++;
    if (profile.level) completed++;
    if (profile.matric) completed++;
    if (profile.phone) completed++;
    if (profile.bio) completed++;
    if (profile.interests?.length > 0) completed++;
    if (profile.preferredStudyTime) completed++;
    if (profile.learningStyle) completed++;

    return Math.round((completed / total) * 100);
  };

  const completionPercentage = calculateProfileCompletion();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Avatar */}
          <div className="bg-gradient-to-r from-[#5a6499] to-[#7c83b3] rounded-xl shadow-lg p-8 mb-6 text-white">
            <div className="flex items-center gap-6">
              <div
                className={`${userAvatar.color} w-24 h-24 rounded-2xl flex items-center justify-center text-5xl shadow-lg`}
              >
                {userAvatar.emoji}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{currentUser.name}</h1>
                <p className="opacity-90">{currentUser.email}</p>
                <div className="flex gap-2 mt-3">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    Level {currentUser.level || 1}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {currentUser.xp || 0} XP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Completion Bar */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">Profile Completion</h2>
              <span className="text-[#5a6499] font-bold">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-[#5a6499] h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <p className="text-gray-500 text-sm">Courses</p>
              <p className="text-2xl font-bold text-[#5a6499]">
                {currentUser.profile?.enrolledCourses?.length || 0}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <p className="text-gray-500 text-sm">Lessons Done</p>
              <p className="text-2xl font-bold text-green-600">
                {currentUser.activities?.filter((a) => a.type === "lesson")
                  .length || 0}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <p className="text-gray-500 text-sm">Quizzes Passed</p>
              <p className="text-2xl font-bold text-yellow-600">
                {currentUser.activities?.filter((a) => a.type === "quiz")
                  .length || 0}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <p className="text-gray-500 text-sm">Streak</p>
              <p className="text-2xl font-bold text-orange-600">
                {currentUser.streak || 0} days
              </p>
            </div>
          </div>

          <div className="mt-8">
            <BadgeGallery />
          </div>

          {/* Profile Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Academic Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>🎓</span> Academic Information
              </h2>
              <div className="space-y-3">
                <InfoRow
                  label="Department"
                  value={currentUser.profile?.department}
                />
                <InfoRow label="Level" value={currentUser.profile?.level} />
                <InfoRow
                  label="Matric Number"
                  value={currentUser.profile?.matric}
                />
                <InfoRow label="Phone" value={currentUser.profile?.phone} />
              </div>
            </div>

            {/* Learning Preferences */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>⚡</span> Learning Preferences
              </h2>
              <div className="space-y-3">
                <InfoRow
                  label="Study Time"
                  value={currentUser.profile?.preferredStudyTime}
                />
                <InfoRow
                  label="Learning Style"
                  value={currentUser.profile?.learningStyle}
                />
                <InfoRow
                  label="Study Goals"
                  value={currentUser.profile?.studyGoals}
                />
              </div>
            </div>

            {/* Interests */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>🎯</span> Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {currentUser.profile?.interests?.length > 0 ? (
                  currentUser.profile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400">No interests added</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📝</span> About
              </h2>
              <p className="text-gray-700">
                {currentUser.profile?.bio || "No bio added yet."}
              </p>
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate("/editstudentprofile")}
              className="bg-[#5a6499] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#4a5499] transition flex items-center gap-2"
            >
              <span>✏️</span> Edit Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper component for info rows
function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value || "Not set"}</p>
    </div>
  );
}

export default StudentProfile;
