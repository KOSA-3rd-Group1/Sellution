/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import LazyComponent from '@/client/layout/partials/LazyComponet';
import MainHeaderNavLayout from '@/client/layout/MainHeaderNavLayout';
import MainHeaderComponent from '@/client/layout/partials/MainHeaderComponent';

const ListPage = lazy(() => import('@/client/page/product/ListPage'));
const DetailPage = lazy(() => import('@/client/page/product/DetailPage'));
const AddPage = lazy(() => import('@/client/page/product/AddPage'));

const CategoryListPage = lazy(() => import('@/client/page/product/category/ListPage'));
const CategoryDetailPage = lazy(() => import('@/client/page/product/category/DetailPage'));
const CategoryAddPage = lazy(() => import('@/client/page/product/category/AddPage'));

const productRouter = () => {
  return [
    {
      path: '',
      element: <Navigate replace to='list' />,
    },
    {
      path: '',
      element: (
        <MainHeaderComponent breadcrumbs={[{ label: '홈', link: '/home' }, { label: '상품 관리' }]}>
          <MainHeaderNavLayout
            navMenus={[
              { label: '상품 목록', link: 'list' },
              { label: '카테고리 목록', link: 'category-list' },
            ]}
          />
        </MainHeaderComponent>
      ),
      children: [
        {
          path: 'list',
          element: <LazyComponent Component={ListPage} />,
        },
        {
          path: 'category-list',
          element: <LazyComponent Component={CategoryListPage} />,
        },
      ],
    },
    {
      path: 'detail',
      element: (
        <MainHeaderComponent
          breadcrumbs={[
            { label: '홈', link: '/home' },
            { label: '상품 관리', link: '/product' },
            { label: '상품 상세' },
          ]}
        >
          <LazyComponent Component={DetailPage} />
        </MainHeaderComponent>
      ),
    },
    {
      path: 'add',
      element: (
        <MainHeaderComponent
          breadcrumbs={[
            { label: '홈', link: '/home' },
            { label: '상품 관리', link: '/product' },
            { label: '상품 등록' },
          ]}
        >
          <LazyComponent Component={AddPage} />
        </MainHeaderComponent>
      ),
    },
    {
      path: 'category-detail',
      element: (
        <MainHeaderComponent
          breadcrumbs={[
            { label: '홈', link: '/home' },
            { label: '상품 관리', link: '/product' },
            { label: '카테고리 상세' },
          ]}
        >
          <LazyComponent Component={CategoryDetailPage} />
        </MainHeaderComponent>
      ),
    },
    {
      path: 'category-add',
      element: (
        <MainHeaderComponent
          breadcrumbs={[
            { label: '홈', link: '/home' },
            { label: '상품 관리', link: '/product' },
            { label: '카테고리 등록' },
          ]}
        >
          <LazyComponent Component={CategoryAddPage} />
        </MainHeaderComponent>
      ),
    },
  ];
};

export default productRouter;
