import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({children, allowedRole}) {
    const {currentUser} = useAuth();

    if (!currentUser) return <Navigate to="/login" />;

    if (!currentUser.onboarded) {return <Navigate to= {`/${currentUser.role}onboarding`} replace />;}

    
    if(allowedRole && currentUser.role !== allowedRole) {
        return <Navigate to="/redirect" replace />;
    }

    return children;
    
  
}

export default ProtectedRoute