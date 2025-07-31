import { RouteObject } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import SigninPage from '@/pages/auth/SigninPage';

import DictionaryPage from '@/pages/dictionary/DictionaryPage';
import FaqPage from '@/pages/faq/FaqPage';
import DocsPage from '@/pages/docs/DocsPage';
import FlowSettingPage from '@/pages/settings/FlowSettingPage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/signin',
    element: <SigninPage />,
  },
  {
    path: '/dictionary',
    element: <DictionaryPage />,
  },
  {
    path: '/faq',
    element: <FaqPage />,
  },
  {
    path: '/docs',
    element: <DocsPage />,
  },
  {
    path: '/settings/flow',
    element: <FlowSettingPage />,
  },
];

export default routes;
