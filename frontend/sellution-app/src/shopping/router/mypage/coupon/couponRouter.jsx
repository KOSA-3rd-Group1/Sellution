import { Navigate } from 'react-router-dom';

import ListPage from '@/shopping/page/mypage/coupon/ListPage';

const couponRouter = () => {
  return [
    {
      path: '',
      element: <ListPage />,
    },
    {
      path: '*',
      element: <Navigate replace to='' />,
    },
  ];
};

export default couponRouter;
