// ProtectedRoute.jsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/Authservice';  // Assuming isAuthenticated function is in your Authservice

const ProtectedRoute = ({ element, ...rest }) => {
  // Check if the user is authenticated (e.g., if a token exists)
  const isUserAuthenticated = isAuthenticated();

  return (
    <Route
      {...rest}
      element={
        isUserAuthenticated ? element : <Navigate to="/login" replace />
      }
    />
  );
};

export default ProtectedRoute;
