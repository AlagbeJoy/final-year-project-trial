import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LecturerSidebar from "./LecturerSidebar";
import { AvatarSelector, avatars } from "./AvatarSelector";

function EditLecturerProfile() {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();

  // Find current avatar or default to first
  const currentAvatar =
    avatars.find((a) => a.id === currentUser?.profile?.avatarId) || avatars[2]; // Default to teacher emoji for lecturers

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    title: currentUser?.profile?.title || "", // Dr., Prof., Mr., Mrs.
    department: currentUser?.profile?.department || "",
    faculty: currentUser?.profile?.faculty || "",
    office: currentUser?.profile?.office || "",
    phone: currentUser?.profile?.phone || "",
    bio: currentUser?.profile?.bio || "",
    qualifications: currentUser?.profile?.qualifications || [],
    researchInterests: currentUser?.profile?.researchInterests || [],
    coursesTaught: currentUser?.profile?.coursesTaught || [],
    officeHours: currentUser?.profile?.officeHours || "",
    consultationLink: currentUser?.profile?.consultationLink || "",
    expertise: currentUser?.profile?.expertise || [],
    publications: currentUser?.profile?.publications || [],
    avatarId: currentUser?.profile?.avatarId || avatars[2].id,
    notifications: currentUser?.profile?.notifications ?? true,
    privacy: currentUser?.profile?.privacy ?? "public",
  });

  const [selectedAvatar, setSelectedAvatar] = useState(
    avatars.find((a) => a.id === formData.avatarId) || avatars[2],
  );

  const [newQualification, setNewQualification] = useState("");
  const [newResearchInterest, setNewResearchInterest] = useState("");
  const [newExpertise, setNewExpertise] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setFormData((prev) => ({ ...prev, avatarId: avatar.id }));
  };

  // Array handlers
  const addItem = (field, value, setter) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
      setter("");
    }
  };

  const removeItem = (field, item) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((i) => i !== item),
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
      navigate("/lecturer/profile");
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
      <LecturerSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Edit Lecturer Profile
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
                    Title/Designation
                  </label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                  >
                    <option value="">Select Title</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                    <option value="Assoc. Prof.">Assoc. Prof.</option>
                    <option value="Assistant Prof.">Assistant Prof.</option>
                  </select>
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
                    Faculty
                  </label>
                  <input
                    type="text"
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                    placeholder="e.g., Faculty of Science"
                  />
                </div>

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
                    Office Location
                  </label>
                  <input
                    type="text"
                    name="office"
                    value={formData.office}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                    placeholder="e.g., Room 305, Science Building"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Link
                  </label>
                  <input
                    type="url"
                    name="consultationLink"
                    value={formData.consultationLink}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                    placeholder="e.g., https://calendly.com/..."
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Office Hours
                </label>
                <input
                  type="text"
                  name="officeHours"
                  value={formData.officeHours}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                  placeholder="e.g., Mon/Wed 2-4 PM, Tue/Thu 10-12 PM"
                />
              </div>
            </div>

            {/* Qualifications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Qualifications</h2>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newQualification}
                  onChange={(e) => setNewQualification(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(),
                    addItem(
                      "qualifications",
                      newQualification,
                      setNewQualification,
                    ))
                  }
                  className="flex-1 border p-2 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                  placeholder="e.g., Ph.D. in Computer Science"
                />
                <button
                  type="button"
                  onClick={() =>
                    addItem(
                      "qualifications",
                      newQualification,
                      setNewQualification,
                    )
                  }
                  className="bg-[#5a6499] text-white px-4 py-2 rounded-lg hover:bg-[#4a5499]"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.qualifications.map((qual, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {qual}
                    <button
                      type="button"
                      onClick={() => removeItem("qualifications", qual)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Expertise & Research Interests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Expertise */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Areas of Expertise
                </h2>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(),
                      addItem("expertise", newExpertise, setNewExpertise))
                    }
                    className="flex-1 border p-2 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                    placeholder="e.g., Machine Learning"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      addItem("expertise", newExpertise, setNewExpertise)
                    }
                    className="bg-[#5a6499] text-white px-4 py-2 rounded-lg hover:bg-[#4a5499]"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.expertise.map((item, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeItem("expertise", item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Research Interests */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Research Interests
                </h2>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newResearchInterest}
                    onChange={(e) => setNewResearchInterest(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(),
                      addItem(
                        "researchInterests",
                        newResearchInterest,
                        setNewResearchInterest,
                      ))
                    }
                    className="flex-1 border p-2 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                    placeholder="e.g., Natural Language Processing"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      addItem(
                        "researchInterests",
                        newResearchInterest,
                        setNewResearchInterest,
                      )
                    }
                    className="bg-[#5a6499] text-white px-4 py-2 rounded-lg hover:bg-[#4a5499]"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.researchInterests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() =>
                          removeItem("researchInterests", interest)
                        }
                        className="text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Courses Taught */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Courses Taught</h2>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(),
                    addItem("coursesTaught", newCourse, setNewCourse))
                  }
                  className="flex-1 border p-2 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                  placeholder="e.g., Introduction to AI"
                />
                <button
                  type="button"
                  onClick={() =>
                    addItem("coursesTaught", newCourse, setNewCourse)
                  }
                  className="bg-[#5a6499] text-white px-4 py-2 rounded-lg hover:bg-[#4a5499]"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.coursesTaught.map((course, index) => (
                  <span
                    key={index}
                    className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {course}
                    <button
                      type="button"
                      onClick={() => removeItem("coursesTaught", course)}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Professional Bio</h2>

              <div>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                  placeholder="Tell your students about your teaching philosophy, research interests, and professional background..."
                />
              </div>
            </div>

            {/* Publications (Optional) */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Selected Publications (Optional)
              </h2>

              <div className="space-y-3">
                {formData.publications.map((pub, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={pub}
                      onChange={(e) => {
                        const newPubs = [...formData.publications];
                        newPubs[index] = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          publications: newPubs,
                        }));
                      }}
                      className="flex-1 border p-2 rounded-lg"
                      placeholder="Publication citation..."
                    />
                    <button
                      type="button"
                      onClick={() => removeItem("publications", pub)}
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      publications: [...prev.publications, ""],
                    }))
                  }
                  className="text-[#5a6499] hover:text-[#4a5499] text-sm font-medium"
                >
                  + Add Publication
                </button>
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
                    <option value="public">Public (All Students)</option>
                    <option value="private">
                      Private (Only enrolled students)
                    </option>
                    <option value="department">Department Only</option>
                  </select>
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">Email Notifications</span>
                    <p className="text-sm text-gray-500">
                      Receive updates about student enrollments and course
                      activities
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
                onClick={() => navigate("/lecturer/profile")}
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

export default EditLecturerProfile;
