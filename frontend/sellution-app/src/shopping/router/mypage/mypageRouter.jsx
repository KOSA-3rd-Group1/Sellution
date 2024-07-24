import { Navigate } from 'react-router-dom';

import IndexPage from '@/shopping/page/mypage/IndexPage';

import addressRouter from '@/shopping/router/mypage/address/addressRouter';
import couponRouter from '@/shopping/router/mypage/coupon/couponRouter';
import orderRouter from '@/shopping/router/mypage/order/orderRouter';
import editCustomerInfoRouter from '@/shopping/router/mypage/editCustomerInfo/editCustomerInfoRouter';
import editSimplePasswordRouter from '@/shopping/router/mypage/editSimplePassword/editSimplePasswordRouter';
import paymentRouter from '@/shopping/router/mypage/payment/paymentRouter';

const mypageRouter = () => {
  return [
    {
      path: ':customerId',
      children: [
        {
          path: '',
          element: <IndexPage />,
        },
        {
          path: 'address',
          children: addressRouter(),
        },
        {
          path: 'payment',
          children: paymentRouter(),
        },
        {
          path: 'coupon',
          children: couponRouter(),
        },
        {
          path: 'order',
          children: orderRouter(),
        },
        {
          path: 'info',
          children: editCustomerInfoRouter(),
        },
        {
          path: 'auth/*',
          children: editSimplePasswordRouter(),
        },
        {
          path: '*',
          element: <Navigate replace to='' />,
        },
      ],
    },
  ];
};

export default mypageRouter;
