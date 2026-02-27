import React, { useState } from 'react'
import StudentSidebar from '../components/StudentSidebar'
import CourseCard from '../components/CourseCard'
import { useAuth } from '../context/AuthContext';

function StudentCourses() {
  const {currentUser, updateProfile} = useAuth();

  const coursesData = [
    {
      id: 1,
      title: "AI Fundamentals",
      level: "Beginner",
      duration: "6 weeks",
      description: "Introduction to Artificial Intelligence concepts.",
    },
    {
      id: 2,
      title: "DBMS Basics",
      level: "Beginner",
      duration: "4 weeks",
      description: "Learn database design and SQL fundamentals.",
    },
    {
      id: 3,
      title: "Software Engineering",
      level: "Intermediate",
      duration: "8 weeks",
      description: "Software development lifecycle and best practices.",
    },
    {
      id: 4,
      title: "React Development",
      level: "Intermediate",
      duration: "6 weeks",
      description: "Build dynamic web apps using React.",
    },
  ];

  const enrolledCourses = currentUser?.profile?.enrolledCourses || [];

  const [search, setSearch] = useState("");

  const filteredCourses = coursesData.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase()
    ));

    const enrollCourse = (courseTitle) => {
      if (enrolledCourses.includes(courseTitle)) {
        alert("Already enrolled!");
        return;
      }

    const updatedCourses = [...enrolledCourses, courseTitle];
    
     const newActivity = {
       message: `Enrolled in ${courseTitle}`,
       xp: 50,
       date: new Date().toISOString(),
       type: "enrollment",
     }; 

    const updatedUser = {
      ...currentUser,
      xp: (currentUser.xp || 0) + 50,
      profile: {
        ...currentUser.profile,
        enrolledCourses: updatedCourses,
      },
      activities: [
       newActivity,
       ...(currentUser.activities || []),
      ],
    };

     const users = JSON.parse(localStorage.getItem("users") || "[]");
     const updatedUsers = users.map((u) =>
       u.email === currentUser.email ? updatedUser : u,
     );

    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    updateProfile(updatedUser.profile);

    alert("Enrolled successfully! +50 XP");

    window.location.reload();
    };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Browse Courses
        </h2>

        <input
          type="text"
          placeholder="Search courses..."
          className="w-full border p-3 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-6 rounded-xl shadow space-y-3"
            >
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-500">{course.description}</p>
              <p className="text-sm">
                <span className="font-medium">Level:</span> {course.level}
              </p>

              <p className="text-sm">
                <span className="font-medium">Duration:</span> {course.duration}
              </p>

              <button
                onClick={() => enrollCourse(course.title)}
                className={`w-full py-2 rounded text-white ${
                  enrolledCourses.includes(course.title)
                    ? "bg-gray-400"
                    : "bg-[#5a6499]"
                }`}
              >
                {enrolledCourses.includes(course.title)
                  ? "Enrolled"
                  : "Enroll"}
              </button>
            </div>
          ))}   
        </div>
      </main>
    </div>
  );
}

export default StudentCourses