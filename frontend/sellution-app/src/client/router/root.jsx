import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import LazyComponent from '@/client/layout/LazyComponet';

const HomePage = lazy(() => import('@/client/page/home/IndexPage'));
const CustomerPage = lazy(() => import('@/client/page/customer/IndexPage'));

const clientRoot = createBrowserRouter([
  {
    path: '',
    element: LazyComponent(HomePage),
  },
  {
    path: 'customer',
    element: LazyComponent(CustomerPage),
  },
]);

export default clientRoot;
