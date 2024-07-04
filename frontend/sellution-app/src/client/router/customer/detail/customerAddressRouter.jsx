/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import LazyComponent from '@/client/layout/partials/LazyComponet';

const ListPage = lazy(() => import('@/client/page/customer/detail/address/ListPage'));
const DetailPage = lazy(() => import('@/client/page/customer/detail/address/DetailPage'));
const AddPage = lazy(() => import('@/client/page/customer/detail/address/AddPage'));

const customerAddressRouter = () => {
  return [
    {
      path: '',
      element: <Navigate replace to='list' />,
    },
    {
      path: 'list',
      element: <LazyComponent Component={ListPage} />,
    },
    {
      path: 'detail',
      element: <LazyComponent Component={DetailPage} />,
    },
    {
      path: 'add',
      element: <LazyComponent Component={AddPage} />,
    },
  ];
};

export default customerAddressRouter;
