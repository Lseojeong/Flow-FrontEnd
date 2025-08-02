import React from 'react';
import { useRoutes } from 'react-router-dom';
import routes from '@/routes/router';
import GlobalStyle from '@/styles/globalStyle';
import PlaygroundRoutes from '@/routes/playgroundRoutes';
import { ToastContainer } from '@/components/common/toast-popup/ToastContainer';

const App: React.FC = () => {
  const element = useRoutes(routes);

  return (
    <>
      <GlobalStyle />
      <ToastContainer />
      {element}
      {/* 개발 환경에서만 플레이그라운드 라우트 추가 */}
      {import.meta.env.DEV && <PlaygroundRoutes />}
    </>
  );
};

export default App;
