import { Navigate } from 'react-router-dom';

import ListPage from '@/shopping/page/ordersheet/setting/address/ListPage';
import DetailPage from '@/shopping/page/ordersheet/setting/address/DetailPage';
import AddPage from '@/shopping/page/ordersheet/setting/address/AddPage';

const addressRouter = () => {
  return [
    {
      path: ':customerId',
      children: [
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
      ],
    },
  ];
};

export default addressRouter;
