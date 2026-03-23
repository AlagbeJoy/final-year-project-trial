import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.requestPasswordReset(email);
      setMessage("Reset code sent to your email!");
      setStep(2);
      // Start countdown for resend
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
    } catch (err) {
      setError(err.message || "Email not found");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.verifyResetCode(email, code);
      setStep(3);
    } catch (err) {
      setError(err.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.resetPassword(email, code, newPassword);
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendDisabled) return;
    try {
      await api.requestPasswordReset(email);
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
    } catch (err) {
      setError("Failed to resend code");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-96 p-8 rounded-lg shadow">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#5a6499]">Reset Password</h1>
          <p className="text-gray-500 text-sm mt-1">
            {step === 1 && "Enter your email to receive a reset code"}
            {step === 2 && "Enter the 6-digit code sent to your email"}
            {step === 3 && "Create a new password"}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleRequestReset}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-[#5a6499]"
              required
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            {message && (
              <p className="text-green-500 text-sm mb-3">{message}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5a6499] text-white py-3 rounded-lg font-semibold hover:bg-[#4a5499] disabled:opacity-50"
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

        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <input
              type="text"
              placeholder="6-digit code"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="w-full border p-3 rounded-lg mb-4 text-center text-2xl tracking-widest focus:ring-2 focus:ring-[#5a6499]"
              required
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5a6499] text-white py-3 rounded-lg font-semibold hover:bg-[#4a5499]"
            >
              Verify Code
            </button>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendDisabled}
                className="text-sm text-[#5a6499] hover:underline disabled:text-gray-400"
              >
                {resendDisabled ? `Resend in ${countdown}s` : "Resend Code"}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border p-3 rounded-lg mb-3 focus:ring-2 focus:ring-[#5a6499]"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-[#5a6499]"
              required
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            {message && (
              <p className="text-green-500 text-sm mb-3">{message}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5a6499] text-white py-3 rounded-lg font-semibold hover:bg-[#4a5499]"
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
