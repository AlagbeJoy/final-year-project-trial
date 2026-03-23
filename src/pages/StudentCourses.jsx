import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function StudentCourses() {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    // Get enrolled course IDs from user profile
    const enrolled = currentUser?.profile?.enrolledCourses || [];
    setEnrolledCourseIds(enrolled.map((c) => c.courseId || c.id));
  }, [currentUser]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching courses from API...");
      const response = await api.getCourses();
      console.log("✅ Courses received:", response);

      const coursesData = Array.isArray(response)
        ? response
        : response.courses || [];

      // Only show published courses
      const publishedCourses = coursesData.filter(
        (course) => course.published === true,
      );

      setCourses(publishedCourses);
      console.log(`📚 Loaded ${publishedCourses.length} published courses`);
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

const enrollCourse = async (course) => {
  try {
    setEnrolling(true);

    const courseId = course._id || course.id;

    // Get FULL course details from API (includes title)
    const fullCourse = await api.getCourse(courseId);
    console.log("Full course data:", fullCourse);

    // Enroll via API
    await api.enrollCourse(courseId);

    // Create enrolled course with ALL data including title
    const newEnrolledCourse = {
      courseId: courseId,
      id: courseId,
      title: fullCourse.title, // This is the key fix!
      description: fullCourse.description,
      level: fullCourse.level,
      duration: fullCourse.duration,
      units: fullCourse.units || [],
      instructor: fullCourse.instructor?.name,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      completedLessons: [],
      completedQuizzes: [],
    };

    console.log("Saving enrolled course:", newEnrolledCourse);

    // Update user
    const updatedUser = {
      ...currentUser,
      xp: (currentUser.xp || 0) + 50,
      profile: {
        ...currentUser.profile,
        enrolledCourses: [
          ...(currentUser.profile?.enrolledCourses || []),
          newEnrolledCourse,
        ],
      },
    };

    updateUser(updatedUser);

    alert(`✅ Enrolled in ${fullCourse.title}! +50 XP`);
    navigate(`/course/${courseId}`);
  } catch (error) {
    console.error("Error enrolling:", error);
    alert("Failed to enroll");
  } finally {
    setEnrolling(false);
  }
};

  const goToCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  // Filter courses based on search
  const filteredCourses = courses.filter((course) =>
    course.title?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <StudentSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#5a6499] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading courses...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Browse Courses
          </h2>
          <span className="text-sm text-gray-500">
            {filteredCourses.length} courses available
          </span>
        </div>

        <input
          type="text"
          placeholder="Search courses..."
          className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499] focus:border-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg">No courses found</p>
            <p className="text-sm text-gray-400 mt-2">
              {courses.length === 0
                ? "No courses have been approved yet. Check back later!"
                : "Try adjusting your search terms"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const courseId = course._id || course.id;
              const isEnrolled = enrolledCourseIds.includes(courseId);

              return (
                <div
                  key={courseId}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  <img
                    src={
                      course.thumbnail || "https://via.placeholder.com/300x200"
                    }
                    alt={course.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200";
                    }}
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {course.level || "Beginner"}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {course.duration || "Self-paced"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>👨‍🏫 {course.instructor?.name || "Instructor"}</span>
                      <span>📚 {course.units?.length || 0} units</span>
                    </div>

                    <button
                      onClick={() =>
                        isEnrolled ? goToCourse(courseId) : enrollCourse(course)
                      }
                      disabled={!isEnrolled && enrolling}
                      className={`w-full py-2 rounded-lg font-semibold transition ${
                        isEnrolled
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : enrolling
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-[#5a6499] text-white hover:bg-[#4a5499]"
                      }`}
                    >
                      {isEnrolled
                        ? "Go to Course →"
                        : enrolling
                          ? "Enrolling..."
                          : "Enroll Now (+50 XP)"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentCourses;
