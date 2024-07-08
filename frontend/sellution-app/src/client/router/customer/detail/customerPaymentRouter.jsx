/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import LazyComponent from '@/client/layout/partials/LazyComponet';

const ListPage = lazy(() => import('@/client/page/customer/detail/payment/ListPage'));
const DetailPage = lazy(() => import('@/client/page/customer/detail/payment/DetailPage'));
const AddPage = lazy(() => import('@/client/page/customer/detail/payment/AddPage'));

const customerPaymentRouter = () => {
  return [
    {
      path: '',
      element: <LazyComponent Component={ListPage} />,
    },
    {
      path: 'add',
      element: <LazyComponent Component={AddPage} />,
    },
    {
      path: ':paymentId',
      element: <LazyComponent Component={DetailPage} />,
    },
    {
      path: '*',
      element: <Navigate replace to='' />,
    },
  ];
};

export default customerPaymentRouter;
