import React, { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from '@/routes/router';
import GlobalStyle from '@/styles/globalStyle';
import PlaygroundRoutes from '@/routes/playgroundRoutes';
import { ToastContainer } from '@/components/common/toast-popup/ToastContainer';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/reactQuery';
import { useAuthStore } from '@/store/useAuthStore';

const App: React.FC = () => {
  const element = useRoutes(routes);
  const checkLoginStatus = useAuthStore((state) => state.checkLoginStatus);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <ToastContainer />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={true} />}
        {element}
        {/* 개발 환경에서만 플레이그라운드 라우트 추가 */}
        {import.meta.env.DEV && <PlaygroundRoutes />}
      </QueryClientProvider>
    </>
  );
};

export default App;
