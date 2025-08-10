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
    // 즉시 리다이렉트
    if (typeof window !== 'undefined') {
      window.location.replace('/');
    }
    return null;
  }

  return <>{children}</>;
};
