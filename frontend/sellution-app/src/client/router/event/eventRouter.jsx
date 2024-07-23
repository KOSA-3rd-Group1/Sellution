/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import LazyComponent from '@/client/layout/partials/LazyComponet';
import MainHeaderComponent from '@/client/layout/partials/MainHeaderComponent';

const ListPage = lazy(() => import('@/client/page/event/ListPage'));
const AddPage = lazy(() => import('@/client/page/event/AddPage'));
const DetailPage = lazy(() => import('@/client/page/event/DetailPage'));

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
      path: 'add',
      element: (
        <MainHeaderComponent
          breadcrumbs={[
            { label: '홈', link: '/home' },
            { label: '이벤트 관리', link: '/event' },
            { label: '이벤트 등록' },
          ]}
          title={'이벤트 등록'}
        >
          <LazyComponent Component={AddPage} />
        </MainHeaderComponent>
      ),
    },
    {
      path: ':eventId',
      element: (
        <MainHeaderComponent
          breadcrumbs={[
            { label: '홈', link: '/home' },
            { label: '이벤트 관리', link: '/event' },
            { label: '이벤트 상세' },
          ]}
          title={'이벤트 상세 정보'}
        >
          <LazyComponent Component={DetailPage} />
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
