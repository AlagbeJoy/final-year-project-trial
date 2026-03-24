import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StudentSidebar from "../components/StudentSidebar";
import api from "../services/api";

function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser, updateUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeUnit, setActiveUnit] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [lectureDone, setLectureDone] = useState(false);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [progress, setProgress] = useState({});
  const [courseCompleted, setCourseCompleted] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await api.getCourse(courseId);
      setCourse(response);

      const saved = JSON.parse(
        localStorage.getItem(`course_${courseId}_progress`) || "{}",
      );
      setProgress(saved);

      if (saved[activeUnit]?.lectureDone) {
        setLectureDone(true);
      }

      // Check if course was already completed
      const enrolledCourse = currentUser?.profile?.enrolledCourses?.find(
        (c) => c.courseId === courseId || c.id === courseId,
      );
      if (enrolledCourse?.completed) {
        setCourseCompleted(true);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to save activity to database
  const saveActivityToDatabase = async (type, message, xp = 0) => {
    try {
      // Call the API to save activity
      await api.addActivity(type, message, xp);
      console.log("✅ Activity saved to database:", message);
    } catch (error) {
      console.error("Error saving activity:", error);
    }
  };

  const calculateOverallProgress = () => {
    const totalUnits = course?.units?.length || 1;
    const completedUnits = Object.values(progress).filter(
      (p) => p.quizPassed,
    ).length;
    return Math.min(Math.round((completedUnits / totalUnits) * 100), 100);
  };

  const checkCourseCompletion = () => {
    const totalUnits = course?.units?.length || 1;
    const completedUnits = Object.values(progress).filter(
      (p) => p.quizPassed,
    ).length;
    const isComplete = completedUnits === totalUnits && totalUnits > 0;

    if (isComplete && !courseCompleted) {
      setCourseCompleted(true);

      const updatedEnrolledCourses = currentUser.profile.enrolledCourses.map(
        (c) => {
          if (c.courseId === courseId || c.id === courseId) {
            return {
              ...c,
              completed: true,
              completedAt: new Date().toISOString(),
              progress: 100,
            };
          }
          return c;
        },
      );

      const updatedUser = {
        ...currentUser,
        profile: {
          ...currentUser.profile,
          enrolledCourses: updatedEnrolledCourses,
        },
        xp: (currentUser.xp || 0) + 100,
      };

      updateUser(updatedUser);

      // Save completion activity to database
      saveActivityToDatabase(
        "achievement",
        `🎓 Completed course: ${course.title}`,
        100,
      );

      alert(
        `🎉 Congratulations! You've completed ${course.title}! +100 Bonus XP!`,
      );
    }
  };

  const markLectureDone = () => {
    setLectureDone(true);
    const newProgress = {
      ...progress,
      [activeUnit]: { ...progress[activeUnit], lectureDone: true },
    };
    setProgress(newProgress);
    localStorage.setItem(
      `course_${courseId}_progress`,
      JSON.stringify(newProgress),
    );

    const unit = course.units[activeUnit];
    const xp = unit?.xpReward / 2 || 40;

    const totalUnits = course.units?.length || 1;
    const completedUnits = Object.values(newProgress).filter(
      (p) => p.quizPassed,
    ).length;
    const overallProgress = Math.round((completedUnits / totalUnits) * 100);

    const updatedUser = {
      ...currentUser,
      xp: (currentUser.xp || 0) + xp,
    };

    updateUser(updatedUser);

    // SAVE ACTIVITY TO DATABASE
    saveActivityToDatabase("lesson", `Completed: ${unit?.title}`, xp);

    alert(`✅ Lecture completed! +${xp} XP`);

    checkCourseCompletion();
  };

  const submitQuiz = () => {
    const unit = course.units[activeUnit];
    if (!unit) return;

    let correct = 0;
    unit.quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });

    const score = Math.round((correct / unit.quiz.questions.length) * 100);
    const passed = score >= 70;

    if (passed) {
      const newProgress = {
        ...progress,
        [activeUnit]: {
          ...progress[activeUnit],
          lectureDone: true,
          quizPassed: true,
          quizScore: score,
        },
      };
      setProgress(newProgress);
      localStorage.setItem(
        `course_${courseId}_progress`,
        JSON.stringify(newProgress),
      );

      const totalUnits = course.units?.length || 1;
      const completedUnits = Object.values(newProgress).filter(
        (p) => p.quizPassed,
      ).length;
      const overallProgress = Math.round((completedUnits / totalUnits) * 100);

      const xp = unit.xpReward / 2 || 40;
      const updatedUser = {
        ...currentUser,
        xp: (currentUser.xp || 0) + xp,
      };
      updateUser(updatedUser);

      // SAVE QUIZ ACTIVITY TO DATABASE
      saveActivityToDatabase(
        "quiz",
        `Passed quiz: ${unit.title} with ${score}%`,
        xp,
      );

      checkCourseCompletion();
    }

    setQuizResult({
      score,
      passed,
      correct,
      total: unit.quiz.questions.length,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <StudentSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#5a6499] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading course...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <StudentSidebar />
        <main className="flex-1 p-8">
          <div className="text-center">Course not found</div>
        </main>
      </div>
    );
  }

  const units = course.units || [];
  const currentUnit = units[activeUnit];
  const unitProgress = progress[activeUnit] || {};
  const isLocked = activeUnit > 0 && !progress[activeUnit - 1]?.quizPassed;

  // If course is completed
  if (courseCompleted) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <StudentSidebar />
        <main className="flex-1 p-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg p-12 text-center text-white max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-3xl font-bold mb-4">Course Completed!</h1>
            <p className="text-xl mb-6">You've successfully completed</p>
            <h2 className="text-2xl font-bold mb-6">{course.title}</h2>
            <div className="bg-white/20 rounded-lg p-4 mb-8">
              <p className="text-lg">🎓 +100 Bonus XP Earned!</p>
            </div>
            <button
              onClick={() => navigate("/studentdashboard")}
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-8">
        {/* Course Header */}
        <div className="bg-gradient-to-r from-[#5a6499] to-[#7c83b3] rounded-xl p-6 mb-6 text-white">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="opacity-90 mt-1">{course.description}</p>
          <div className="flex gap-3 mt-3">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {course.level}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {calculateOverallProgress()}% Complete
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Units Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl p-4">
              <h2 className="font-bold mb-3">Units</h2>
              {units.map((unit, index) => {
                const unitLocked =
                  index > 0 && !progress[index - 1]?.quizPassed;
                const unitProg = progress[index] || {};

                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (!unitLocked) {
                        setActiveUnit(index);
                        setShowQuiz(false);
                        setQuizResult(null);
                        setLectureDone(!!progress[index]?.lectureDone);
                      }
                    }}
                    disabled={unitLocked}
                    className={`w-full text-left p-3 rounded mb-2 transition ${
                      activeUnit === index
                        ? "bg-[#5a6499] text-white"
                        : unitLocked
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Unit {index + 1}</span>
                      <div className="flex gap-1">
                        {unitProg.lectureDone && (
                          <span className="text-green-500">📖</span>
                        )}
                        {unitProg.quizPassed && (
                          <span className="text-green-500">✓</span>
                        )}
                        {unitLocked && (
                          <span className="text-gray-400">🔒</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm truncate">{unit.title}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unit Content */}
          <div className="md:col-span-3">
            {!currentUnit ? (
              <div className="bg-white p-8 text-center rounded-xl">
                No units in this course
              </div>
            ) : isLocked ? (
              <div className="bg-white p-12 text-center rounded-xl">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-2">Unit Locked</h3>
                <p className="text-gray-500">
                  Complete the previous unit and pass its quiz to unlock this
                  content
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6">
                {!showQuiz ? (
                  <>
                    <h2 className="text-2xl font-bold mb-4">
                      {currentUnit.title}
                    </h2>

                    {currentUnit.lecture?.videoUrl && (
                      <div className="mb-6">
                        <div className="aspect-video rounded-lg overflow-hidden bg-gray-900">
                          <iframe
                            src={currentUnit.lecture.videoUrl}
                            title={currentUnit.title}
                            className="w-full h-full"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    )}

                    {currentUnit.lecture?.content && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="prose max-w-none whitespace-pre-wrap">
                          {currentUnit.lecture.content}
                        </div>
                      </div>
                    )}

                    {currentUnit.lecture?.materials &&
                      currentUnit.lecture.materials.length > 0 && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                          <h3 className="font-semibold text-blue-800 mb-3">
                            📁 Course Materials
                          </h3>
                          <div className="space-y-2">
                            {currentUnit.lecture.materials.map((file, i) => (
                              <a
                                key={i}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="flex items-center gap-2 p-2 bg-white rounded border"
                              >
                                <span>📄</span>
                                <span className="flex-1">{file.name}</span>
                                <span className="text-xs text-gray-400">
                                  {(file.size / 1024).toFixed(1)} KB
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                    {!unitProgress.lectureDone && (
                      <button
                        onClick={markLectureDone}
                        className="bg-[#5a6499] text-white px-6 py-3 rounded-lg hover:bg-[#4a5499] transition"
                      >
                        ✓ Mark Lecture Complete (+
                        {currentUnit.xpReward / 2 || 40} XP)
                      </button>
                    )}

                    {unitProgress.lectureDone &&
                      !unitProgress.quizPassed &&
                      !quizResult && (
                        <button
                          onClick={() => setShowQuiz(true)}
                          className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition mt-4"
                        >
                          📝 Take Quiz (+{currentUnit.xpReward / 2 || 40} XP)
                        </button>
                      )}

                    {unitProgress.quizPassed && (
                      <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                        <p className="font-semibold">✓ Quiz Passed!</p>
                        <p className="text-sm">
                          Score: {unitProgress.quizScore}%
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  // Quiz Section
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">
                        Quiz: {currentUnit.title}
                      </h2>
                      <button
                        onClick={() => setShowQuiz(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ← Back to Lecture
                      </button>
                    </div>

                    {!quizResult ? (
                      <>
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-blue-700">
                          ⏱️ You need 70% to pass. Take your time!
                        </div>

                        {currentUnit.quiz?.questions.map((q, i) => (
                          <div key={i} className="mb-6 border rounded-lg p-4">
                            <p className="font-medium mb-3">
                              {i + 1}. {q.question}
                            </p>
                            <div className="space-y-2">
                              {q.options.map((opt, o) => (
                                <label
                                  key={o}
                                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                  <input
                                    type="radio"
                                    name={`q${i}`}
                                    value={o}
                                    checked={answers[i] === o}
                                    onChange={() =>
                                      setAnswers({ ...answers, [i]: o })
                                    }
                                    className="w-4 h-4"
                                  />
                                  <span>{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={submitQuiz}
                          className="w-full bg-[#5a6499] text-white py-3 rounded-lg font-semibold hover:bg-[#4a5499] transition"
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
                          {quizResult.passed
                            ? "Congratulations!"
                            : "Try Again!"}
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <p className="text-lg font-semibold">
                            Your Score: {quizResult.score}%
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className={`h-2 rounded-full ${quizResult.passed ? "bg-green-500" : "bg-red-500"}`}
                              style={{ width: `${quizResult.score}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            You got {quizResult.correct} out of{" "}
                            {quizResult.total} correct
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setShowQuiz(false);
                            setQuizResult(null);
                            setAnswers({});
                          }}
                          className="bg-[#5a6499] text-white px-6 py-2 rounded-lg"
                        >
                          Back to Unit
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CourseDetails;
