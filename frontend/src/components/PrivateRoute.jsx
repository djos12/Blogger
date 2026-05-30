// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('authToken'); // Check if user is authenticated

  return token ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
