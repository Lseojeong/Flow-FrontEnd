import { RouteObject } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import SigninPage from '@/pages/auth/SigninPage';
<<<<<<< HEAD

=======
import DictionaryPage from '@/pages/dictionary/DictionaryPage';
import FaqPage from '@/pages/faq/FaqPage'; // ✅ FAQ 페이지 import 추가
import DocsPage from '@/pages/docs/DocsPage'; 
>>>>>>> 5abfb6a (feat: #19 pr 리뷰 반영)
const routes: RouteObject[] = [
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/signin',
    element: <SigninPage />,
  },
<<<<<<< HEAD
=======
  {
    path: '/dictionary',
    element: <DictionaryPage/>,
  },
  {
    path: '/faq', // ✅ FAQ 라우트 추가
    element: <FaqPage />,
  },
  {
    path: '/docs', // ✅ FAQ 라우트 추가
    element: <DocsPage />,
  },
>>>>>>> 5abfb6a (feat: #19 pr 리뷰 반영)
];

export default routes;
