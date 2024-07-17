import { Navigate } from 'react-router-dom';

import EditPage from '@/shopping/page/mypage/editCustomerInfo/EditPage';
import CheckPasswordPage from '@/shopping/page/mypage/editCustomerInfo/CheckPasswordPage';
import ChangePasswordPage from '@/shopping/page/mypage/editCustomerInfo/ChangePasswordPage';

const editCustomerInfoRouter = () => {
  return [
    {
      path: 'edit',
      element: <EditPage />,
    },
    {
      path: 'cgpw',
      element: <ChangePasswordPage />,
    },
    {
      path: 'ckpw',
      element: <CheckPasswordPage />,
    },
    {
      path: '*',
      element: <Navigate replace to='edit' />,
    },
  ];
};

export default editCustomerInfoRouter;
