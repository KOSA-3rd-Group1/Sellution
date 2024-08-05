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
      element: (
        <MainHeaderComponent
          breadcrumbs={[{ label: '홈', link: '/home' }, { label: '상품 관리' }]}
          title={'상품 관리'}
        >
          <MainHeaderNavLayout
            navMenus={[
              { label: '상품 목록', link: '/product' },
              { label: '카테고리 목록', link: '/product/category' },
            ]}
            isEnd={true}
          />
        </MainHeaderComponent>
      ),
      children: [
        {
          path: 'category',
          element: <LazyComponent Component={CategoryListPage} />,
        },
        {
          path: 'category/*',
          element: <Navigate replace to='category' />,
        },
        {
          path: '',
          element: <LazyComponent Component={ListPage} />,
        },
        {
          path: '*',
          element: <Navigate replace to='' />,
        },
      ],
    },
    {
      path: 'category/add',
      element: (
        <MainHeaderComponent
          breadcrumbs={[
            { label: '홈', link: '/home' },
            { label: '상품 관리', link: '/product/category' },
            { label: '카테고리 등록' },
          ]}
          title={'카테고리 등록'}
        >
          <LazyComponent Component={CategoryAddPage} />
        </MainHeaderComponent>
      ),
    },
    {
      path: 'category/:categoryId',
      element: (
        <MainHeaderComponent
          breadcrumbs={[
            { label: '홈', link: '/home' },
            { label: '상품 관리', link: '/product/category' },
            { label: '카테고리 상세' },
          ]}
          title={'카테고리 상세 정보'}
        >
          <LazyComponent Component={CategoryDetailPage} />
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
          title={'상품 등록'}
        >
          <LazyComponent Component={AddPage} />
        </MainHeaderComponent>
      ),
    },
    {
      path: ':productId',
      element: (
        <MainHeaderComponent
          breadcrumbs={[
            { label: '홈', link: '/home' },
            { label: '상품 관리', link: '/product' },
            { label: '상품 상세' },
          ]}
          title={'상품 상세 정보'}
        >
          <LazyComponent Component={DetailPage} />
        </MainHeaderComponent>
      ),
    },
  ];
};

export default productRouter;
