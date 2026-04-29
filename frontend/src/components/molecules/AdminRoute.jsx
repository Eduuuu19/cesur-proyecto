import React from 'react';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const token = localStorage.getItem('konta_token') || sessionStorage.getItem('konta_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));

    const isAdmin = decodedPayload.rol === 'ADMIN';
    
    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }

    return children;

  } catch (error) {
    console.error("Error al leer el token de seguridad:", error);
    return <Navigate to="/login" replace />;
  }
}