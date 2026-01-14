import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, userType }) => {
  
  var isAuthenticated = false;
  if (userType === 'client') {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      isAuthenticated = true;
    }
  } else if (userType === 'vendor') {
    const vendorId = sessionStorage.getItem('vendorId');
    if (vendorId) {
      isAuthenticated = true;
    }
  }
  
  if (!isAuthenticated) {
    return <Navigate to={`/auth?type=${userType}`} replace />;
  }
  
  return children;
};

export default ProtectedRoute;
