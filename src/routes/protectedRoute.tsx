import { ReactNode } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Loading } from '@/components/common/loading/Loading';
import { colors } from '@/styles/index';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn, isLoading, hasChecked } = useAuthStore();

  if (isLoading || !hasChecked) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: colors.background,
        }}
      >
        <Loading size={24} color={colors.Normal} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
};
