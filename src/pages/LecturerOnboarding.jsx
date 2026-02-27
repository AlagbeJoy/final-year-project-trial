import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';

function LecturerOnboarding() {
  const {completeOnboarding, currentUser} = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [xp, setXp] = useState(0);

  const [formData, setFormData] = useState({
    department: "",
    office: "",
    courses: [""],
  });

  const addCourse = () => {
    setFormData((prev) => ({
      ...prev,
      courses: [...prev.courses, ""],
    }));
  };

  const handleCourseChange = (index, value) => {
    const updated = [...formData.courses];
    updated[index] = value;
    setFormData({...formData, courses: updated});
  };

  const nextStep = () => {
    setXp((prev) => prev + 10);
    setStep((prev) => prev + 1)
  };

  const prevStep = () => setStep((prev) => prev - 1);


  const finish = () => {
    completeOnboarding(formData);
    navigate("/redirect");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-125 p-8 rounded-lg shadow">
        <div className="flex justify-between mb-4 text-sm font-semibold">
          <span>Step {step} of 4</span>
          <span className="text-[#5a6499]">XP: {xp}</span>
        </div>

        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Welcome {currentUser?.name} 👨‍🏫
            </h2>
            <p className="text-center mb-6">
              Let's configure your teaching profile
            </p>

            <button
              onClick={nextStep}
              className="w-full bg-[#5a6499] text-white py-3 rounded"
            >
              Start Setup (+10 XP)
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Basic Info</h2>

            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-3 rounded mb-3"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Department"
              className="w-full border p-3 rounded mb-3"
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Office Location (Optional)"
              className="w-full border p-3 rounded mb-3"
              onChange={(e) =>
                setFormData({ ...formData, office: e.target.value })
              }
            />

            <div className="flex justify-between">
              <button onClick={prevStep}>Back</button>
              <button
                onClick={nextStep}
                className="bg-[#5a6499] text-white px-6 py-2 rounded"
              >
                Next (+10 XP)
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Courses You Teach</h2>

            {formData.courses.map((course, index) => (
              <input
                key={index}
                value={course}
                type="text"
                placeholder={`Course ${index + 1}`}
                className="w-full border p-3 rounded mb-3"
                onChange={(e) => handleCourseChange(index, e.target.value)}
              />
            ))}

            <button onClick={addCourse} className="text-[#5a6499] mb-4">
              + Add Another Course
            </button>

            <div className="flex justify-between">
              <button onClick={prevStep}>Back</button>
              <button
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
            <h2 className="text-xl font-semibold mb-4 text-center">
              🎉 Setup Complete
            </h2>

            <div className="text-center bg-yellow-100 p-4 rounded mb-4">
              🏅 Achievement Unlocked: Instructor Ready
            </div>

            <p className="text-center mb-4">
              You earned <strong>{xp} XP</strong>!
            </p>

            <button
              onClick={finish}
              className="bg-[#5a6499] text-white py-3 w-full rounded"
            >
              Enter Dashboard 🚀
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default LecturerOnboarding