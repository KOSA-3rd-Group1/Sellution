import homeRouter from './home/homeRouter';
import loginRouter from './login/loginRouter';
import mypageRouter from './mypage/mypageRouter';
import onetimeDeliveryRouter from './onetimeDelivery/onetimeDeliveryRouter';
import ordersheetRouter from './ordersheet/ordersheetRouter';
import signUpRouter from './signUp/signUpRouter';
import subscriptionDeliveryRouter from './subscriptionDelivery/subscriptionDeliveryRouter';

const shoppingRoot = () => [
  {
    path: ':clientName',
    element: <div>고객에 따른 쇼핑몰 페이지</div>,
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
        path: 'signUp',
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
