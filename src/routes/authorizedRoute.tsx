import { ReactNode } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import AccessDeniedPage from '@/pages/error/AccessDeniedPage';

interface AuthorizedRouteProps {
  children: ReactNode;
  requiredPermission?: 'ROOT' | 'GENERAL';
}

export const AuthorizedRoute = ({
  children,
  requiredPermission = 'GENERAL',
}: AuthorizedRouteProps) => {
  const { profile } = useAuthStore();

  if (requiredPermission === 'ROOT' && profile?.permission !== 'ROOT') {
    return <AccessDeniedPage />;
  }

  return <>{children}</>;
};
