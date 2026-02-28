import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';

function LecturerOnboarding() {
  const {completeOnboarding, currentUser} = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
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

  const removeCourse = (index) => {
    if (formData.courses.length > 1) {
      const updated = formData.courses.filter((_, i) => i !== index);
      setFormData({ ...formData, courses: updated });
    }
  };

  const handleCourseChange = (index, value) => {
    const updated = [...formData.courses];
    updated[index] = value;
    setFormData({...formData, courses: updated});
  };

  const nextStep = () => {
    setStep((prev) => prev + 1)
  };

  const prevStep = () => setStep((prev) => prev - 1);


  const finish = () => {
    completeOnboarding(formData, 0);
    navigate("/redirect");
  };

    const canProceedStep2 = formData.department;
    const canProceedStep3 = formData.courses.some(
      (course) => course.trim() !== "",
    );

    const progressWidth = `${(step / 4) * 100}%`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-125 p-8 rounded-lg shadow">
        <div className="flex justify-between mb-4 text-sm font-semibold">
          <span>Step {step} of 4</span>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-[#5a6499] h-2 rounded-full transition-all duration-300"
            style={{ width: progressWidth }}
          />
        </div>

        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Welcome {currentUser?.name?.split(" ")[0]}! 👨‍🏫
            </h2>
            <p className="text-center mb-6">
              Let's set up your teaching profile
            </p>
            <p className="text-center mb-6 text-sm text-gray-500">
              This helps us personalize your lecturer experience
            </p>

            <button
              onClick={nextStep}
              className="w-full bg-[#5a6499] text-white py-3 rounded"
            >
              Start Setup
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Department Information
            </h2>

            <div className="bg-gray-50 p-4 rounded mb-4">
              <p className="text-sm text-gray-500 mb-3">
                Lecturer: <strong>{currentUser?.name}</strong>
              </p>

              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                className="w-full border p-3 rounded mb-3"
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Office Location (Optional)"
                value={formData.office}
                className="w-full border p-3 rounded mb-3"
                onChange={(e) =>
                  setFormData({ ...formData, office: e.target.value })
                }
              />
            </div>

            <div className="flex justify-between">
              <button onClick={prevStep} className="px-6 py-2 rounded border">
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={!canProceedStep2}
                className={`px-6 py-2 rounded ${
                  canProceedStep2
                    ? "bg-[#5a6499] text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Courses You Teach</h2>

            <div className="bg-gray-50 p-4 rounded mb-4">
              {formData.courses.map((course, index) => (
                <div key={index} className="flex items-center gap-2 mb-3">
                  <input
                    key={index}
                    value={course}
                    type="text"
                    placeholder={`Course ${index + 1}`}
                    className="flex-1 border p-3 rounded"
                    onChange={(e) => handleCourseChange(index, e.target.value)}
                  />
                  {formData.courses.length > 1 && (
                    <button
                      onClick={() => removeCourse(index)}
                      className="text-red-500 hover:text-red-700 px-3 py-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={addCourse}
                className="text-[#5a6499] hover:underline text-sm mt-2"
              >
                + Add Another Course
              </button>
            </div>

            <div className="flex justify-between">
              <button onClick={prevStep} className="px-6 py-2 rounded border">
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={!canProceedStep3}
                className={`px-6 py-2 rounded ${
                  canProceedStep3
                    ? "bg-[#5a6499] text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next
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

            <p className="text-center mb-6 text-gray-600">
              Your teaching profile has been created successfully.
            </p>

            <div className="bg-gray-50 p-4 rounded mb-6">
              <h3 className="font-semibold mb-2">Profile Summary:</h3>
              <p>
                <span className="text-gray-600">Department:</span>{" "}
                {formData.department}
              </p>
              {formData.office && (
                <p>
                  <span className="text-gray-600">Office:</span>{" "}
                  {formData.office}
                </p>
              )}
              <p>
                <span className="text-gray-600">Courses:</span>{" "}
                {formData.courses.filter((c) => c).length}
              </p>
            </div>

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