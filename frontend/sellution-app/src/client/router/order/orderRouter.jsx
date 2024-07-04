/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import LazyComponent from '@/client/layout/partials/LazyComponet';
import MainHeaderComponent from '@/client/layout/partials/MainHeaderComponent';

const ListPage = lazy(() => import('@/client/page/order/ListPage'));
const DetailPage = lazy(() => import('@/client/page/order/DetailPage'));

const orderRouter = () => {
  return [
    {
      path: '',
      element: <Navigate replace to='list' />,
    },
    {
      path: 'list',
      element: (
        <MainHeaderComponent breadcrumbs={[{ label: '홈', link: '/home' }, { label: '주문 관리' }]}>
          <LazyComponent Component={ListPage} />
        </MainHeaderComponent>
      ),
    },
    {
      path: 'detail',
      element: (
        <MainHeaderComponent
          breadcrumbs={[
            { label: '홈', link: '/home' },
            { label: '주문 관리', link: '/order' },
            { label: '주문 상세' },
          ]}
        >
          <LazyComponent Component={DetailPage} />
        </MainHeaderComponent>
      ),
    },
  ];
};

export default orderRouter;
