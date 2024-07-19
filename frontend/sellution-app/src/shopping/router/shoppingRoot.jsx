import homeRouter from '@/shopping/router/home/homeRouter';
import loginRouter from '@/shopping/router/login/loginRouter';
import mypageRouter from '@/shopping/router/mypage/mypageRouter';
import onetimeDeliveryRouter from '@/shopping/router/onetimeDelivery/onetimeDeliveryRouter';
import ordersheetRouter from '@/shopping/router/ordersheet/ordersheetRouter';
import signUpRouter from '@/shopping/router/signUp/signUpRouter';
import subscriptionDeliveryRouter from '@/shopping/router/subscriptionDelivery/subscriptionDeliveryRouter';
import BasicLayout from '@/shopping/layout/BasicLayout';

const shoppingRoot = () => [
  {
    path: ':clientName',
    element: <BasicLayout />, //쇼핑몰 기본 레이아웃
    children: [
      {
        path: 'home',
        children: homeRouter(),
      },
      {
        path: 'login',
        children: loginRouter(),
      },
      {
        path: 'signup',
        children: signUpRouter(),
      },
      {
        path: 'my',
        children: mypageRouter(),
      },
      {
        path: 'onetime',
        children: onetimeDeliveryRouter(),
      },
      {
        path: 'subscription',
        children: subscriptionDeliveryRouter(),
      },
      {
        path: 'ordersheet',
        children: ordersheetRouter(),
      },
    ],
  },
];

export default shoppingRoot;
