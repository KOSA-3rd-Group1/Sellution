/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import LazyComponent from '@/client/layout/partials/LazyComponet';
import MainHeaderComponent from '@/client/layout/partials/MainHeaderComponent';

const ListPage = lazy(() => import('@/client/page/event/ListPage'));

const eventRouter = () => {
  return [
    {
      path: '',
      element: (
        <MainHeaderComponent
          breadcrumbs={[{ label: '홈', link: '/home' }, { label: '이벤트 관리' }]}
          title={'이벤트 관리'}
        >
          <LazyComponent Component={ListPage} />
        </MainHeaderComponent>
      ),
    },
    {
      path: '*',
      element: <Navigate replace to='' />,
    },
  ];
};

export default eventRouter;
