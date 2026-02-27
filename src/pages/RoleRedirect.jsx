import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom';

function RoleRedirect() {
    const {currentUser} = useAuth();

    if (!currentUser) return <Navigate to="/login" replace/>;

    if (!currentUser.onboarded) {
        return currentUser.role === "student"
        ? <Navigate to= "/studentonboarding" replace />
        : <Navigate to= "/lectureronboarding" replace/>;
    }

    return currentUser.role === "student"
    ? <Navigate to= "/studentdashboard" replace />
    : <Navigate to= "/lecturerdashboard" replace />;
}

export default RoleRedirect;