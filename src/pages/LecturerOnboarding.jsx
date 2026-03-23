import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LecturerOnboarding() {
  const { completeOnboarding, currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    department: "",
    office: "",
    phone: "",
    specialization: "",
  });

  const [step, setStep] = useState(1);

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);
  const finish = () => {
    completeOnboarding(formData, 0);
    navigate("/redirect");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-96 p-8 rounded-lg shadow">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#5a6499]">
            Complete Your Profile
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Welcome {currentUser?.name?.split(" ")[0]}!
          </p>
        </div>

        {step === 1 && (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Office Location
                </label>
                <input
                  type="text"
                  value={formData.office}
                  onChange={(e) =>
                    setFormData({ ...formData, office: e.target.value })
                  }
                  className="w-full border p-3 rounded-lg"
                  placeholder="e.g., Room 305, Science Building"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full border p-3 rounded-lg"
                  placeholder="e.g., +234 812 345 6789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  className="w-full border p-3 rounded-lg"
                  placeholder="e.g., Artificial Intelligence, Web Development"
                />
              </div>
            </div>
            <button
              onClick={nextStep}
              disabled={!formData.department}
              className={`mt-6 w-full py-3 rounded-lg font-semibold ${
                formData.department
                  ? "bg-[#5a6499] text-white hover:bg-[#4a5499]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600">Review your information:</p>
              <div className="mt-3 space-y-2 text-sm">
                <p>
                  <strong>Department:</strong>{" "}
                  {formData.department || "Not set"}
                </p>
                <p>
                  <strong>Office:</strong> {formData.office || "Not set"}
                </p>
                <p>
                  <strong>Phone:</strong> {formData.phone || "Not set"}
                </p>
                <p>
                  <strong>Specialization:</strong>{" "}
                  {formData.specialization || "Not set"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={prevStep}
                className="flex-1 border py-3 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={finish}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
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
