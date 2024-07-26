import { Navigate } from 'react-router-dom';

import HomePage from '@/shopping/page/home/HomePage';
import EventPage from '@/shopping/page/home/EventPage';

const homeRouter = () => {
  return [
    {
      path: '',
      element: <HomePage />,
    },
    {
      path: 'event',
      element: <EventPage />,
    },
    {
      path: '*',
      element: <Navigate replace to='' />,
    },
  ];
};

export default homeRouter;
