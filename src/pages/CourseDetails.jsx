import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StudentSidebar from "../components/StudentSidebar";
import { sampleCourses } from "../data/sampleCourses";

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser, updateUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [courseProgress, setCourseProgress] = useState(null);

  useEffect(() => {
    // Find the course
    const foundCourse = sampleCourses.find((c) => c.id === parseInt(courseId));
    if (foundCourse) {
      setCourse(foundCourse);
      setActiveModule(foundCourse.modules[0]);
      setActiveLesson(foundCourse.modules[0]?.lessons[0]);

      // Load progress from user data
      const enrolledCourse = currentUser?.profile?.enrolledCourses?.find(
        (c) => c.id === parseInt(courseId),
      );

      if (enrolledCourse) {
        setCourseProgress({
          completedLessons: enrolledCourse.completedLessons || [],
          completedQuizzes: enrolledCourse.completedQuizzes || [],
        });
      }
    }
  }, [courseId, currentUser]);

  const isLessonCompleted = (lessonId) => {
    return courseProgress?.completedLessons?.includes(lessonId) || false;
  };

  const completeLesson = (moduleId, lessonId) => {
    const lesson = course.modules
      .find((m) => m.id === moduleId)
      ?.lessons.find((l) => l.id === lessonId);

    if (!lesson) return;

    // Update progress
    const newCompletedLessons = [
      ...(courseProgress?.completedLessons || []),
      lessonId,
    ];

    // Update enrolled course in user profile
    const updatedEnrolledCourses = currentUser.profile.enrolledCourses.map(
      (c) => {
        if (c.id === parseInt(courseId)) {
          return {
            ...c,
            completedLessons: newCompletedLessons,
            progress: Math.round(
              (newCompletedLessons.length /
                course.modules.reduce((acc, m) => acc + m.lessons.length, 0)) *
                100,
            ),
          };
        }
        return c;
      },
    );

    // Create activity
    const newActivity = {
      message: `Completed lesson: ${lesson.title} in ${course.title}`,
      xp: lesson.xpReward,
      date: new Date().toISOString(),
      type: "lesson",
    };

    // Update user
    const updatedUser = {
      ...currentUser,
      xp: (currentUser.xp || 0) + lesson.xpReward,
      profile: {
        ...currentUser.profile,
        enrolledCourses: updatedEnrolledCourses,
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

    updateUser(updatedUser);

    setCourseProgress({
      completedLessons: newCompletedLessons,
      completedQuizzes: courseProgress?.completedQuizzes || [],
    });

    alert(`✅ Lesson completed! +${lesson.xpReward} XP`);
  };

  const submitQuiz = (moduleId) => {
    const module = course.modules.find((m) => m.id === moduleId);
    if (!module) return;

    // Calculate score
    let correct = 0;
    module.quiz.questions.forEach((q, index) => {
      if (selectedAnswers[`${moduleId}-${index}`] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / module.quiz.questions.length) * 100);
    const passed = score >= module.quiz.passingScore;

    if (passed) {
      // Update completed quizzes
      const newCompletedQuizzes = [
        ...(courseProgress?.completedQuizzes || []),
        moduleId,
      ];

      // Update enrolled course
      const updatedEnrolledCourses = currentUser.profile.enrolledCourses.map(
        (c) => {
          if (c.id === parseInt(courseId)) {
            return {
              ...c,
              completedQuizzes: newCompletedQuizzes,
            };
          }
          return c;
        },
      );

      // Create activity
      const newActivity = {
        message: `Passed ${module.quiz.title} with ${score}%`,
        xp: module.quiz.xpReward,
        date: new Date().toISOString(),
        type: "quiz",
      };

      // Update user
      const updatedUser = {
        ...currentUser,
        xp: (currentUser.xp || 0) + module.quiz.xpReward,
        profile: {
          ...currentUser.profile,
          enrolledCourses: updatedEnrolledCourses,
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

      updateUser(updatedUser);

      setCourseProgress({
        completedLessons: courseProgress?.completedLessons || [],
        completedQuizzes: newCompletedQuizzes,
      });
    }

    setQuizResult({
      score,
      passed,
      correct,
      total: module.quiz.questions.length,
    });
  };

  if (!course) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <StudentSidebar />
        <main className="flex-1 p-8">
          <div className="text-center">Loading course...</div>
        </main>
      </div>
    );
  }

  const progress = courseProgress
    ? Math.round(
        ((courseProgress.completedLessons?.length || 0) /
          course.modules.reduce((acc, m) => acc + m.lessons.length, 0)) *
          100,
      )
    : 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8">
        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
          <p className="text-gray-600 mt-2">{course.description}</p>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Course Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#5a6499] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {course.level}
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              {course.duration}
            </span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
              {course.instructor}
            </span>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Modules Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h2 className="font-semibold text-lg mb-4">Course Modules</h2>
              <div className="space-y-2">
                {course.modules.map((module, index) => {
                  const allLessonsCompleted = module.lessons.every((l) =>
                    isLessonCompleted(l.id),
                  );

                  return (
                    <div
                      key={module.id}
                      onClick={() => {
                        setActiveModule(module);
                        setActiveLesson(module.lessons[0]);
                        setShowQuiz(false);
                        setQuizResult(null);
                      }}
                      className={`p-3 rounded-lg cursor-pointer transition ${
                        activeModule?.id === module.id
                          ? "bg-[#5a6499] text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Module {index + 1}</span>
                        {allLessonsCompleted && (
                          <span className="text-green-400">✓</span>
                        )}
                      </div>
                      <p className="text-sm truncate">{module.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {!showQuiz ? (
                <>
                  <h2 className="text-xl font-semibold mb-4">
                    {activeModule?.title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {activeModule?.description}
                  </p>

                  <div className="space-y-4">
                    {activeModule?.lessons.map((lesson, index) => {
                      const completed = isLessonCompleted(lesson.id);

                      return (
                        <div
                          key={lesson.id}
                          className={`border rounded-lg p-4 ${
                            activeLesson?.id === lesson.id
                              ? "border-[#5a6499] bg-blue-50"
                              : ""
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => setActiveLesson(lesson)}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                  Lesson {index + 1}
                                </span>
                                {completed && (
                                  <span className="text-green-500">
                                    ✓ Completed
                                  </span>
                                )}
                              </div>
                              <h3 className="font-medium mt-1">
                                {lesson.title}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {lesson.duration} • {lesson.xpReward} XP
                              </p>
                            </div>

                            {!completed && (
                              <button
                                onClick={() =>
                                  completeLesson(activeModule.id, lesson.id)
                                }
                                className="bg-[#5a6499] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#4a5499] transition"
                              >
                                Mark Complete
                              </button>
                            )}
                          </div>

                          {activeLesson?.id === lesson.id && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                              {lesson.type === "video" ? (
                                <div>
                                  <p className="font-medium mb-2">
                                    📺 Video Lesson
                                  </p>
                                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                                    <iframe
                                      src={lesson.videoUrl}
                                      title={lesson.title}
                                      className="w-full h-full rounded-lg"
                                      allowFullScreen
                                    ></iframe>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <p className="font-medium mb-2">
                                    📖 Reading Material
                                  </p>
                                  <p className="text-gray-700">
                                    {lesson.content}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Module Quiz Button */}
                  {activeModule && (
                    <div className="mt-6 pt-6 border-t">
                      <button
                        onClick={() => {
                          setShowQuiz(true);
                          setSelectedAnswers({});
                          setQuizResult(null);
                        }}
                        className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
                      >
                        Take Module Quiz ({activeModule.quiz.xpReward} XP)
                      </button>
                    </div>
                  )}
                </>
              ) : (
                // Quiz Section
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">
                      {activeModule?.quiz.title}
                    </h2>
                    <button
                      onClick={() => setShowQuiz(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ← Back to Lessons
                    </button>
                  </div>

                  {!quizResult ? (
                    <>
                      <div className="space-y-6">
                        {activeModule?.quiz.questions.map((q, qIndex) => (
                          <div key={q.id} className="border p-4 rounded-lg">
                            <p className="font-medium mb-3">
                              {qIndex + 1}. {q.question}
                            </p>
                            <div className="space-y-2">
                              {q.options.map((option, oIndex) => (
                                <label
                                  key={oIndex}
                                  className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                                >
                                  <input
                                    type="radio"
                                    name={`q-${qIndex}`}
                                    value={oIndex}
                                    checked={
                                      selectedAnswers[
                                        `${activeModule.id}-${qIndex}`
                                      ] === oIndex
                                    }
                                    onChange={() =>
                                      setSelectedAnswers({
                                        ...selectedAnswers,
                                        [`${activeModule.id}-${qIndex}`]:
                                          oIndex,
                                      })
                                    }
                                    className="w-4 h-4"
                                  />
                                  <span>{option}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => submitQuiz(activeModule.id)}
                        className="w-full bg-[#5a6499] text-white py-3 rounded-lg font-semibold hover:bg-[#4a5499] transition mt-6"
                      >
                        Submit Quiz
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <div
                        className={`text-5xl mb-4 ${quizResult.passed ? "text-green-500" : "text-red-500"}`}
                      >
                        {quizResult.passed ? "🎉" : "😢"}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        {quizResult.passed ? "Congratulations!" : "Try Again!"}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        You scored {quizResult.score}% ({quizResult.correct}/
                        {quizResult.total} correct)
                      </p>
                      {quizResult.passed && (
                        <p className="text-green-600 font-semibold mb-4">
                          +{activeModule?.quiz.xpReward} XP earned!
                        </p>
                      )}
                      <button
                        onClick={() => {
                          setShowQuiz(false);
                          setQuizResult(null);
                        }}
                        className="bg-[#5a6499] text-white px-6 py-2 rounded-lg hover:bg-[#4a5499] transition"
                      >
                        Back to Lessons
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CourseDetail;
