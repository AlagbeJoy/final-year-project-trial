import React, { createContext, useContext, useEffect, useState } from "react";
import { generateLearningPath } from "../engine/learningPathEngine";
import badgeService from "../services/badgeService";
import api from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
console.log("🔧 API_URL is:", API_URL);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("AuthProvider - loading user:", parsedUser);
      console.log("AuthProvider - onboarded:", parsedUser.onboarded);

      const xp = parsedUser.xp || 0;

      const hydratedUser = {
        ...parsedUser,
        level: calculateLevel(xp),
        badges: checkBadges(xp),
      };

      setCurrentUser(hydratedUser);
      console.log("AuthProvider - user set:", hydratedUser);
    }
  }, []);

  const getUsers = () => {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const register = async (name, email, password, role) => {
    try {
      console.log("📝 Registering user:", { name, email, role });

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      console.log("✅ Registration successful:", data);

      // Calculate level for new user
      const userWithLevel = {
        ...data.user,
        level: calculateLevel(data.user.xp || 0),
      };

      localStorage.setItem("currentUser", JSON.stringify(userWithLevel));
      localStorage.setItem("token", data.token);
      setCurrentUser(userWithLevel);

      return { success: true, user: userWithLevel };
    } catch (error) {
      console.error("❌ Registration error:", error);
      return { success: false, message: error.message };
    }
  };

 const login = async (email, password) => {
   try {
     const response = await fetch(`${API_URL}/auth/login`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ email, password }),
     });

     const data = await response.json();

     if (!response.ok) {
       return { success: false, message: data.message };
     }

     // Load activities from API
     const activitiesRes = await fetch(`${API_URL}/activities`, {
       headers: { Authorization: `Bearer ${data.token}` },
     });
     const activities = await activitiesRes.json();

     data.user.activities = activities;

     localStorage.setItem("currentUser", JSON.stringify(data.user));
     localStorage.setItem("token", data.token);
     setCurrentUser(data.user);

     return { success: true, user: data.user };
   } catch (error) {
     console.error("Login error:", error);
     return { success: false, message: "Login failed" };
   }
 };

  const completeOnboarding = async (onboardingData, xpEarned) => {
    try {
      console.log("📝 Completing onboarding:", onboardingData);
      console.log("🔧 API_URL being used:", API_URL);

      const token = localStorage.getItem("token");
      const currentUserData = JSON.parse(localStorage.getItem("currentUser"));

      console.log("👤 Current user email:", currentUserData?.email);
      console.log("🔑 Token exists:", !!token);

      // FIX: Use the correct URL (removed duplicate)
      const response = await fetch(`${API_URL}/users/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          onboardingData,
          xpEarned: xpEarned || 30, // Make sure xp is sent
        }),
      });

      console.log("📥 Response status:", response.status);

      const data = await response.json();
      console.log("📦 Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Onboarding failed");
      }

      console.log("✅ Onboarding successful:", data);

      // FIX: Use the user data from the response (already has level calculated)
      const updatedUser = data.user;

      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      return { success: true };
    } catch (error) {
      console.error("❌ Onboarding error:", error);
      return { success: false, message: error.message };
    }
  };

  const getCourses = () => {
    const courses = localStorage.getItem("courses");
    return courses ? JSON.parse(courses) : [];
  };

  const saveCourses = (courses) => {
    localStorage.setItem("courses", JSON.stringify(courses));
  };

  const enrollCourse = (course) => {
    const courses = getCourses();

    const updatedCourses = courses.map((c) =>
      c.id === course.id
        ? { ...c, students: [...(c.students || []), currentUser.email] }
        : c,
    );

    saveCourses(updatedCourses);

    const users = getUsers();

    if (currentUser.profile?.enrolledCourses?.some((c) => c.id === course.id))
      return;

    const newCourse = {
      ...course,
      progress: 0,
      lastLesson: 0,
      lessonsCompleted: [],
    };

    const updatedUser = {
      ...currentUser,
      xp: (currentUser.xp || 0) + 5,
      level: calculateLevel((currentUser.xp || 0) + 5), // Recalculate level
      profile: {
        ...currentUser.profile,
        enrolledCourses: [
          ...(currentUser.profile?.enrolledCourses || []),
          newCourse,
        ],
      },
    };

    const updatedUsers = users.map((u) =>
      u.email === currentUser.email ? updatedUser : u,
    );

    saveUsers(updatedUsers);

    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  };

  const createCourse = (courseData) => {
    const courses = getCourses();

    const newCourse = {
      id: Date.now(),
      ...courseData,
      students: [],
      createdAt: Date.now(),
    };

    courses.push(newCourse);
    saveCourses(courses);

    return newCourse;
  };

  const trackActivity = (message, xpEarned = 0, type = "general") => {
    if (!currentUser) return;

    const users = getUsers();

    const newXP = (currentUser.xp || 0) + xpEarned;
    const newLevel = calculateLevel(newXP);
    const newBadges = checkBadges(newXP);

    const newActivity = {
      type,
      message,
      xp: xpEarned,
      date: new Date().toISOString(),
    };

    let updatedUser = {
      ...currentUser,
      xp: newXP,
      level: newLevel, // Level already recalculated
      badges: newBadges,
      activities: [newActivity, ...(currentUser.activities || [])],
    };

    const newEarnedBadges = badgeService.checkNewBadges(updatedUser);
    if (newEarnedBadges.length > 0) {
      updatedUser = badgeService.awardBadges(updatedUser, newEarnedBadges);
    }

    const updatedUsers = users.map((u) =>
      u.email === currentUser.email ? updatedUser : u,
    );

    saveUsers(updatedUsers);
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    return newEarnedBadges;
  };

  const updateProfile = (profileData) => {
    const users = getUsers();

    const updatedUser = {
      ...currentUser,
      profile: {
        ...currentUser.profile,
        ...profileData,
      },
    };
    const updatedUsers = users.map((u) =>
      u.email === currentUser.email ? updatedUser : u,
    );

    saveUsers(updatedUsers);

    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  const updateUser = (userData) => {
    const users = getUsers();

    // CRITICAL: Recalculate level based on XP
    const userWithLevel = {
      ...userData,
      level: calculateLevel(userData.xp || 0),
    };

    const newBadges = badgeService.checkNewBadges(userWithLevel);
    let updatedUserData = userWithLevel;

    if (newBadges.length > 0) {
      updatedUserData = badgeService.awardBadges(userWithLevel, newBadges);
      console.log("New badges earned:", newBadges);
    }

    const updatedUsers = users.map((u) =>
      u.email === updatedUserData.email ? updatedUserData : u,
    );

    saveUsers(updatedUsers);
    setCurrentUser(updatedUserData);
    localStorage.setItem("currentUser", JSON.stringify(updatedUserData));

    return updatedUserData;
  };

  const generateAndStoreLearningPath = () => {
    const users = getUsers();

    const path = generateLearningPath(currentUser);

    const updatedUser = {
      ...currentUser,
      learningPath: path,
    };

    const updatedUsers = users.map((u) =>
      u.email === currentUser.email ? updatedUser : u,
    );

    saveUsers(updatedUsers);

    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  const completeLesson = (courseId, lessonIndex, xpEarned = 5) => {
    const users = getUsers();
    const newXP = (currentUser.xp || 0) + xpEarned;
    const newLevel = calculateLevel(newXP);
    const newBadges = checkBadges(newXP);

    const updatedCourses = (currentUser.profile?.enrolledCourses || []).map(
      (course) => {
        if (course.id !== courseId) return course;

        const completed = course.lessonsCompleted?.includes(lessonIndex)
          ? course.lessonsCompleted
          : [...(course.lessonsCompleted || []), lessonIndex];

        const totalLessons = course.lessons?.length || 10;
        const progress = Math.round((completed.length / totalLessons) * 100);

        return {
          ...course,
          badges: checkBadges((currentUser.xp || 0) + xpEarned),
          lessonsCompleted: completed,
          lastLesson: lessonIndex,
          progress,
        };
      },
    );

    const updatedUser = {
      ...currentUser,
      xp: newXP,
      level: newLevel,
      badges: newBadges,
      profile: {
        ...currentUser.profile,
        enrolledCourses: updatedCourses,
      },
      activities: [
        {
          type: "lesson",
          message: "Completed lesson",
          xp: xpEarned,
          date: new Date().toISOString(),
        },
        ...(currentUser.activities || []),
      ],
    };
    const updatedUsers = users.map((u) =>
      u.email === currentUser.email ? updatedUser : u,
    );

    saveUsers(updatedUsers);
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  const checkBadges = (xp) => {
    const badges = [];

    if (xp >= 50) badges.push("Starter");
    if (xp >= 150) badges.push("Consistent Learner");
    if (xp >= 300) badges.push("Master");

    return badges;
  };

  const updateStreak = () => {
    if (!currentUser) return;

    const today = new Date().toDateString();
    const last = currentUser.lastActive;
    let streak = currentUser.streak || 0;

    if (!last) {
      streak = 1;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (new Date(last).toDateString() === yesterday.toDateString()) {
        streak += 1;
      } else if (new Date(last).toDateString() !== today) {
        streak = 1;
      }
    }

    if (currentUser.streak !== streak || currentUser.lastActive !== today) {
      const updatedUser = {
        ...currentUser,
        lastActive: today,
        streak,
      };

      const users = getUsers();
      const updatedUsers = users.map((u) =>
        u.email === currentUser.email ? updatedUser : u,
      );

      saveUsers(updatedUsers);
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  };

  const calculateLevel = (xp = 0) => {
    return Math.floor(xp / 100) + 1;
  };

  const generateDailyQuest = () => {
    const today = new Date().toDateString();

    if (currentUser?.dailyQuest?.date === today) return;

    const quest = {
      date: today,
      target: 2,
      completed: 0,
      reward: 20,
    };

    updateUser({
      ...currentUser,
      dailyQuest: quest,
    });
  };

  const refreshUser = () => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const xp = parsedUser.xp || 0;
      const hydratedUser = {
        ...parsedUser,
        level: calculateLevel(xp),
        badges: checkBadges(xp),
      };
      setCurrentUser(hydratedUser);
      console.log("AuthContext - manually refreshed user:", hydratedUser);
    }
  };

  // Add this function inside your AuthContext (after other functions)
  const updateCourseProgress = (courseId, progress) => {
    if (!currentUser) return;

    const users = getUsers();

    const updatedUser = {
      ...currentUser,
      profile: {
        ...currentUser.profile,
        enrolledCourses: currentUser.profile.enrolledCourses.map((course) => {
          if (course.courseId === courseId || course.id === courseId) {
            return { ...course, progress: progress };
          }
          return course;
        }),
      },
    };

    saveUsers(
      users.map((u) => (u.email === updatedUser.email ? updatedUser : u)),
    );
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        register,
        login,
        logout,
        completeOnboarding,
        enrollCourse,
        createCourse,
        getCourses,
        trackActivity,
        updateProfile,
        updateUser,
        generateAndStoreLearningPath,
        completeLesson,
        updateStreak,
        refreshUser,
        updateCourseProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};;;

export const useAuth = () => useContext(AuthContext);
