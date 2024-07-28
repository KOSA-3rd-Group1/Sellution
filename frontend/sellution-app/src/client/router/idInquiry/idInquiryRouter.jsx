/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import LazyComponent from '@/client/layout/partials/LazyComponet';

const SmsAuthPage = lazy(() => import('@/client/page/idInquiry/SmsAuthPage'));
const ViewPage = lazy(() => import('@/client/page/idInquiry/ViewPage'));

const idInquiryRouter = () => {
  return [
    {
      path: 'sms-auth',
      element: <LazyComponent Component={SmsAuthPage} />,
    },
    {
      path: 'view',
      element: <LazyComponent Component={ViewPage} />,
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

export default idInquiryRouter;
