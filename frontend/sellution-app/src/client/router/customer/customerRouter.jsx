/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import LazyComponent from '@/client/layout/partials/LazyComponet';
import MainHeaderNavLayout from '@/client/layout/MainHeaderNavLayout';
import MainHeaderComponent from '@/client/layout/partials/MainHeaderComponent';

import customerPaymentRouter from '@/client/router/customer/detail/customerPaymentRouter';
import customerAddressRouter from '@/client/router/customer/detail/customerAddressRouter';
import customerOrderRouter from '@/client/router/customer/detail/customerOrderRouter';

const ListPage = lazy(() => import('@/client/page/customer/ListPage'));
const AddPage = lazy(() => import('@/client/page/customer/AddPage'));
const DetailDefaultPage = lazy(() => import('@/client/page/customer/detail/DefaultPage'));

const customerRouter = () => {
  return [
    {
      path: '',
      element: <Navigate replace to='list' />,
    },
    {
      path: 'list',
      element: (
        <MainHeaderComponent breadcrumbs={[{ label: '홈', link: '/home' }, { label: '회원 관리' }]}>
          <LazyComponent Component={ListPage} />
        </MainHeaderComponent>
      ),
    },
    {
      path: 'add',
      element: (
        <MainHeaderComponent
          breadcrumbs={[
            { label: '홈', link: '/home' },
            { label: '회원 관리', link: '/customer' },
            { label: '회원 등록' },
          ]}
        >
          <LazyComponent Component={AddPage} />
        </MainHeaderComponent>
      ),
    },
    {
      path: 'detail',
      element: (
        <MainHeaderComponent
          breadcrumbs={[
            { label: '홈', link: '/home' },
            { label: '회원 관리', link: '/customer' },
            { label: '회원 상세' },
          ]}
        >
          <MainHeaderNavLayout
            navMenus={[
              { label: '기본 정보', link: 'default' },
              { label: '결제 정보', link: 'payment' },
              { label: '배송지 정보', link: 'address' },
              { label: '주문 정보', link: 'order' },
            ]}
          />
        </MainHeaderComponent>
      ),
      children: [
        {
          path: '',
          element: <Navigate replace to='default' />,
        },
        {
          path: 'default',
          element: <LazyComponent Component={DetailDefaultPage} />,
        },
        {
          path: 'payment',
          children: customerPaymentRouter(),
        },
        {
          path: 'address',
          children: customerAddressRouter(),
        },
        {
          path: 'order',
          children: customerOrderRouter(),
        },
      ],
    },
  ];
};

export default customerRouter;
