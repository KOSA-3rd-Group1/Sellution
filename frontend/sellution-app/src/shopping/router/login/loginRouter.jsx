import { Navigate } from 'react-router-dom';

import LoginPage from '@/shopping/page/login/LoginPage';

const loginRouter = () => {
  return [
    {
      path: '',
      element: <LoginPage />,
    },
    {
      path: '*',
      element: <Navigate replace to='' />,
    },
  ];
};

export default loginRouter;
