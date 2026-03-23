import React, { useRef, useState, useEffect } from "react";
import StudentSidebar from "../components/StudentSidebar";
import { useAuth } from "../context/AuthContext";
import StudentWelcome from "../components/student/StudentWelcome";
import StudentStats from "../components/student/StudentStats";
import StudentProgress from "../components/student/StudentProgress";
import StudentQuickActions from "../components/student/StudentQuickActions";
import StudentRecentActivity from "../components/student/StudentRecentActivity";
import ContinueLearning from "../components/ContinueLearning";
import EmptyStateCard from "../components/EmptyStateCard";

function StudentDashboard() {
  const { currentUser, updateStreak } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasUpdatedStreak = useRef(false);

  useEffect(() => {
    try {
      if (currentUser && !hasUpdatedStreak.current) {
        updateStreak();
        hasUpdatedStreak.current = true;
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error in useEffect:", err);
      setError(err.message);
      setIsLoading(false);
    }
  }, [currentUser, updateStreak]);

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#5a6499] text-white px-6 py-2 rounded"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser || isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#5a6499] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const isNewUser =
    !currentUser?.onboarded ||
    !currentUser?.profile ||
    !currentUser?.profile?.enrolledCourses?.length ||
    currentUser?.xp === 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 px-6 py-6 space-y-6">
        <StudentWelcome user={currentUser} />
        <StudentStats user={currentUser} />

        <StudentQuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StudentProgress user={currentUser} />

            {isNewUser ? (
              <EmptyStateCard
                title="Welcome! Let's get you started 🚀"
                description="Complete your profile and enroll in courses to begin learning."
                buttonText="Complete Profile"
                to="/profile"
              />
            ) : (
              <ContinueLearning
                courses={currentUser.profile?.enrolledCourses || []}
              />
            )}
          </div>

          <div className="space-y-6">
            <StudentRecentActivity activities={currentUser.activities} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
