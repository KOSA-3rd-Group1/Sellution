import { RouterProvider } from 'react-router-dom';

// import clientRoot from '@/client/router/clientRoot.jsx';
// import customerRoot from '@/customer/router/customerRoot';
import root from '@/router/root';

function App() {
  return <RouterProvider router={root} />;
}

export default App;
