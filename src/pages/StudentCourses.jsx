import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import { useAuth } from "../context/AuthContext";
import { sampleCourses } from "../data/sampleCourses";

function StudentCourses() {
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Load courses from our sample data
    setCourses(sampleCourses);
  }, []);

  // Get enrolled courses from user profile
  const enrolledCourses = currentUser?.profile?.enrolledCourses || [];

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase()),
  );

  const enrollCourse = (course) => {
    // Check if already enrolled
    if (enrolledCourses.some((c) => c.id === course.id)) {
      alert("Already enrolled!");
      return;
    }

    // Create enrolled course object with progress tracking
    const courseToEnroll = {
      id: course.id,
      title: course.title,
      level: course.level,
      description: course.description,
      enrolledDate: new Date().toISOString(),
      progress: 0,
      completedLessons: [],
      completedQuizzes: [],
    };

    const updatedCourses = [...enrolledCourses, courseToEnroll];

    // Create activity
    const newActivity = {
      message: `Enrolled in ${course.title}`,
      xp: 50,
      date: new Date().toISOString(),
      type: "enrollment",
    };

    // Update user
    const updatedUser = {
      ...currentUser,
      xp: (currentUser.xp || 0) + 50,
      profile: {
        ...currentUser.profile,
        enrolledCourses: updatedCourses,
      },
      activities: [newActivity, ...(currentUser.activities || [])],
    };

    // Save to localStorage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u) =>
      u.email === currentUser.email ? updatedUser : u,
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    updateProfile(updatedUser.profile);

    alert(`✅ Enrolled successfully! +50 XP`);

    // Navigate to course detail
    navigate(`/course/${course.id}`);
  };

  const viewCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Browse Courses
          </h2>
        </div>

        <input
          type="text"
          placeholder="Search courses..."
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499] focus:border-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledCourses.some((c) => c.id === course.id);

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {course.level}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {course.duration}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {isEnrolled ? (
                      <button
                        onClick={() => viewCourse(course.id)}
                        className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                      >
                        Continue Learning
                      </button>
                    ) : (
                      <button
                        onClick={() => enrollCourse(course)}
                        className="flex-1 bg-[#5a6499] text-white py-2 rounded hover:bg-[#4a5499] transition"
                      >
                        Enroll Now (+50 XP)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No courses found matching your search.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentCourses;
