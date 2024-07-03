import { createBrowserRouter, Navigate } from 'react-router-dom';

import BasicLayout from '@/client/layout/BasicLayout';

import homeRouter from '@/client/router/home/homeRouter';
import customerRouter from '@/client/router/customer/customerRouter';
import orderRouter from '@/client/router/order/orderRouter';
import productRouter from './product/productRouter';
import paymentHistoryRouter from '@/client/router/paymentHistory/paymentHistoryRouter';
import eventRouter from '@/client/router/event/eventRouter';
import shopManagementRouter from '@/client/router/shopManagement/shopManagementRouter';

const clientRoot = createBrowserRouter([
  {
    path: '',
    element: <Navigate replace to='home' />,
  },
  {
    path: '/',
    element: <BasicLayout />, //기본 레이아웃
    children: [
      {
        path: 'home',
        children: homeRouter(),
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
    ],
  },
]);

export default clientRoot;
