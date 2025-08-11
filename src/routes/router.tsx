import React from 'react';
import { RouteObject } from 'react-router-dom';

import LoginPage from '@/pages/auth/LoginPage';
import SigninPage from '@/pages/auth/SigninPage';
import { PublicRoute } from './publicRoute';

import DictionaryPage from '@/pages/dictionary/DictionaryPage';
import DictionaryDetailPage from '@/pages/dictionary/DictionaryDetailPage';

import FaqPage from '@/pages/faq/FaqPage';
import FaqDetailPage from '@/pages/faq/FaqDetailPage';

import DocsPage from '@/pages/docs/DocsPage';
import DocsDetailPage from '@/pages/docs/DocsDetailPage';

import FlowSettingPage from '@/pages/settings/FlowSettingPage';
import UserSettingPage from '@/pages/settings/UserSettingPage';
import DashBoardPage from '@/pages/dash-board/DashBoardPage';
import DepartmentSettingPage from '@/pages/settings/DepartmentSettingPage';
import AccessDeniedPage from '@/pages/error/AccessDeniedPage';

import { ProtectedRoute } from './protectedRoute';
import { AuthorizedRoute } from './authorizedRoute';

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/signin',
    element: (
      <PublicRoute>
        <SigninPage />
      </PublicRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashBoardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dictionary',
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DictionaryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ':dictionaryId',
        element: (
          <ProtectedRoute>
            <DictionaryDetailPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/faq',
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <FaqPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ':faqId',
        element: (
          <ProtectedRoute>
            <FaqDetailPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/docs',
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DocsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ':docId',
        element: (
          <ProtectedRoute>
            <DocsDetailPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/settings/flow',
    element: (
      <ProtectedRoute>
        <AuthorizedRoute requiredPermission="ROOT">
          <FlowSettingPage />
        </AuthorizedRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings/user',
    element: (
      <ProtectedRoute>
        <AuthorizedRoute requiredPermission="ROOT">
          <UserSettingPage />
        </AuthorizedRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings/department',
    element: (
      <ProtectedRoute>
        <AuthorizedRoute requiredPermission="ROOT">
          <DepartmentSettingPage />
        </AuthorizedRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: '/error/access-denied',
    element: <AccessDeniedPage />,
  },
];

export default routes;
