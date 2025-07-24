import React from 'react';
import { useRoutes, Routes, Route } from 'react-router-dom';
import routes from '@/routes/router';
import GlobalStyle from '@/styles/globalStyle';
import { SideBarPlayground } from '@/playground/SideBarPlayground';
import { DateFilterPlayground } from '@/playground/DateFilterPlayground';

const App: React.FC = () => {
  const element = useRoutes(routes);

  return (
    <>
      <GlobalStyle />
      {element}

      {/* 개발 환경에서만 플레이그라운드 라우트 추가 */}
      {import.meta.env.DEV && (
        <Routes>
          <Route path="/playground/sidebar" element={<SideBarPlayground />} />
          <Route path="/playground/date-filter" element={<DateFilterPlayground />} />
        </Routes>
      )}
    </>
  );
};

export default App;
