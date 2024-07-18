import { Navigate } from 'react-router-dom';

import HomePage from '@/shopping/page/home/HomePage';

const homeRouter = () => {
  return [
    {
      path: '',
      element: <HomePage />,
    },
    {
      path: '*',
      element: <Navigate replace to='' />,
    },
  ];
};

export default homeRouter;
