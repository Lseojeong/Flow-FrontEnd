import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminProfile } from '@/apis/auth/api';
import { useAuthStore } from '@/store/useAuthStore';

export const useAuthStatus = () => {
  const setLoggedIn = useAuthStore((state) => state.setIsLoggedIn);

  const query = useQuery({
    queryKey: ['adminProfile'],
    queryFn: getAdminProfile,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    if (query.isSuccess) {
      setLoggedIn(true);
    } else if (query.isError) {
      setLoggedIn(false);
    }
  }, [query.isSuccess, query.isError, setLoggedIn]);

  return query;
};
