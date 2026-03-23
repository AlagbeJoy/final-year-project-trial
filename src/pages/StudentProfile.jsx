import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import StudentSidebar from "../components/StudentSidebar";
import { useNavigate } from "react-router-dom";
import { avatars } from "../components/AvatarSelector";

function StudentProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    courses: 0,
    lessonsCompleted: 0,
    totalLessons: 0,
    quizzesPassed: 0,
    streak: 0,
    profileCompletion: 0,
  });

  useEffect(() => {
    if (currentUser) {
      calculateStats();
    }
  }, [currentUser]);

  const calculateStats = () => {
    const enrolledCourses = currentUser.profile?.enrolledCourses || [];

    // Count lessons from localStorage progress
    let totalLessons = 0;
    let completedLessons = 0;
    let quizzesPassed = 0;

    enrolledCourses.forEach((course) => {
      const courseId = course.courseId || course.id;
      const savedProgress = JSON.parse(
        localStorage.getItem(`course_${courseId}_progress`) || "{}",
      );

      // Count units as lessons
      const totalUnits = course.units?.length || 1;
      const completedUnits = Object.values(savedProgress).filter(
        (p) => p.quizPassed === true,
      ).length;

      totalLessons += totalUnits;
      completedLessons += completedUnits;

      // Count quizzes passed from progress
      quizzesPassed += completedUnits;
    });

    // Also count quizzes from activities as backup
    const activityQuizzes =
      currentUser.activities?.filter((a) => a.type === "quiz").length || 0;
    const finalQuizzes = Math.max(quizzesPassed, activityQuizzes);

    // Calculate profile completion
    const profile = currentUser.profile || {};
    let completed = 0;
    const totalProfileFields = 5;
    if (profile.department) completed++;
    if (profile.level) completed++;
    if (profile.learningStyle) completed++;
    if (profile.bio) completed++;
    if (profile.interests?.length > 0) completed++;
    const profileCompletion = Math.round(
      (completed / totalProfileFields) * 100,
    );

    setStats({
      courses: enrolledCourses.length,
      lessonsCompleted: completedLessons,
      totalLessons: totalLessons,
      quizzesPassed: finalQuizzes,
      streak: currentUser.streak || 0,
      profileCompletion,
    });
  };

  if (!currentUser) return <div>Loading...</div>;

  const userAvatar =
    avatars.find((a) => a.id === currentUser?.profile?.avatarId) || avatars[0];
  const profile = currentUser.profile || {};

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#5a6499] to-[#7c83b3] rounded-xl p-6 mb-6 text-white">
            <div className="flex items-center gap-4">
              <div
                className={`${userAvatar.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl`}
              >
                {userAvatar.emoji}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{currentUser.name}</h1>
                <p className="opacity-90">{currentUser.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-white/20 px-2 py-1 rounded text-sm">
                    Level {currentUser.level || 1}
                  </span>
                  <span className="bg-white/20 px-2 py-1 rounded text-sm">
                    {currentUser.xp || 0} XP
                  </span>
                  <span className="bg-white/20 px-2 py-1 rounded text-sm">
                    🔥 {stats.streak} day streak
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <p className="text-gray-500 text-sm">Courses</p>
              <p className="text-2xl font-bold text-[#5a6499]">
                {stats.courses}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <p className="text-gray-500 text-sm">Lessons Done</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.lessonsCompleted}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <p className="text-gray-500 text-sm">Quizzes Passed</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.quizzesPassed}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <p className="text-gray-500 text-sm">Profile</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.profileCompletion}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Overall Progress</h2>
              <span className="text-sm text-gray-500">
                {stats.lessonsCompleted} / {stats.totalLessons} lessons
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-[#5a6499] h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${stats.totalLessons > 0 ? (stats.lessonsCompleted / stats.totalLessons) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{profile.department || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Level/Year</p>
                <p className="font-medium">{profile.level || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Learning Style</p>
                <p className="font-medium">
                  {profile.learningStyle || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Study Time</p>
                <p className="font-medium">
                  {profile.preferredStudyTime || "Not set"}
                </p>
              </div>
              {profile.bio && (
                <div>
                  <p className="text-sm text-gray-500">About Me</p>
                  <p className="font-medium text-gray-700">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => navigate("/editstudentprofile")}
            className="bg-[#5a6499] text-white px-6 py-2 rounded-lg hover:bg-[#4a5499] transition"
          >
            Edit Profile
          </button>
        </div>
      </main>
    </div>
  );
}

export default StudentProfile;
