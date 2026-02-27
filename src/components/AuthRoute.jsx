import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom';

function AuthRoute({ children }) {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/redirect" replace/>;   
     }

  return children;
}

export default AuthRoute;