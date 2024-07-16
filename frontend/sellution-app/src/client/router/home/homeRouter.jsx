/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';

import LazyComponent from '@/client/layout/partials/LazyComponet';

const IndexPage = lazy(() => import('@/client/page/home/IndexPage'));

const homeRouter = () => {
  return [
    {
      path: '',
      element: <LazyComponent Component={IndexPage} />,
    },
  ];
};

export default homeRouter;
