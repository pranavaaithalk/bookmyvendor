import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, userType }) => {
  // Mock authentication check - in a real app, this would check actual auth state
  const isAuthenticated = true;
  
  if (!isAuthenticated) {
    // Redirect to auth page with the required user type
    return <Navigate to={`/auth?type=${userType}`} replace />;
  }
  
  return children;
};

export default ProtectedRoute;
