/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import LazyComponent from '@/client/layout/partials/LazyComponet';
import MainHeaderComponent from '@/client/layout/partials/MainHeaderComponent';

const ListPage = lazy(() => import('@/client/page/paymentHistory/ListPage'));
const DetailPage = lazy(() => import('@/client/page/paymentHistory/DetailPage'));

const paymentHistoryRouter = () => {
  return [
    {
      path: '',
      element: (
        <MainHeaderComponent
          breadcrumbs={[{ label: '홈', link: '/home' }, { label: '결제 내역 관리' }]}
          title={'결제 내역 관리'}
        >
          <LazyComponent Component={ListPage} />
        </MainHeaderComponent>
      ),
    },
    {
      path: ':paymentHistoryId',
      element: (
        <MainHeaderComponent
          breadcrumbs={[
            { label: '홈', link: '/home' },
            { label: '결제 내역 관리', link: '/payment-history' },
            { label: '결제 내역 상세' },
          ]}
          title={'결제 내역 상세 정보'}
        >
          <LazyComponent Component={DetailPage} />
        </MainHeaderComponent>
      ),
    },
    {
      path: '*',
      element: <Navigate replace to='' />,
    },
  ];
};

export default paymentHistoryRouter;
