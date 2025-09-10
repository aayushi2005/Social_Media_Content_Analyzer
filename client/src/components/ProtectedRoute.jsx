import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check login

  if (!token) {
    return <Navigate to="/" replace />; // Redirect to login if not logged in
  }

  return children;
};

export default ProtectedRoute;
