// src/routes/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn, isLoading, checkLoginStatus } = useAuthStore();

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/error/access-denied" replace />;
  }

  return children;
};
