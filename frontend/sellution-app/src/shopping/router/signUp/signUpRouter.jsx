import { Navigate } from 'react-router-dom';

import SignUpPage from '@/shopping/page/signUp/SignUpPage';

const signUpRouter = () => {
  return [
    {
      path: '',
      element: <SignUpPage />,
    },
    {
      path: '*',
      element: <Navigate replace to='' />,
    },
  ];
};

export default signUpRouter;
