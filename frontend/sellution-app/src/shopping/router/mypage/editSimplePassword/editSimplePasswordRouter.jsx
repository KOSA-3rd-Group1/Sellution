import { Navigate } from 'react-router-dom';

import EditPage from '@/shopping/page/mypage/editSimplePassword/EditPage';
import CheckSmsAuthPage from '@/shopping/page/mypage/editSimplePassword/CheckSmsAuthPage';

const editSimplePasswordRouter = () => {
  return [
    {
      path: 'sms',
      element: <CheckSmsAuthPage />,
    },
    {
      path: 'edit',
      element: <EditPage />,
    },
    {
      path: '*',
      element: <Navigate replace to='sms' />,
    },
  ];
};

export default editSimplePasswordRouter;
