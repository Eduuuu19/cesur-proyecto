import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const tokenLocal = localStorage.getItem('konta_token');
  const tokenSession = sessionStorage.getItem('konta_token');

  const isAuthenticated = tokenLocal || tokenSession;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; 
  }

  return children;
}