import { Navigate } from 'react-router-dom';

import BasicLayout from '@/client/layout/BasicLayout';

// import homeRouter from '@/client/router/home/homeRouter';
import customerRouter from '@/client/router/customer/customerRouter';
import orderRouter from '@/client/router/order/orderRouter';
import productRouter from './product/productRouter';
import paymentHistoryRouter from '@/client/router/paymentHistory/paymentHistoryRouter';
import eventRouter from '@/client/router/event/eventRouter';
import shopManagementRouter from '@/client/router/shopManagement/shopManagementRouter';
import loginRouter from '@/client/router/login/loginRouter';
import joinRouter from '@/client/router/join/joinRouter';
import idInquiryRouter from '@/client/router/idInquiry/idInquiryRouter';
import pwInquiryRouter from '@/client/router/pwInquiry/pwInquiryRouter';

const clientRoot = () => [
  {
    path: 'login',
    children: loginRouter(),
  },
  {
    path: 'join',
    children: joinRouter(),
  },
  {
    path: 'idInquiry',
    children: idInquiryRouter(),
  },
  {
    path: 'pwInquiry',
    children: pwInquiryRouter(),
  },
  {
    path: '/',
    element: <BasicLayout />, //기본 레이아웃
    children: [
      //   {
      //     path: 'home',
      //     children: homeRouter(),
      //   },
      {
        path: 'home',
        element: <Navigate replace to='/customer' />,
      },
      {
        path: 'customer',
        children: customerRouter(),
      },
      {
        path: 'order',
        children: orderRouter(),
      },
      {
        path: 'product',
        children: productRouter(),
      },
      {
        path: 'payment-history',
        children: paymentHistoryRouter(),
      },
      {
        path: 'event',
        children: eventRouter(),
      },
      {
        path: 'shop-management',
        children: shopManagementRouter(),
      },
      {
        path: '',
        element: <Navigate replace to='login' />,
      },
      {
        path: '*',
        element: <Navigate replace to='login' />,
      },
    ],
  },
];

export default clientRoot;
