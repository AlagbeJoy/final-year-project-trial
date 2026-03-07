import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import passwordResetService from "../services/passwordResetService";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: verify code, 3: new password
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    // Check if email exists
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = users.some((u) => u.email === email);

    if (!userExists) {
      setError("No account found with this email address");
      setLoading(false);
      return;
    }

    // Generate and send reset token
    const token = passwordResetService.generateToken(email);
    await passwordResetService.sendResetEmail(email, token);

    setMessage(`Password reset code sent to ${email}`);
    setStep(2);
    setLoading(false);

    // Start resend countdown
    setResendDisabled(true);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyToken = (e) => {
    e.preventDefault();
    setError("");

    if (!token || token.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    const verification = passwordResetService.verifyToken(email, token);

    if (verification.valid) {
      setStep(3);
      setMessage("");
    } else {
      setError(verification.message);
    }
  };

  const handleResendCode = async () => {
    if (resendDisabled) return;

    const newToken = passwordResetService.generateToken(email);
    await passwordResetService.sendResetEmail(email, newToken);

    setMessage("New code sent!");
    setResendDisabled(true);
    setCountdown(60);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError("");

    // Validate password
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = passwordResetService.resetPassword(email, newPassword);

    if (result.success) {
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-96 p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#5a6499]">Reset Password</h1>
          <p className="text-gray-600 text-sm mt-2">
            {step === 1 && "Enter your email to receive a reset code"}
            {step === 2 && "Enter the 6-digit code sent to your email"}
            {step === 3 && "Create a new password"}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 text-center ${
                s < step
                  ? "text-green-500"
                  : s === step
                    ? "text-[#5a6499]"
                    : "text-gray-300"
              }`}
            >
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 ${
                  s < step
                    ? "border-green-500 bg-green-500 text-white"
                    : s === step
                      ? "border-[#5a6499] text-[#5a6499]"
                      : "border-gray-300 text-gray-300"
                }`}
              >
                {s < step ? "✓" : s}
              </div>
              <div className="text-xs mt-1">
                {s === 1 && "Email"}
                {s === 2 && "Verify"}
                {s === 3 && "Reset"}
              </div>
            </div>
          ))}
        </div>

        {/* Step 1: Email Form */}
        {step === 1 && (
          <form onSubmit={handleRequestReset}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499] focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5a6499] text-white py-3 rounded-lg font-semibold hover:bg-[#4a5499] transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>

            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="text-sm text-[#5a6499] hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: Verification Code Form */}
        {step === 2 && (
          <form onSubmit={handleVerifyToken}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) =>
                  setToken(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full border p-3 rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-[#5a6499]"
                placeholder="••••••"
                maxLength="6"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#5a6499] text-white py-3 rounded-lg font-semibold hover:bg-[#4a5499] transition"
            >
              Verify Code
            </button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendDisabled}
                className="text-sm text-[#5a6499] hover:underline disabled:text-gray-400 disabled:no-underline"
              >
                {resendDisabled
                  ? `Resend code in ${countdown}s`
                  : "Resend Code"}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: New Password Form */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-[#5a6499]"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#5a6499] text-white py-3 rounded-lg font-semibold hover:bg-[#4a5499] transition"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
