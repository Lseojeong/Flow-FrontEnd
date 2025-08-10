import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface PublicRouteProps {
  children: React.ReactElement;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isLoggedIn, isLoading } = useAuthStore();

  if (isLoggedIn) {
    return <Navigate to="/dictionary" replace />;
  }

  if (isLoading && typeof window !== 'undefined' && window.location.pathname !== '/') {
    return null;
  }

  return children;
};
