import { Navigate } from 'react-router-dom';

import ListPage from '@/shopping/page/mypage/order/ListPage';
import DetailPage from '@/shopping/page/mypage/order/DetailPage';

const orderRouter = () => {
  return [
    {
      path: '',
      element: <ListPage />,
    },
    {
      path: ':orderId',
      element: <DetailPage />,
    },
    {
      path: '*',
      element: <Navigate replace to='' />,
    },
  ];
};

export default orderRouter;
