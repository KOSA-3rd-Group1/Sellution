/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import LazyComponent from '@/client/layout/partials/LazyComponet';
import MainHeaderNavLayout from '@/client/layout/MainHeaderNavLayout';
import MainHeaderComponent from '@/client/layout/partials/MainHeaderComponent';

const DisplaySettingPage = lazy(() => import('@/client/page/shopManagement/DisplaySettingPage'));
const UrlSettingPage = lazy(() => import('@/client/page/shopManagement/UrlSettingPage'));
const SaleSettingPage = lazy(() => import('@/client/page/shopManagement/SaleSettingPage'));

const shopManagementRouter = () => {
  return [
    {
      path: '',
      element: (
        <MainHeaderComponent
          breadcrumbs={[{ label: '홈', link: '/home' }, { label: '쇼핑몰 관리' }]}
        >
          <MainHeaderNavLayout
            navMenus={[
              { label: 'URL 설정', link: 'url-setting' },
              { label: '화면 설정', link: 'display-setting' },
              { label: '판매 설정', link: 'sale-setting' },
            ]}
          />
        </MainHeaderComponent>
      ),
      children: [
        {
          path: '',
          element: <Navigate replace to='url-setting' />,
        },
        {
          path: 'url-setting',
          element: <LazyComponent Component={UrlSettingPage} />,
        },
        {
          path: 'display-setting',
          element: <LazyComponent Component={DisplaySettingPage} />,
        },
        {
          path: 'sale-setting',
          element: <LazyComponent Component={SaleSettingPage} />,
        },
      ],
    },
  ];
};

export default shopManagementRouter;
