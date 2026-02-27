// In RoleRedirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRedirect() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Add a small delay to ensure everything is loaded
    const timer = setTimeout(() => {
      if (currentUser.role === "student") {
        navigate("/studentdashboard");
      } else if (currentUser.role === "lecturer") {
        navigate("/lecturerdashboard");
      } else {
        navigate("/");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentUser, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#5a6499] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">
          Preparing Your Dashboard...
        </h2>
        <p className="text-gray-600">Just a moment</p>
      </div>
    </div>
  );
}

export default RoleRedirect;
