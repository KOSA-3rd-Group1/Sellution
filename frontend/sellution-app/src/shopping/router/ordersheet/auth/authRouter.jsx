import { Navigate } from 'react-router-dom';

import SimplePassword from '@/shopping/page/ordersheet/auth/SimplePasswordPage';

const authRouter = () => {
  return [
    {
      path: '',
      element: <SimplePassword />,
    },
    {
      path: '*',
      element: <Navigate replace to='' />,
    },
  ];
};

export default authRouter;
