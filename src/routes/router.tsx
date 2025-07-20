// src/routes.tsx
import React from 'react';
import { RouteObject } from 'react-router-dom';
import LoginPage from '@/pages/login/LoginPage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <LoginPage />,
  },
];

export default routes;
