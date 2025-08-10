import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface PublicRouteProps {
  children: React.ReactElement;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isLoggedIn, isLoading, checkLoginStatus } = useAuthStore();

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  if (isLoading) return null;

  if (isLoggedIn) {
    return <Navigate to="/dictionary" replace />;
  }

  return children;
};
