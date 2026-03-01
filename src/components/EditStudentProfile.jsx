import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StudentSidebar from "./StudentSidebar";
import { AvatarSelector, avatars } from "./AvatarSelector";

function EditStudentProfile() {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();

  // Find current avatar or default to first
  const currentAvatar =
    avatars.find((a) => a.id === currentUser?.profile?.avatarId) || avatars[0];

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    department: currentUser?.profile?.department || "",
    level: currentUser?.profile?.level || "",
    matric: currentUser?.profile?.matric || "",
    phone: currentUser?.profile?.phone || "",
    bio: currentUser?.profile?.bio || "",
    interests: currentUser?.profile?.interests || [],
    studyGoals: currentUser?.profile?.studyGoals || "",
    preferredStudyTime: currentUser?.profile?.preferredStudyTime || "",
    learningStyle: currentUser?.profile?.learningStyle || "",
    avatarId: currentUser?.profile?.avatarId || avatars[0].id,
    notifications: currentUser?.profile?.notifications ?? true,
    privacy: currentUser?.profile?.privacy ?? "public",
  });

  const [selectedAvatar, setSelectedAvatar] = useState(
    avatars.find((a) => a.id === formData.avatarId) || avatars[0],
  );

  const [interestInput, setInterestInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setFormData((prev) => ({ ...prev, avatarId: avatar.id }));
  };

  const addInterest = () => {
    if (
      interestInput.trim() &&
      !formData.interests.includes(interestInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, interestInput.trim()],
      }));
      setInterestInput("");
    }
  };

  const removeInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Create updated user object
      const updatedUser = {
        ...currentUser,
        name: formData.name,
        profile: {
          ...currentUser.profile,
          ...formData,
          avatar: selectedAvatar,
          lastUpdated: new Date().toISOString(),
        },
      };

      // Update in context and localStorage
      updateUser(updatedUser);

      // Also update in users array
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = users.map((u) =>
        u.email === currentUser.email ? updatedUser : u,
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      alert("Profile updated successfully! ✨");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Edit Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Selection Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Your Avatar/Bitmoji
              </h2>
              <AvatarSelector
                selectedAvatar={selectedAvatar}
                onSelect={handleAvatarSelect}
              />
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matric Number
                  </label>
                  <input
                    type="text"
                    name="matric"
                    value={formData.matric}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Academic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                  >
                    <option value="">Select Level</option>
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                    <option value="500">500 Level</option>
                    <option value="600">600 Level</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Learning Preferences */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Learning Preferences
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Study Time
                  </label>
                  <select
                    name="preferredStudyTime"
                    value={formData.preferredStudyTime}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                  >
                    <option value="">Select Time</option>
                    <option value="morning">Morning (6am - 12pm)</option>
                    <option value="afternoon">Afternoon (12pm - 6pm)</option>
                    <option value="evening">Evening (6pm - 10pm)</option>
                    <option value="night">Night (10pm - 6am)</option>
                    <option value="anytime">Anytime</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Style
                  </label>
                  <select
                    name="learningStyle"
                    value={formData.learningStyle}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                  >
                    <option value="">Select Style</option>
                    <option value="visual">Visual (Videos/Diagrams)</option>
                    <option value="auditory">Auditory (Listening)</option>
                    <option value="reading">Reading/Writing</option>
                    <option value="kinesthetic">Hands-on Practice</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Study Goals
                </label>
                <textarea
                  name="studyGoals"
                  value={formData.studyGoals}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                  placeholder="What do you want to achieve? (e.g., Learn AI, Complete 5 courses this semester)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests (Topics you enjoy)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addInterest())
                    }
                    className="flex-1 border p-2 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                    placeholder="e.g., Artificial Intelligence"
                  />
                  <button
                    type="button"
                    onClick={addInterest}
                    className="bg-[#5a6499] text-white px-4 py-2 rounded-lg hover:bg-[#4a5499]"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">About You</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                  placeholder="Tell us a little about yourself, your interests, and what motivates you to learn..."
                />
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">Profile Visibility</span>
                    <p className="text-sm text-gray-500">
                      Who can see your profile
                    </p>
                  </div>
                  <select
                    name="privacy"
                    value={formData.privacy}
                    onChange={handleChange}
                    className="border p-2 rounded-lg"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="friends">Only Classmates</option>
                  </select>
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">Email Notifications</span>
                    <p className="text-sm text-gray-500">
                      Receive updates about courses and achievements
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={formData.notifications}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notifications: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 text-[#5a6499] rounded focus:ring-[#5a6499]"
                  />
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#5a6499] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#4a5499] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditStudentProfile;
