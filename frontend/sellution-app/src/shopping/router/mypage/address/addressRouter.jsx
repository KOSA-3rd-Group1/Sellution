import { Navigate } from 'react-router-dom';

import ListPage from '@/shopping/page/mypage/address/ListPage';
import DetailPage from '@/shopping/page/mypage/address/DetailPage';
import AddPage from '@/shopping/page/mypage/address/AddPage';

const addressRouter = () => {
  return [
    {
      path: '',
      element: <ListPage />,
    },
    {
      path: ':addressId',
      element: <DetailPage />,
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

export default addressRouter;
