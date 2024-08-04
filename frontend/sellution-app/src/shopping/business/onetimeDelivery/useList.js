import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';

const useList = () => {
  const [onetimeProductList, setOnetimeProductList] = useState([]);
  const [onetimeCategoryList, setOnetimeCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // 현재 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 많은 데이터가 있는지 여부
  const companyId = useCompanyInfoStore((state) => state.companyId);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchProducts = useCallback(
    async (categoryId, resetPage = false) => {
      if (resetPage) {
        setPage(0);
        setOnetimeProductList([]);
      }

      setIsLoading(true);
      try {
        const url = categoryId
          ? `${import.meta.env.VITE_BACKEND_URL}/products/company/${companyId}?deliveryType=ONETIME&categoryId=${categoryId}&page=${resetPage ? 0 : page}&size=20`
          : `${import.meta.env.VITE_BACKEND_URL}/products/company/${companyId}?deliveryType=ONETIME&page=${resetPage ? 0 : page}&size=20`;
        const response = await axios.get(url);
        setOnetimeProductList((prev) =>
          resetPage ? response.data.content : [...prev, ...response.data.content],
        );
        setHasMore(!response.data.last); // 마지막 페이지인지 여부 확인
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [page, companyId],
  );

  useEffect(() => {
    if (page === 0) return;
    fetchProducts(selectedCategory ? selectedCategory.categoryId : null);
  }, [page]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/products/company/${companyId}?deliveryType=ONETIME&page=0&size=20`,
          ),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/company/${companyId}`),
        ]);

        setOnetimeProductList(productResponse.data.content);
        setOnetimeCategoryList([
          { categoryId: null, name: '단건배송 전체' },
          ...categoryResponse.data,
        ]);
        setHasMore(!productResponse.data.last); // 마지막 페이지인지 여부 확인
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [companyId]);

  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage((prev) => prev + 1);
    }
  };

  return {
    onetimeProductList,
    onetimeCategoryList,
    isLoading,
    error,
    fetchProducts, // fetchProducts 함수를 반환
    loadMore,
    hasMore,
    setSelectedCategory,
    selectedCategory,
  };
};

export default useList;
