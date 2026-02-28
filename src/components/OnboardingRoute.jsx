import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom';

function OnboardingRoute({children, role}) {
    const {currentUser} = useAuth();

     console.log("OnboardingRoute - currentUser:", currentUser);
     console.log("OnboardingRoute - role:", role);

    if (!currentUser) return <Navigate to="/login" replace/>;

    if (currentUser.onboarded) {
        console.log("User already onboarded, redirecting to dashboard");
        return <Navigate to={`/${currentUser.role}dashboard`} replace/>;
    }

    if (role && currentUser.role !== role) {
      console.log("Role mismatch, redirecting to redirect page");
        return <Navigate to="/redirect" replace/>;
    }

      console.log("Showing onboarding");
  return children ? children : <Outlet />;
}

export default OnboardingRoute