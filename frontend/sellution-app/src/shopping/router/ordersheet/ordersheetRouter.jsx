import authRouter from '@/shopping/router/ordersheet/auth/authRouter';
import addressRouter from '@/shopping/router/ordersheet/setting/address/addressRouter';
import paymentRouter from '@/shopping/router/ordersheet/setting/payment/paymentRouter';

const ordersheetRouter = () => {
  return [
    {
      path: 'auth',
      children: authRouter(),
    },

    {
      path: 'setting',
      children: [
        {
          path: 'address',
          children: addressRouter(),
        },
        {
          path: 'payment',
          children: paymentRouter(),
        },
      ],
    },
  ];
};

export default ordersheetRouter;
