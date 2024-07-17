import addressRouter from './address/addressRouter';
import paymentRouter from './payment/paymentRouter';
import authRouter from './auth/authRouter';

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
