import React from 'react'
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
  const {currentUser, updateStreak} = useAuth();

  useEffect(() => {
    if (currentUser) {
      updateStreak();
    }
  }, [currentUser]);

  if (!currentUser) {
    return <div>Loading....</div>
  }

    const isNewUser = !currentUser?.onboarded;
    // ||
    // !currentUser?.profile ||
    // !currentUser?.profile?.enrolledCourses?.length ||
    // currentUser?.xp === 0;

  console.log(currentUser);

  const enrolledCourses = currentUser?.profile?.enrolledCourses || [];

  const starterCourses = [
    { title: "AI Fundamentals", progress: 0 },
    { title: "DBMS Basics", progress: 0 },
    { title: "Software Engineering Intro", progress: 0 },
  ];

    const starterLeaderboard = [
      { name: "Top Student Demo", xp: 320 },
      { name: "Active Learner Demo", xp: 210 },
    ];

    const starterActivities = [
      "Complete your profile",
      "Enroll in first course",
      "Attempt daily challenge",
    ];

    const profileCompletion = () => {
      if (!currentUser.profile) return 20;

      let score = 20;

      if (currentUser.profile.department) score +=20;
      if (currentUser.profile.level) score += 20;
      if (currentUser.profile.lessonStyle) score += 20;
      if (currentUser.profile.studyTime) score += 20;

      return score;
    }

    const engagementEngine = () => { 
      const tasks = [];

      if (!currentUser.profile) {
        tasks.push("Complete Profile");
      }

      if (!currentUser.profile?.enrolledCourses?.length) {
        tasks.push("Enroll in your first course");
      }

      if (currentUser.xp === 0) {
        tasks.push("Attempt daily challenge");
      }
      return tasks;
    };

    const recommendedPath = 
    currentUser.learningPath?.length
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
            <p className="text-lg font-bold">Level {currentUser.level || 1}</p>

            <div className="w-full bg-gray-200 rounded h-3 mt-3">
              <div
                className="bg-blue-500 h-3 rounded"
                style={{ width: `${currentUser.xp % 100}%` }}
              ></div>
            </div>

            <p className="text-sm mt-2">{currentUser.xp || 0} XP</p>
          </div>
              <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">🔥 Streak</h3>
          <p className="text-2xl font-bold">{currentUser.streak || 0} days</p>
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
              : recommendedPath
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
}

export default StudentDashboard