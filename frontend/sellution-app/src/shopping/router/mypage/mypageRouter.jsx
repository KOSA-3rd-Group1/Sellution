import { Navigate } from 'react-router-dom';

import IndexPage from '@/shopping/page/mypage/IndexPage';
import addressRouter from './address/addressRouter';
import couponRouter from './coupon/couponRouter';
import orderRouter from './order/orderRouter';
import editCustomerInfoRouter from './editCustomerInfo/editCustomerInfoRouter';
import editSimplePasswordRouter from './editSimplePassword/editSimplePasswordRouter';
import paymentRouter from './payment/paymentRouter';

const mypageRouter = () => {
  return [
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
      path: 'auth',
      children: editSimplePasswordRouter(),
    },
    {
      path: '*',
      element: <Navigate replace to='' />,
    },
  ];
};

export default mypageRouter;
