/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';

import LazyComponent from '@/client/layout/partials/LazyComponet';

const IndexPage = lazy(() => import('@/client/page/login/IndexPage'));

const loginRouter = () => {
  return [
    {
      path: '',
      element: <LazyComponent Component={IndexPage} />,
    },
  ];
};

export default loginRouter;
