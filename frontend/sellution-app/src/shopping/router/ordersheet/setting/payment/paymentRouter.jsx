import { Navigate } from 'react-router-dom';

import AddPage from '@/shopping/page/ordersheet/setting/payment/AddPage';

const paymentRouter = () => {
  return [
    {
      path: 'add',
      element: <AddPage />,
    },
    {
      path: '*',
      element: <Navigate replace to='add' />,
    },
  ];
};

export default paymentRouter;
