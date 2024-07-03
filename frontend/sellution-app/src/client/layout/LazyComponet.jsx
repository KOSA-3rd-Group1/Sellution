import { Suspense } from 'react';

import LoadingPage from '@/client/page/loading/LoadingPage';

const LazyComponent = (Component) => (
  <Suspense fallback={<LoadingPage />}>
    <Component />
  </Suspense>
);

export default LazyComponent;
