/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import LazyComponent from '@/client/layout/partials/LazyComponet';

const ContractAuthPage = lazy(() => import('@/client/page/join/ContractAuthPage'));
const SmsAuthPage = lazy(() => import('@/client/page/join/SmsAuthPage'));
const BeginPage = lazy(() => import('@/client/page/join/BeginPage'));

const joinRouter = () => {
  return [
    {
      path: 'contract-auth',
      element: <LazyComponent Component={ContractAuthPage} />,
    },
    {
      path: 'sms-auth',
      element: <LazyComponent Component={SmsAuthPage} />,
    },
    {
      path: 'begin',
      element: <LazyComponent Component={BeginPage} />,
    },
    {
      path: '',
      element: <Navigate replace to='contract-auth' />,
    },
    {
      path: '*',
      element: <Navigate replace to='contract-auth' />,
    },
  ];
};

export default joinRouter;
