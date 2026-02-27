import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function StudentOnboarding() {
  const {completeOnboarding, currentUser, trackActivity} = useAuth();

  if (currentUser?.onboarded) {
    return <Navigate to="/studentdashboard" replace/>;
  }
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [xp, setXp] = useState(0);

  const [formData, setFormData] = useState({
    matric: "",
    department: "",
    level: "",
    lessonStyle: "",
    motivation: [],
    studyTime:"",
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const toogleMotivation = (item) => {
    setFormData((prev) => ({
      ...prev,
      motivation: prev.motivation.includes(item)
      ? prev.motivation.filter((m) => m !== item)
      : [...prev.motivation, item],
    }));
  };

  const nextStep = () => {
    setXp((prev) => prev + 10);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev -1);

  const finish = () => {
    completeOnboarding(formData, xp);
    trackActivity("Completed Onboarding", 50, "onboarding");

    setTimeout(() => {
      navigate("/studentdashboard");
    }, 100);
  };

  const progressWidth = `${(step / totalSteps) * 100}%`;

  const canProceedStep2 =
  formData.matric &&
  formData.department &&
  formData.level;

  const canProceedStep3 =
  formData.lessonStyle && formData.studyTime;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-125 p-8 rounded-lg shadow transition-all duration-300">
        <div className="flex justify-between mb-4 text-sm font-semibold">
          <span>
            Step {step} of {totalSteps}
          </span>
          <span className="text-[#5a6499]">XP: {xp}</span>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-[#5a6499] h-2 rounded-full transition-all duration-300"
            style={{ width: progressWidth }}
          />
        </div>

        {/* STEP CONTENT */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Welcome {currentUser?.name.split(" ")[0]}👋{" "}
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Your learning journey just got smarter and more interesting
            </p>
            <p className="text-center text-gray-600 mb-6">
              Let’s set thing up - it would take less than 2 minutes{" "}
            </p>
            <button
              onClick={nextStep}
              className="w-full bg-[#5a6499] text-white py-3 rounded"
            >
              Get Started (+10 XP)
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Academic Information</h2>

            <div className="bg-gray-50 p-4 rounded mb-4 space-y-3">
              <p className="text-sm text-gray-500">
                Student: <strong>{currentUser?.name}</strong>
              </p>

              <input
                name="matric"
                type="text"
                placeholder="Matric Number"
                className="w-full border p-3 rounded mb-3"
                onChange={handleChange}
              />

              <input
                name="department"
                type="text"
                placeholder="Department"
                className="w-full border p-3 rounded mb-3"
                onChange={handleChange}
              />

              <select
                name="level"
                className="w-full border p-3 rounded mb-6"
                onChange={handleChange}
              >
                <option value="">Select Level</option>
                {[100, 200, 300, 400, 500, 600].map((lvl) => (
                  <option key={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-between">
              <button onClick={prevStep}>Back</button>
              <button
                disabled={!canProceedStep2}
                onClick={nextStep}
                className={`px-6 py-2 rounded ${
                  canProceedStep2
                    ? "bg-[#5a6499] text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                Next (+10 XP)
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Learning Preferences</h2>

            <p className="mb-2 font-medium">Lesson Style</p>
            <div className="space-y-2 mb-4">
              {["Short & Quick", "Detailed & Deep"].map((style) => (
                <div
                  key={style}
                  onClick={() =>
                    setFormData({ ...formData, lessonStyle: style })
                  }
                  className={`border p-2 rounded cursor-pointer ${
                    formData.lessonStyle === style
                      ? "border-[#5a6499] bg-[#f4f5ff]"
                      : ""
                  }`}
                >
                  {style}
                </div>
              ))}
            </div>

            <p className="mb-2 font-medium">Best Study Time</p>
            {["Morning", "Nignt", "Anytime"].map((time) => (
              <div
                key={time}
                onClick={() => setFormData({ ...formData, studyTime: time })}
                className={`border p-2 rounded cursor-pointer mb-2 ${
                  formData.studyTime === time
                    ? "border-[#5a6499] bg-[#f4f5ff]"
                    : ""
                }`}
              >
                {time}
              </div>
            ))}

            <div className="flex justify-between mt-6">
              <button onClick={prevStep}>Back</button>
              <button
                disabled={!canProceedStep3}
                onClick={nextStep}
                className="bg-[#5a6499] text-white px-6 py-2 rounded"
              >
                Next (+10 XP)
              </button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              🎉 Welcome {currentUser.name.split(" ")[0]}!
            </h2>

            <div className="text-center bg-yellow-100 p-4 rounded mb-4">
              🏅 Achievement Unlocked: Getting Started
            </div>

            <p className="text-center mb-4">
              You earned <strong>{xp} XP</strong> for completing onboarding!
            </p>

            <button
              className="w-full bg-[#5a6499] text-white py-3 rounded"
              onClick={finish}
            >
              Enter Dashboard 🚀
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentOnboarding