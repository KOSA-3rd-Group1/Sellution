/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import LazyComponent from '@/client/layout/partials/LazyComponet';

const IndexPage = lazy(() => import('@/client/page/login/IndexPage'));

const loginRouter = () => {
  return [
    {
      path: '',
      element: <LazyComponent Component={IndexPage} />,
    },
    {
      path: '*',
      element: <Navigate replace to='' />,
    },
  ];
};

export default loginRouter;
