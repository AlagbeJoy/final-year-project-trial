import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const sendCode = () => {
    if (!email) return alert("Enter email");

    console.log("Send code to:", email);

    setStep(2);
  };

  const verifyCode = () => {
    if (!code) return alert("Enter code");

    console.log("verify code", code);

    setStep(3);
  };

  const resetPassword = () => {
    if (!password) return alert("Enter new password");

    console.log("reset password:", password);

    alert("Password reset successful");
    navigate("/login");
  };

//   const submit = (e) => {
//     e.preventDefault();
//     alert("Reset link sent to " + email);
//   };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-100 space-y-4">
        <h2 className="text-2xl font-bold text-center text-[#5a6499]">
          Forgot Password
        </h2>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border p-3 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={sendCode}
              className="w-full bg-[#5a6499] text-white py-3 rounded"
            >
              Send Code
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter code"
              className="w-full border p-3 rounded"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              onClick={verifyCode}
              className="w-full bg-[#5a6499] text-white py-3 rounded"
            >
              Verify Code
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full border p-3 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="confirmPassword"
              placeholder="Confirm your password"
              className="w-full border p-3 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={resetPassword}
              className="w-full bg-[#5a6499] text-white py-3 rounded"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
