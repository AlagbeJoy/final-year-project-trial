import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const { currentUser } = useAuth();

  console.log("🛡️ ProtectedRoute - Current User:", currentUser);

  // Not logged in
  if (!currentUser) {
    console.log("🛡️ No user, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Log the onboarding status for debugging
  console.log("🛡️ User role:", currentUser.role);
  console.log("🛡️ Onboarded status:", currentUser.onboarded);

  // Check onboarding - FIXED LOGIC
  if (currentUser.onboarded === false) {
    console.log(
      `🛡️ User not onboarded, redirecting to ${currentUser.role}onboarding`,
    );
    return <Navigate to={`/${currentUser.role}onboarding`} replace />;
  }

  // Role check
  if (allowedRole && currentUser.role !== allowedRole) {
    console.log("🛡️ Role mismatch, redirecting to redirect page");
    return <Navigate to="/redirect" replace />;
  }

  // All good - render the protected content
  console.log("🛡️ Access granted to protected route");
  return children ? children : <Outlet />;
}

export default ProtectedRoute;
