import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not logged in -> Redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Not authorized -> Redirect to home/login
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If they are a student trying to access admin, send them back to student dashboard
    if (user.role === 'student') return <Navigate to="/student" replace />;
    
    // Default fallback
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
