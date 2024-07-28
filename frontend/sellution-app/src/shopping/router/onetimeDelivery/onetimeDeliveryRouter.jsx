import { Navigate } from 'react-router-dom';

import ListPage from '@/shopping/page/onetimeDelivery/ListPage';
import DetailPage from '@/shopping/page/onetimeDelivery/DetailPage';
import CartPage from '@/shopping/page/onetimeDelivery/CartPage';
import OrderPage from '@/shopping/page/onetimeDelivery/OrderPage';
import OrderCompletedPage from '@/shopping/page/onetimeDelivery/OrderCompletedPage';

const onetimeDeliveryRouter = () => {
  return [
    {
      path: '',
      element: <ListPage />,
    },
    {
      path: ':onetimeDeliveryId',
      element: <DetailPage />,
    },
    {
      path: 'cart',
      element: <CartPage />,
    },
    {
      path: 'order/:customerId',
      element: <OrderPage />,
    },
    {
      path: 'order-completed/:orderId',
      element: <OrderCompletedPage />,
    },
    {
      path: '*',
      element: <Navigate replace to='' />,
    },
  ];
};

export default onetimeDeliveryRouter;
