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
    const userId = sessionStorage.getItem("userId");
    const vendorId = sessionStorage.getItem('vendorId');
    if (vendorId) {
      isAuthenticated = true;
    }else if (vendorId===-1 && userId) {
      return <Navigate to={"/vendor-onboarding"} replace />;
    }
  }
  
  if (!isAuthenticated) {
    return <Navigate to={`/auth?type=${userType}`} replace />;
  }
  
  return children;
};

export default ProtectedRoute;
