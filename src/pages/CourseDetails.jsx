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
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      console.log("🔍 Looking for course ID:", courseId);

      const response = await api.getCourse(courseId);
      console.log("✅ Course found:", response);

      setCourse(response);

      // Load saved progress from localStorage
      const saved = JSON.parse(
        localStorage.getItem(`course_${courseId}_progress`) || "{}",
      );
      setProgress(saved);
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const markUnitComplete = () => {
    const unit = currentUnit;

    // Update progress
    const newProgress = {
      ...progress,
      [activeUnit]: {
        ...progress[activeUnit],
        completed: true,
        completedAt: new Date().toISOString(),
      },
    };
    setProgress(newProgress);
    localStorage.setItem(
      `course_${courseId}_progress`,
      JSON.stringify(newProgress),
    );

    // Award XP (half of unit XP)
    const xp = unit?.xpReward / 2 || 40;

    // Update user XP
    const updatedUser = {
      ...currentUser,
      xp: (currentUser.xp || 0) + xp,
      activities: [
        {
          type: "unit",
          message: `Completed unit: ${unit?.title} in ${course?.title}`,
          xp: xp,
          date: new Date().toISOString(),
        },
        ...(currentUser.activities || []),
      ],
    };

    // Update user in context and localStorage
    updateUser(updatedUser);

    // Update user in users array
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u) =>
      u.email === currentUser.email ? updatedUser : u,
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert(`✅ Unit completed! +${xp} XP`);
  };

  const submitQuiz = () => {
    const unit = currentUnit;
    if (!unit || !unit.quiz) return;

    let correct = 0;
    unit.quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });

    const score = Math.round((correct / unit.quiz.questions.length) * 100);
    const passed = score >= 70;

    if (passed) {
      // Update progress with quiz passed
      const newProgress = {
        ...progress,
        [activeUnit]: {
          ...progress[activeUnit],
          completed: true,
          quizPassed: true,
          quizScore: score,
          quizCompletedAt: new Date().toISOString(),
        },
      };
      setProgress(newProgress);
      localStorage.setItem(
        `course_${courseId}_progress`,
        JSON.stringify(newProgress),
      );

      // Award XP (half of unit XP)
      const xp = unit.xpReward / 2 || 40;

      // Update user XP and activity
      const updatedUser = {
        ...currentUser,
        xp: (currentUser.xp || 0) + xp,
        activities: [
          {
            type: "quiz",
            message: `Passed quiz: ${unit?.title} with ${score}%`,
            xp: xp,
            date: new Date().toISOString(),
          },
          ...(currentUser.activities || []),
        ],
      };

      updateUser(updatedUser);

      // Update user in users array
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = users.map((u) =>
        u.email === currentUser.email ? updatedUser : u,
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }

    setQuizResult({
      score,
      passed,
      correct,
      total: unit.quiz.questions.length,
    });
  };

  // Check if a unit is locked (previous unit not completed)
  const isUnitLocked = (index) => {
    if (index === 0) return false; // First unit is always unlocked
    return !progress[index - 1]?.quizPassed; // Lock if previous unit quiz not passed
  };

  // Check if all units are completed
  const isCourseCompleted = () => {
    const units = course?.units || course?.modules || [];
    if (units.length === 0) return false;

    // Check if last unit's quiz is passed
    return progress[units.length - 1]?.quizPassed === true;
  };

  // Get units from either units or modules array
  const units = course?.units || course?.modules || [];
  const currentUnit = units[activeUnit];
  const unitProgress = progress[activeUnit] || {};
  const unitLocked = isUnitLocked(activeUnit);
  const courseCompleted = isCourseCompleted();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <StudentSidebar />
        <main className="flex-1 p-8">
          <div className="text-center">Loading course...</div>
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

  // If course is completed, show completion message
  if (courseCompleted) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <StudentSidebar />
        <main className="flex-1 p-8">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🎓</div>
            <h1 className="text-3xl font-bold mb-4">Congratulations!</h1>
            <p className="text-xl text-gray-600 mb-6">
              You have successfully completed {course.title}
            </p>
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
              <p className="font-semibold">Course Completed</p>
              <p>You've mastered all units and passed all quizzes</p>
            </div>
            <button
              onClick={() => navigate("/studentdashboard")}
              className="bg-[#5a6499] text-white px-6 py-3 rounded-lg hover:bg-[#4a5499]"
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
        <div className="bg-gradient-to-r from-[#5a6499] to-[#7c83b3] rounded-lg p-6 mb-6 text-white">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-sm opacity-90">{course.description}</p>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Course Progress</span>
              <span>
                {Object.values(progress).filter((p) => p.quizPassed).length} /{" "}
                {units.length} units
              </span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(Object.values(progress).filter((p) => p.quizPassed).length / units.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Unit Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg p-4">
              <h2 className="font-bold mb-3">Course Units</h2>
              {units.map((unit, i) => {
                const locked = isUnitLocked(i);
                const unitProg = progress[i] || {};

                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (!locked) {
                        setActiveUnit(i);
                        setShowQuiz(false);
                        setQuizResult(null);
                        setAnswers({});
                      }
                    }}
                    disabled={locked}
                    className={`w-full text-left p-3 rounded mb-2 transition ${
                      activeUnit === i
                        ? "bg-[#5a6499] text-white"
                        : locked
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Unit {i + 1}</span>
                      <div className="flex gap-1">
                        {unitProg.completed && (
                          <span className="text-green-500">📖</span>
                        )}
                        {unitProg.quizPassed && (
                          <span className="text-green-500">✓</span>
                        )}
                        {locked && <span className="text-gray-400">🔒</span>}
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
              <div className="bg-white p-8 text-center rounded-lg">
                No units in this course
              </div>
            ) : unitLocked ? (
              <div className="bg-white p-12 text-center rounded-lg">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-2">Unit Locked</h3>
                <p className="text-gray-500">
                  Complete the previous unit and pass its quiz to unlock this
                  content
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6">
                {!showQuiz ? (
                  <>
                    <h2 className="text-xl font-bold mb-4">
                      {currentUnit.title}
                    </h2>

                    {/* Video */}
                    {currentUnit.lecture?.videoUrl && (
                      <div className="mb-4">
                        <iframe
                          src={currentUnit.lecture.videoUrl}
                          className="w-full aspect-video rounded"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}

                    {/* Lecture Content */}
                    {currentUnit.lecture?.content && (
                      <div className="mb-4 whitespace-pre-wrap">
                        {currentUnit.lecture.content}
                      </div>
                    )}

                    {/* Materials/Downloads */}
                    {currentUnit.lecture?.materials &&
                      currentUnit.lecture.materials.length > 0 && (
                        <div className="mb-4 p-4 bg-gray-50 rounded">
                          <h3 className="font-semibold mb-2">📁 Materials</h3>
                          {currentUnit.lecture.materials.map((file, i) => (
                            <a
                              key={i}
                              href={file.url}
                              download={file.name}
                              className="block text-[#5a6499] hover:underline mb-1"
                            >
                              📄 {file.name}
                            </a>
                          ))}
                        </div>
                      )}

                    {/* Unit Complete Button */}
                    {!unitProgress.completed && (
                      <button
                        onClick={markUnitComplete}
                        className="bg-[#5a6499] text-white px-4 py-2 rounded"
                      >
                        Mark Unit Complete (+{currentUnit.xpReward / 2 || 40}{" "}
                        XP)
                      </button>
                    )}

                    {/* Quiz Button (shown after unit is completed and quiz not taken) */}
                    {unitProgress.completed &&
                      !unitProgress.quizPassed &&
                      !quizResult && (
                        <button
                          onClick={() => setShowQuiz(true)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded mt-4"
                        >
                          Take Quiz (+{currentUnit.xpReward / 2 || 40} XP)
                        </button>
                      )}

                    {/* Show message if quiz already passed */}
                    {unitProgress.quizPassed && (
                      <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
                        <p className="font-semibold">
                          ✓ Quiz Passed - Unit Complete
                        </p>
                        <p className="text-sm">
                          Score: {unitProgress.quizScore}%
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  /* Quiz Section */
                  <div>
                    <h2 className="text-xl font-bold mb-4">
                      Quiz: {currentUnit.title}
                    </h2>

                    {!quizResult ? (
                      <>
                        {currentUnit.quiz?.questions.map((q, i) => (
                          <div key={i} className="mb-4">
                            <p className="font-medium mb-2">
                              {i + 1}. {q.question}
                            </p>
                            {q.options.map((opt, o) => (
                              <label key={o} className="block mb-1">
                                <input
                                  type="radio"
                                  name={`q${i}`}
                                  value={o}
                                  checked={answers[i] === o}
                                  onChange={() =>
                                    setAnswers({ ...answers, [i]: o })
                                  }
                                  className="mr-2"
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        ))}
                        <button
                          onClick={submitQuiz}
                          className="bg-[#5a6499] text-white px-4 py-2 rounded"
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
                        <p className="text-gray-600 mb-4">
                          You scored {quizResult.score}% ({quizResult.correct}/
                          {quizResult.total} correct)
                        </p>
                        {quizResult.passed && (
                          <p className="text-green-600 font-semibold mb-4">
                            +{currentUnit.xpReward / 2 || 40} XP earned!
                          </p>
                        )}
                        <button
                          onClick={() => {
                            setShowQuiz(false);
                            setQuizResult(null);
                            setAnswers({});
                          }}
                          className="bg-[#5a6499] text-white px-6 py-2 rounded-lg hover:bg-[#4a5499] transition"
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
