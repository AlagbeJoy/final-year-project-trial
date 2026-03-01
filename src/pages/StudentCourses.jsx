import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import { useAuth } from "../context/AuthContext";
import { sampleCourses } from "../data/sampleCourses";

function StudentCourses() {
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all"); // 'all', 'sample', 'lecturer'

  useEffect(() => {
    // Load sample courses
    const samples = sampleCourses || [];

    // Load lecturer-created courses from localStorage
    const lecturerCourses = JSON.parse(
      localStorage.getItem("lecturer_courses") || "[]",
    );

    // Combine both, marking the source
    const combined = [
      ...samples.map((c) => ({ ...c, source: "sample" })),
      ...lecturerCourses.map((c) => ({ ...c, source: "lecturer" })),
    ];

    setAllCourses(combined);
  }, []);

  // Get enrolled courses from user profile
  const enrolledCourses = currentUser?.profile?.enrolledCourses || [];

  // Filter courses based on search and category
  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.source === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
      instructor: course.instructor || "Course Instructor",
      source: course.source,
      enrolledDate: new Date().toISOString(),
      progress: 0,
      completedLessons: [],
      completedQuizzes: [],
      modules: course.modules || [], // Include modules for the course detail
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

        {/* Search and Filter */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search courses..."
            className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499] focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
          >
            <option value="all">All Courses</option>
            <option value="sample">Sample Courses</option>
            <option value="lecturer">Lecturer Created</option>
          </select>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledCourses.some((c) => c.id === course.id);

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={
                    course.thumbnail || "https://via.placeholder.com/300x200"
                  }
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    {course.source === "lecturer" && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                        👨‍🏫 Lecturer
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {course.level}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {course.duration || "Self-paced"}
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
