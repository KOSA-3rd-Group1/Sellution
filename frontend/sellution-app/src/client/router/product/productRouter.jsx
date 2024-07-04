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
        <MainHeaderComponent>
          <MainHeaderNavLayout
            nav={[
              ['list', '상품 목록'],
              ['category-list', '카테고리 목록'],
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
        <MainHeaderComponent>
          <LazyComponent Component={DetailPage} />
        </MainHeaderComponent>
      ),
    },
    {
      path: 'add',
      element: (
        <MainHeaderComponent>
          <LazyComponent Component={AddPage} />
        </MainHeaderComponent>
      ),
    },
    {
      path: 'category-detail',
      element: (
        <MainHeaderComponent>
          <LazyComponent Component={CategoryDetailPage} />
        </MainHeaderComponent>
      ),
    },
    {
      path: 'category-add',
      element: (
        <MainHeaderComponent>
          <LazyComponent Component={CategoryAddPage} />
        </MainHeaderComponent>
      ),
    },
  ];
};

export default productRouter;
