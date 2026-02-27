import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom';

function OnboardingRoute({children, role}) {
    const {currentUser} = useAuth();

    if (!currentUser) return <Navigate to="/login" replace/>;

    if (currentUser.onboarded) {
        return <Navigate to={`/${currentUser.role}dashboard`} replace/>;
    }

    if (role && currentUser.role !== role) {
        return <Navigate to="/redirect" replace/>;
    }
  return children ? children : <Outlet />;
}

export default OnboardingRoute