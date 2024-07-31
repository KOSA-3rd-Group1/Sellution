/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import LazyComponent from '@/client/layout/partials/LazyComponet';

const SmsAuthPage = lazy(() => import('@/client/page/pwInquiry/SmsAuthPage'));
const ResetPage = lazy(() => import('@/client/page/pwInquiry/ResetPage'));

const pwInquiryRouter = () => {
  return [
    {
      path: 'sms-auth',
      element: <LazyComponent Component={SmsAuthPage} />,
    },
    {
      path: 'reset',
      element: <LazyComponent Component={ResetPage} />,
    },
    {
      path: '',
      element: <Navigate replace to='sms-auth' />,
    },
    {
      path: '*',
      element: <Navigate replace to='sms-auth' />,
    },
  ];
};

export default pwInquiryRouter;
