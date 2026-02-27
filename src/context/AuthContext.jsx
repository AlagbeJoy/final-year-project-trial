import React, { createContext, useContext, useEffect, useState } from "react";
import { generateLearningPath } from "../engine/learningPathEngine";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      const xp = parsedUser.xp || 0;

      setCurrentUser({
        ...parsedUser,
        xp,
        level: calculateLevel(xp),
        badges: checkBadges(xp),
      });
    }
  }, []);

  const getUsers = () => {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const register = (name, email, password, role) => {
    const users = getUsers();

    const userExists = users.find((u) => u.email === email);
    if (userExists) {
      return { success: false, message: "User already exists" };
    }

    const newUser = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role,
      onboarded: false,
      xp: 0,
      activities: [],
      badges: [],
      learningPath: [],
    };

    users.push(newUser);
    saveUsers(users);

    setCurrentUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    return { success: true };
  };

  const login = (email, password) => {
    const users = getUsers();
    // JSON.parse(localStorage.getItem("users")) || [];

    console.log("LOGIN ATTEMPT:", email, password);
    console.log("STORED USERS:", users);

    const existingUser = users.find(
      (u) =>
        u.email.trim() === email.trim() &&
        u.password.trim() === password.trim(),
    );

    if (!existingUser) {
      return { success: false, message: "Invalid email or password" };
    }

    // if (existingUser.password !== password) {
    //     return{
    //         success: false, message: "Incorrect password",
    //     };
    // }

    const xp = existingUser.xp || 0;

    const hydratedUser = {
      ...existingUser,
      xp,
      level: calculateLevel(xp),
      badges: checkBadges(xp),
    };
    setCurrentUser(hydratedUser);
    localStorage.setItem("currentUser", JSON.stringify(hydratedUser));

    return { success: true };
  };

  const completeOnboarding = (onboardingData, xpEarned) => {
    const users = getUsers();

    const recommendedCourses = generateLearningPath({
      ...currentUser,
      profile: onboardingData,
    });

    let updatedUser = null;

    const updatedUsers = users.map((u) => {
      if (u.email === currentUser.email) {
        updatedUser = {
          ...u,
          onboarded: true,
          profile: {
            name: u.name,
            ...onboardingData,
            enrolledCourses: [],
          },
          learningPath: recommendedCourses,
          xp: (u.xp || 0) + (xpEarned || 0) + 20,
          activities: [
            {
              type: "onboarding",
              message: "Completed profile onboarding",
              xp: 20,
              date: new Date().toISOString(),
            },
            ...(u.activities || []),
          ],
        };
        return updatedUser;
      }
      return u;
    });

    if (!updatedUser) {
      console.error("User not found in users array");
      return;
    }

    saveUsers(updatedUsers);

    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    console.log("Onboarding complete! User:", updatedUser);
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

    const updatedUser = {
      ...currentUser,
      xp: newXP,
      level: newLevel,
      badges: newBadges,
      activities: [newActivity, ...(currentUser.activities || [])],
    };

    const updatedUsers = users.map((u) =>
      u.email === currentUser.email ? updatedUser : u,
    );

    saveUsers(updatedUsers);

    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
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

    const updatedUsers = users.map((u) =>
      u.email === userData.email ? userData : u,
    );

    saveUsers(updatedUsers);
    setCurrentUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};;


export const useAuth = () =>  useContext(AuthContext);
