import React from "react";
import { useAuth } from "../context/AuthContext";
import LecturerSidebar from "../components/LecturerSidebar";
import { useNavigate } from "react-router-dom";
import { avatars } from "../components/AvatarSelector";

function LecturerProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return <div>Loading...</div>;

  // Get user's avatar
  const userAvatar =
    avatars.find((a) => a.id === currentUser?.profile?.avatarId) || avatars[2];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LecturerSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header with Avatar */}
          <div className="bg-gradient-to-r from-[#5a6499] to-[#7c83b3] rounded-xl shadow-lg p-8 mb-6 text-white">
            <div className="flex items-center gap-6">
              <div
                className={`${userAvatar.color} w-24 h-24 rounded-2xl flex items-center justify-center text-5xl shadow-lg`}
              >
                {userAvatar.emoji}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {currentUser.profile?.title} {currentUser.name}
                </h1>
                <p className="opacity-90">{currentUser.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{currentUser.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-medium">
                  {currentUser.profile?.title || "Not set"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{currentUser.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">
                  {currentUser.profile?.phone || "Not set"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">
                  {currentUser.profile?.department || "Not set"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Office</p>
                <p className="font-medium">
                  {currentUser.profile?.office || "Not set"}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Office Hours</p>
                <p className="font-medium">
                  {currentUser.profile?.officeHours || "Not set"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => navigate("/editlecturerprofile")}
                className="bg-[#5a6499] text-white px-6 py-2 rounded-lg hover:bg-[#4a5499] transition"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LecturerProfile;
