// In RoleRedirect.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRedirect() {
  const { currentUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);
    const [localUser, setLocalUser] = useState(null);


  useEffect(() => {
    console.log("RoleRedirect - currentUser:", currentUser);

    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    setLocalUser(storedUser);
    console.log("Stored user from localStorage:", storedUser);

    if (!currentUser && !storedUser) {
      console.log("No user, redirecting to login");
      navigate("/login");
      return;
    }

    if (
      storedUser?.onboarded === true && (!currentUser || !currentUser.onboarded)
    ) {
      console.log("Refreshing context to get onboarded=true");
        if (typeof refreshUser === 'function') {
      refreshUser();
        }

      // Wait for context to update
      const timer = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
      }, 300);

      return () => clearTimeout(timer);
    }

    // Use either context user or stored user
    const user = currentUser || storedUser;

    if (!user) return;

    console.log("User role:", user.role);
    console.log("Onboarded:", user.onboarded);

    // If onboarded is true in localStorage but not in context, force navigation
    if (storedUser?.onboarded === true && !user.onboarded) {
      console.log(
        "Found onboarded=true in localStorage! Forcing navigation...",
      );
      if (user.role === "student") {
        navigate("/studentdashboard");
      } else if (user.role === "lecturer") {
        navigate("/lecturerdashboard");
      }
      return;
    }

    // If onboarded is still false but we expect it to be true, retry
    if (user.role === "student" && !user.onboarded && retryCount < 3) {
      console.log(`Onboarded false, retry ${retryCount + 1}/3`);

      const timer = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
      }, 500);

      return () => clearTimeout(timer);
    }

    // Normal redirect logic
    const timer = setTimeout(() => {
      if (user.role === "student") {
        if (user.onboarded) {
          console.log("Redirecting to student dashboard");
          navigate("/studentdashboard");
        } else {
          console.log("Redirecting to student onboarding");
          navigate("/studentonboarding");
        }
      } else if (user.role === "lecturer") {
        if (user.onboarded) {
          console.log("Redirecting to lecturer dashboard");
          navigate("/lecturerdashboard");
        } else {
          console.log("Redirecting to lecturer onboarding");
          navigate("/lectureronboarding");
        }
      } else {
        console.log("Unknown role, redirecting to home");
        navigate("/");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentUser, navigate, retryCount, refreshUser]);

  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#5a6499] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Redirecting...</h2>
        <p className="text-gray-600">
          {localUser?.onboarded
            ? "Loading your dashboard..."
            : `Please wait${".".repeat((retryCount % 3) + 1)}`}
        </p>
      </div>
    </div>
  );
}

export default RoleRedirect;