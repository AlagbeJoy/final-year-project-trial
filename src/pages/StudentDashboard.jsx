import React, { useRef, useState } from 'react'
import NavBar from '../components/NavBar'
import WelcomeBanner from '../components/WelcomeBanner'
import ProgressCard from '../components/ProgressCard'
import DailyChallenge from '../components/DailyChallenge'
import ContinueLearning from '../components/ContinueLearning'
import BadgesGrid from '../components/BadgesGrid'
import LeaderboardPreview from '../components/LeaderboardPreview'
import StudentSidebar from '../components/StudentSidebar'
import { useAuth } from '../context/AuthContext'
import EmptyStateCard from '../components/EmptyStateCard'
import ActivityFeed from '../components/ActivityFeed'
import { generateLearningPath } from '../engine/learningPathEngine'
import { useEffect } from "react";

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

  // Add a try-catch around the entire render
  try {
    console.log("Dashboard rendering with user:", currentUser);
    console.log("User profile:", currentUser.profile);
    console.log("User activities:", currentUser.activities);

    const isNewUser =
      !currentUser?.onboarded ||
      !currentUser?.profile ||
      !currentUser?.profile?.enrolledCourses?.length ||
      currentUser?.xp === 0;

    const enrolledCourses = currentUser?.profile?.enrolledCourses || [];

    const starterLeaderboard = [
      { name: "Top Student Demo", xp: 320 },
      { name: "Active Learner Demo", xp: 210 },
    ];

    const profileCompletion = () => {
      if (!currentUser.profile) return 20;

      let score = 20;
      if (currentUser.profile?.department) score += 20;
      if (currentUser.profile?.level) score += 20;
      if (currentUser.profile?.lessonStyle) score += 20;
      if (currentUser.profile?.studyTime) score += 20;

      return score;
    };

    const recommendedPath = currentUser.learningPath?.length
      ? currentUser.learningPath
      : generateLearningPath(currentUser);

    return (
      <div className="flex min-h-screen bg-gray-50">
        <StudentSidebar />

        <main className="flex-1 px-6 py-6 space-y-6">
          <WelcomeBanner user={currentUser} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Your Level</h3>
              <p className="text-lg font-bold">
                Level {currentUser.level || 1}
              </p>

              <div className="w-full bg-gray-200 rounded h-3 mt-3">
                <div
                  className="bg-blue-500 h-3 rounded"
                  style={{ width: `${Math.min(currentUser.xp % 100, 100)}%` }}
                ></div>
              </div>

              <p className="text-sm mt-2">{currentUser.xp || 0} XP</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">🔥 Streak</h3>
              <p className="text-2xl font-bold">
                {currentUser.streak || 0} days
              </p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">🎯 Daily Quest</h3>

              {currentUser.dailyQuest ? (
                <>
                  <p>Complete {currentUser.dailyQuest.target} lessons</p>
                  <p className="text-sm text-gray-500">
                    Progress: {currentUser.dailyQuest.completed}/
                    {currentUser.dailyQuest.target}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-400">No quest yet</p>
              )}
            </div>
          </div>

          {isNewUser && (
            <EmptyStateCard
              title="Welcome! Let's get you started 🚀"
              description="Complete your profile an enroll in coureses to begin learning."
              buttonText="Complete Profile"
              to="/profile"
            />
          )}

          {currentUser.xp > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProgressCard
                xp={currentUser.xp}
                profileCompletion={profileCompletion()}
              />
              <DailyChallenge />
            </div>
          ) : (
            <EmptyStateCard
              title="No progress yet"
              description="Start your first course to earn XP and track progress."
              buttonText="Browse Courses"
              to="/studentcourse"
            />
          )}

          <ContinueLearning
            courses={
              currentUser.profile?.enrolledCourses?.length
                ? currentUser.profile.enrolledCourses
                : recommendedPath || []
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BadgesGrid xp={currentUser.xp} />
            <LeaderboardPreview
              demo={currentUser.xp === 0}
              starterLeaderboard={starterLeaderboard}
            />
          </div>

          <ActivityFeed activities={currentUser.activities || []} />
        </main>
      </div>
    );
  } catch (err) {
    console.error("Render error:", err);
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Render Error</h2>
          <p className="text-gray-700 mb-4">{err.message}</p>
          <pre className="bg-gray-100 p-4 rounded text-left overflow-auto max-w-2xl">
            {err.stack}
          </pre>
        </div>
      </div>
    );
  }
}


export default StudentDashboard;