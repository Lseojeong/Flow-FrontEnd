import React from 'react';
import { RouteObject } from 'react-router-dom';

import LoginPage from '@/pages/auth/LoginPage';
import SigninPage from '@/pages/auth/SigninPage';

import DictionaryPage from '@/pages/dictionary/DictionaryPage';
import DictionaryDetailPage from '@/pages/dictionary/DictionaryDetailPage';

import FaqPage from '@/pages/faq/FaqPage';
import FaqDetailPage from '@/pages/faq/FaqDetailPage';

import DocsPage from '@/pages/docs/DocsPage';
import DocsDetailPage from '@/pages/docs/DocsDetailPage';
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
    children: [
      {
        index: true,
        element: <DictionaryPage />,
      },
      {
        path: ':dictionaryId',
        element: <DictionaryDetailPage />,
      },
    ],
  },
  {
    path: '/faq',
    children: [
      {
        index: true,
        element: <FaqPage />,
      },
      {
        path: ':categoryId',
        element: <FaqDetailPage />,
      },
    ],
  },
  {
    path: '/docs',
    children: [
      {
        index: true,
        element: <DocsPage />,
      },
      {
        path: ':docId',
        element: <DocsDetailPage />,
      },
    ],
  },
  {
    path: '/settings/flow',
    element: <FlowSettingPage />,
  },
];

export default routes;
