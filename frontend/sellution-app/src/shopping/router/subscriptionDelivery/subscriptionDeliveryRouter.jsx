import { Navigate } from 'react-router-dom';

import IntroducePage from '@/shopping/page/subscriptionDelivery/IntroducePage';
import ListPage from '@/shopping/page/subscriptionDelivery/ListPage';
import DetailPage from '@/shopping/page/subscriptionDelivery/DetailPage';
import CartPage from '@/shopping/page/subscriptionDelivery/CartPage';
import OrderPage from '@/shopping/page/subscriptionDelivery/OrderPage';
import OrderCompletedPage from '@/shopping/page/subscriptionDelivery/OrderCompletedPage';

const subscriptionDeliveryRouter = () => {
  return [
    {
      path: 'introduce',
      element: <IntroducePage />,
    },
    {
      path: '',
      element: <ListPage />,
    },
    {
      path: ':subscriptionDeliveryId',
      element: <DetailPage />,
    },
    {
      path: 'cart',
      element: <CartPage />,
    },
    {
      path: 'order',
      element: <OrderPage />,
    },
    {
      path: 'order-completed',
      element: <OrderCompletedPage />,
    },
    {
      path: '*',
      element: <Navigate replace to='' />,
    },
  ];
};

export default subscriptionDeliveryRouter;
