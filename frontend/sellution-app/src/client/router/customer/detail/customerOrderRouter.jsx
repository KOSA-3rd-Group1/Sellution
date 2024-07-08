/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import LazyComponent from '@/client/layout/partials/LazyComponet';

const ListPage = lazy(() => import('@/client/page/customer/detail/order/ListPage'));
const DetailPage = lazy(() => import('@/client/page/customer/detail/order/DetailPage'));

const customerOrderRouter = () => {
  return [
    {
      path: '',
      element: <LazyComponent Component={ListPage} />,
    },
    {
      path: ':orderId',
      element: <LazyComponent Component={DetailPage} />,
    },
    {
      path: '*',
      element: <Navigate replace to='' />,
    },
  ];
};

export default customerOrderRouter;
