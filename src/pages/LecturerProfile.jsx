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

  // Calculate profile completion
  const calculateProfileCompletion = () => {
    const profile = currentUser.profile || {};
    let completed = 0;
    const total = 12; // Number of fields we're tracking

    if (currentUser.name) completed++;
    if (currentUser.email) completed++;
    if (profile.title) completed++;
    if (profile.department) completed++;
    if (profile.faculty) completed++;
    if (profile.office) completed++;
    if (profile.phone) completed++;
    if (profile.bio) completed++;
    if (profile.qualifications?.length > 0) completed++;
    if (profile.expertise?.length > 0) completed++;
    if (profile.researchInterests?.length > 0) completed++;
    if (profile.coursesTaught?.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const completionPercentage = calculateProfileCompletion();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LecturerSidebar />

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
                <h1 className="text-3xl font-bold mb-2">
                  {currentUser.profile?.title} {currentUser.name}
                </h1>
                <p className="opacity-90">{currentUser.email}</p>
                <div className="flex gap-2 mt-3">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {currentUser.profile?.department || "Lecturer"}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {currentUser.profile?.faculty || "Faculty"}
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
              <p className="text-gray-500 text-sm">Courses Created</p>
              <p className="text-2xl font-bold text-[#5a6499]">
                {
                  JSON.parse(
                    localStorage.getItem("lecturer_courses") || "[]",
                  ).filter((c) => c.instructorId === currentUser.email).length
                }
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <p className="text-gray-500 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-green-600">
                {/* Calculate total students across courses */}
                {JSON.parse(localStorage.getItem("lecturer_courses") || "[]")
                  .filter((c) => c.instructorId === currentUser.email)
                  .reduce(
                    (acc, course) => acc + (course.students?.length || 0),
                    0,
                  )}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <p className="text-gray-500 text-sm">Qualifications</p>
              <p className="text-2xl font-bold text-yellow-600">
                {currentUser.profile?.qualifications?.length || 0}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <p className="text-gray-500 text-sm">Expertise Areas</p>
              <p className="text-2xl font-bold text-purple-600">
                {currentUser.profile?.expertise?.length || 0}
              </p>
            </div>
          </div>

          {/* Profile Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📞</span> Contact Information
              </h2>
              <div className="space-y-3">
                <InfoRow label="Email" value={currentUser.email} />
                <InfoRow label="Phone" value={currentUser.profile?.phone} />
                <InfoRow label="Office" value={currentUser.profile?.office} />
                <InfoRow
                  label="Office Hours"
                  value={currentUser.profile?.officeHours}
                />
                {currentUser.profile?.consultationLink && (
                  <div>
                    <p className="text-sm text-gray-500">
                      Consultation Booking
                    </p>
                    <a
                      href={currentUser.profile.consultationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5a6499] hover:underline"
                    >
                      Book a session →
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Academic Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>🎓</span> Academic Information
              </h2>
              <div className="space-y-3">
                <InfoRow label="Title" value={currentUser.profile?.title} />
                <InfoRow label="Faculty" value={currentUser.profile?.faculty} />
                <InfoRow
                  label="Department"
                  value={currentUser.profile?.department}
                />
              </div>
            </div>

            {/* Qualifications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📜</span> Qualifications
              </h2>
              {currentUser.profile?.qualifications?.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {currentUser.profile.qualifications.map((qual, index) => (
                    <li key={index} className="text-gray-700">
                      {qual}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No qualifications added</p>
              )}
            </div>

            {/* Expertise */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>💡</span> Areas of Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {currentUser.profile?.expertise?.length > 0 ? (
                  currentUser.profile.expertise.map((item, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400">No expertise added</p>
                )}
              </div>
            </div>

            {/* Research Interests */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>🔬</span> Research Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {currentUser.profile?.researchInterests?.length > 0 ? (
                  currentUser.profile.researchInterests.map(
                    (interest, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ),
                  )
                ) : (
                  <p className="text-gray-400">No research interests added</p>
                )}
              </div>
            </div>

            {/* Courses Taught */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📚</span> Courses Taught
              </h2>
              <div className="flex flex-wrap gap-2">
                {currentUser.profile?.coursesTaught?.length > 0 ? (
                  currentUser.profile.coursesTaught.map((course, index) => (
                    <span
                      key={index}
                      className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                    >
                      {course}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400">No courses added</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📝</span> Professional Bio
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {currentUser.profile?.bio || "No bio added yet."}
              </p>
            </div>

            {/* Publications */}
            {currentUser.profile?.publications?.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>📄</span> Selected Publications
                </h2>
                <ul className="space-y-2">
                  {currentUser.profile.publications.map((pub, index) => (
                    <li
                      key={index}
                      className="text-gray-700 border-l-4 border-[#5a6499] pl-3"
                    >
                      {pub}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Edit Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate("/editlecturerprofile")}
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

export default LecturerProfile;
