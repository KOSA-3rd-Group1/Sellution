import { createBrowserRouter } from 'react-router-dom';

import clientRoot from '@/client/router/clientRoot';
import shoppingRoot from '../shopping/router/shoppingRoot';

const root = createBrowserRouter([
  {
    path: '',
    children: clientRoot(),
  },
  {
    path: 'shopping',
    children: shoppingRoot(),
  },
]);

export default root;
