import React from 'react';
import { useRoutes } from 'react-router-dom';
import routes from '@/routes/router';
import GlobalStyle from '@/styles/globalStyle';

const App: React.FC = () => {
  const element = useRoutes(routes);

  return (
    <>
      <GlobalStyle />
      {element}
    </>
  );
};

export default App;
