import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function LecturerStats() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalMaterials: 0,
    totalQuizzes: 0,
  });

  useEffect(() => {
    // Load lecturer's courses
    const allCourses = JSON.parse(
      localStorage.getItem("lecturer_courses") || "[]",
    );
    const myCourses = allCourses.filter(
      (c) => c.instructorId === currentUser?.email,
    );

    // Calculate stats
    let materialsCount = 0;
    let quizzesCount = 0;

    myCourses.forEach((course) => {
      course.modules?.forEach((module) => {
        materialsCount += module.lessons?.length || 0;
        if (module.quiz) quizzesCount++;
      });
    });

    setStats({
      totalCourses: myCourses.length,
      totalStudents: 0, // You can calculate this from enrolled students
      totalMaterials: materialsCount,
      totalQuizzes: quizzesCount,
    });
  }, [currentUser]);

  const statCards = [
    {
      label: "Total Courses",
      value: stats.totalCourses,
      icon: "📚",
      color: "bg-blue-500",
    },
    {
      label: "Active Students",
      value: stats.totalStudents,
      icon: "👥",
      color: "bg-green-500",
    },
    {
      label: "Materials",
      value: stats.totalMaterials,
      icon: "📄",
      color: "bg-purple-500",
    },
    {
      label: "Quizzes",
      value: stats.totalQuizzes,
      icon: "📝",
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">{stat.icon}</span>
            <span className={`${stat.color} w-2 h-2 rounded-full`}></span>
          </div>
          <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
          <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

export default LecturerStats;
