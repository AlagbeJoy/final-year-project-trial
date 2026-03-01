import React, { useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { currentUser, updateUser } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    courseUpdates: true,
    achievements: true,
  });

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showProgress: true,
    showAchievements: true,
  });

  if (!currentUser) return <div>Loading...</div>;

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handlePrivacyChange = (key) => {
    setPrivacy({ ...privacy, [key]: !privacy[key] });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>

        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={currentUser.name || ""}
                  readOnly
                  className="w-full border p-3 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={currentUser.email || ""}
                  readOnly
                  className="w-full border p-3 rounded-lg bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <div className="space-y-3">
              {Object.entries(notifications).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleNotificationChange(key)}
                    className="w-5 h-5 text-[#5a6499] rounded focus:ring-[#5a6499]"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Privacy</h2>
            <div className="space-y-3">
              {Object.entries(privacy).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handlePrivacyChange(key)}
                    className="w-5 h-5 text-[#5a6499] rounded focus:ring-[#5a6499]"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={() => alert("Settings saved!")}
              className="bg-[#5a6499] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#4a5499] transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
