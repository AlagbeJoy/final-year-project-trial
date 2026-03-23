import React, { useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
  });

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Settings</h1>
          <p className="text-gray-500 mb-6">Manage your account preferences</p>

          {/* Profile Info */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{currentUser.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{currentUser.email}</p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span>Email Notifications</span>
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      email: !notifications.email,
                    })
                  }
                  className="w-5 h-5 text-[#5a6499] rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span>Push Notifications</span>
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      push: !notifications.push,
                    })
                  }
                  className="w-5 h-5 text-[#5a6499] rounded"
                />
              </label>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={() => alert("Settings saved!")}
            className="bg-[#5a6499] text-white px-6 py-2 rounded-lg hover:bg-[#4a5499]"
          >
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
}

export default Settings;
