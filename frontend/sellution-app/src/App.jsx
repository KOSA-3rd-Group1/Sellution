import { RouterProvider } from 'react-router-dom';

import clientRoot from '@/client/router/clientRoot.jsx';

function App() {
  return <RouterProvider router={clientRoot} />;
}

export default App;
