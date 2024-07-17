import { Navigate } from 'react-router-dom';

import ListPage from '@/shopping/page/mypage/payment/ListPage';
import AddPage from '@/shopping/page/mypage/payment/AddPage';

const paymentRouter = () => {
  return [
    {
      path: '',
      element: <ListPage />,
    },
    {
      path: 'add',
      element: <AddPage />,
    },
    {
      path: '*',
      element: <Navigate replace to='' />,
    },
  ];
};

export default paymentRouter;
