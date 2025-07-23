import { RouteObject } from 'react-router-dom';
import { LoginPage, SigninPage } from '@/pages/auth';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/signin',
    element: <SigninPage />,
  },
];

export default routes;
