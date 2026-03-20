import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LecturerOnboarding() {
  const { completeOnboarding, currentUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    department: "",
    office: "",
    bio: "",
    expertise: [],
  });

  const [newExpertise, setNewExpertise] = useState("");

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const addExpertise = () => {
    if (
      newExpertise.trim() &&
      !formData.expertise.includes(newExpertise.trim())
    ) {
      setFormData({
        ...formData,
        expertise: [...formData.expertise, newExpertise.trim()],
      });
      setNewExpertise("");
    }
  };

  const removeExpertise = (item) => {
    setFormData({
      ...formData,
      expertise: formData.expertise.filter((e) => e !== item),
    });
  };

  const finish = () => {
    completeOnboarding(formData, 0);
    navigate("/redirect");
  };

  const progressWidth = `${(step / 3) * 100}%`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-125 p-8 rounded-lg shadow">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm">
            <span>Step {step} of 3</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-[#5a6499] h-2 rounded-full transition-all duration-300"
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Welcome {currentUser?.name?.split(" ")[0]}! 👨‍🏫
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Let's set up your lecturer profile
            </p>

            <button
              onClick={nextStep}
              className="w-full bg-[#5a6499] text-white py-3 rounded-lg hover:bg-[#4a5499] transition"
            >
              Get Started
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-4">Professional Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Office Location
                </label>
                <input
                  type="text"
                  value={formData.office}
                  onChange={(e) =>
                    setFormData({ ...formData, office: e.target.value })
                  }
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                  placeholder="e.g., Room 305, Science Building"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows="3"
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                  placeholder="Tell your students a bit about yourself..."
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={prevStep} className="px-6 py-2 rounded border">
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={!formData.department}
                className={`px-6 py-2 rounded ${
                  formData.department
                    ? "bg-[#5a6499] text-white hover:bg-[#4a5499]"
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
            <h2 className="text-xl font-bold mb-4">Areas of Expertise</h2>

            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Add your areas of expertise (optional)
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addExpertise()}
                  className="flex-1 border p-2 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                  placeholder="e.g., Machine Learning"
                />
                <button
                  onClick={addExpertise}
                  className="bg-[#5a6499] text-white px-4 py-2 rounded-lg hover:bg-[#4a5499]"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[100px] p-3 bg-gray-50 rounded-lg">
                {formData.expertise.map((item, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {item}
                    <button
                      onClick={() => removeExpertise(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {formData.expertise.length === 0 && (
                  <p className="text-gray-400 text-sm">
                    No expertise added yet
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={prevStep} className="px-6 py-2 rounded border">
                Back
              </button>
              <button
                onClick={finish}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Complete Setup
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LecturerOnboarding;
