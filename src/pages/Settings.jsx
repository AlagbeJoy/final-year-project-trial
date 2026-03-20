import React, { useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { currentUser, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: currentUser?.settings?.notifications?.email ?? true,
      push: currentUser?.settings?.notifications?.push ?? true,
      courseUpdates:
        currentUser?.settings?.notifications?.courseUpdates ?? true,
      achievements: currentUser?.settings?.notifications?.achievements ?? true,
    },
    privacy: {
      showProfile: currentUser?.settings?.privacy?.showProfile ?? true,
      showProgress: currentUser?.settings?.privacy?.showProgress ?? true,
      showAchievements:
        currentUser?.settings?.privacy?.showAchievements ?? true,
    },
    preferences: {
      language: currentUser?.settings?.preferences?.language || "English",
      theme: currentUser?.settings?.preferences?.theme || "light",
      emailFrequency:
        currentUser?.settings?.preferences?.emailFrequency || "weekly",
    },
  });

  if (!currentUser) return <div>Loading...</div>;

  const handleNotificationChange = (key) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  const handlePrivacyChange = (key) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: !settings.privacy[key],
      },
    });
  };

  const handlePreferenceChange = (key, value) => {
    setSettings({
      ...settings,
      preferences: {
        ...settings.preferences,
        [key]: value,
      },
    });
  };

  const handleSave = () => {
    setIsSaving(true);

    // Update user settings
    const updatedUser = {
      ...currentUser,
      settings: settings,
    };

    updateUser(updatedUser);

    // Save to localStorage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // Update in users array
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u) =>
      u.email === currentUser.email ? updatedUser : u,
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully! ✅");
    }, 500);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">⚙️ Settings</h1>
          <p className="text-gray-600 mb-6">
            Manage your account preferences and privacy
          </p>

          <div className="space-y-6">
            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>👤</span> Profile Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                <p className="text-xs text-gray-400">
                  To change your name or email, please visit your profile page.
                </p>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>🎨</span> Preferences
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.preferences.language}
                    onChange={(e) =>
                      handlePreferenceChange("language", e.target.value)
                    }
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                  >
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={settings.preferences.theme}
                    onChange={(e) =>
                      handlePreferenceChange("theme", e.target.value)
                    }
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Frequency
                  </label>
                  <select
                    value={settings.preferences.emailFrequency}
                    onChange={(e) =>
                      handlePreferenceChange("emailFrequency", e.target.value)
                    }
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>🔔</span> Notifications
              </h2>
              <div className="space-y-3">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div>
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <p className="text-xs text-gray-400">
                        Receive {key} notifications
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handleNotificationChange(key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#5a6499] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>🔒</span> Privacy
              </h2>
              <div className="space-y-3">
                {Object.entries(settings.privacy).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div>
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <p className="text-xs text-gray-400">
                        Allow others to see your{" "}
                        {key.replace("show", "").toLowerCase()}
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handlePrivacyChange(key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#5a6499] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-600">
                <span>⚠️</span> Danger Zone
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete your account? This action cannot be undone.",
                      )
                    ) {
                      alert("Account deletion would happen here");
                    }
                  }}
                  className="w-full text-left px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
                >
                  Delete Account
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#5a6499] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#4a5499] transition disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Saving...
                  </>
                ) : (
                  <>💾 Save Changes</>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;
