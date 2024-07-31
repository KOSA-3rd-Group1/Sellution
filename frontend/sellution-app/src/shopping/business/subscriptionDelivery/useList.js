import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';

const useList = () => {
  const [subscriptionProductList, setSubscriptionProductList] = useState([]);
  const [subscriptionCategoryList, setSubscriptionCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); //페이지 번호 상태
  const [hasMore, setHasMore] = useState(true); //더 많은 데이터가 있는지 여부
  const companyId = useCompanyInfoStore((state) => state.companyId);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchProducts = useCallback(
    async (categoryId, resetPage = false) => {
      if (resetPage) {
        setPage(0);
        setSubscriptionProductList([]);
      }

      setIsLoading(true);
      try {
        const url = categoryId
          ? `http://localhost:8080/products/company/${companyId}?deliveryType=SUBSCRIPTION&categoryId=${categoryId}&page=${resetPage ? 0 : page}&size=20`
          : `http://localhost:8080/products/company/${companyId}?deliveryType=SUBSCRIPTION&page=${resetPage ? 0 : page}&size=20`;
        const response = await axios.get(url);
        setSubscriptionProductList((prev) =>
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
            `http://localhost:8080/products/company/${companyId}?deliveryType=SUBSCRIPTION&page=0&size=20`,
          ),
          axios.get(`http://localhost:8080/categories/company/${companyId}`),
        ]);
        setSubscriptionProductList(productResponse.data.content);
        setSubscriptionCategoryList([
          { categoryId: null, name: '정기배송 전체' },
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
  // const dummyProductList = [
  //   {
  //     id: 1,
  //     name: '유기농 케일 샐러드',
  //     category: '신선식품',
  //     price: '25000',
  //     stock: 30,
  //     discountRate: 10,
  //     discountedPrice: 22500,
  //     description: '신선한 유기농 케일로 만든 샐러드입니다. 건강한 한 끼 식사로 제격입니다.',
  //   },
  //   {
  //     id: 2,
  //     name: '프리미엄 와규 스테이크',
  //     category: '신선식품',
  //     price: '100000',
  //     stock: 20,
  //     discountRate: 15,
  //     discountedPrice: 85000,
  //     description:
  //       '최고급 와규로 만든 프리미엄 스테이크입니다. 특별한 날을 위한 완벽한 선택입니다.',
  //   },
  //   {
  //     id: 3,
  //     name: '친환경 이유식 세트',
  //     category: '유아용품',
  //     price: '50000',
  //     stock: 50,
  //     discountRate: 20,
  //     discountedPrice: 40000,
  //     description: '아기들을 위한 친환경 재료로 만든 이유식 세트입니다. 건강한 성장을 도와줍니다.',
  //   },
  //   {
  //     id: 4,
  //     name: '유아용 오가닉 코튼 티셔츠',
  //     category: '유아용품',
  //     price: '15000',
  //     stock: 100,
  //     discountRate: 5,
  //     discountedPrice: 14250,
  //     description:
  //       '부드럽고 편안한 오가닉 코튼으로 만든 유아용 티셔츠입니다. 민감한 피부에도 안심입니다.',
  //   },
  //   {
  //     id: 5,
  //     name: '모던 디자인 후드티',
  //     category: '의류',
  //     price: '60000',
  //     stock: 40,
  //     discountRate: 30,
  //     discountedPrice: 42000,
  //     description:
  //       '트렌디한 디자인의 후드티입니다. 다양한 스타일에 어울리며 편안한 착용감을 제공합니다.',
  //   },
  //   {
  //     id: 6,
  //     name: '실버 체인 목걸이',
  //     category: '악세사리',
  //     price: '120000',
  //     stock: 25,
  //     discountRate: 25,
  //     discountedPrice: 90000,
  //     description:
  //       '세련된 디자인의 실버 체인 목걸이입니다. 모든 스타일에 잘 어울리며, 고급스러운 느낌을 줍니다.',
  //   },
  //   {
  //     id: 7,
  //     name: '천연 소가죽 지갑',
  //     category: '패션잡화',
  //     price: '80000',
  //     stock: 60,
  //     discountRate: 20,
  //     discountedPrice: 64000,
  //     description:
  //       '고급 천연 소가죽으로 만든 지갑입니다. 내구성이 뛰어나며 세련된 디자인을 자랑합니다.',
  //   },
  //   {
  //     id: 8,
  //     name: '프리미엄 아라비카 원두 커피',
  //     category: '음료',
  //     price: '35000',
  //     stock: 80,
  //     discountRate: 15,
  //     discountedPrice: 29750,
  //     description: '최고급 아라비카 원두로 만든 커피입니다. 깊고 풍부한 향을 자랑합니다.',
  //   },
  //   {
  //     id: 9,
  //     name: '스마트 워치',
  //     category: '전자제품',
  //     price: '200000',
  //     stock: 15,
  //     discountRate: 10,
  //     discountedPrice: 180000,
  //     description:
  //       '최신 기술이 적용된 스마트 워치입니다. 다양한 기능과 스타일리시한 디자인을 자랑합니다.',
  //   },
  //   {
  //     id: 10,
  //     name: '무선 블루투스 이어폰',
  //     category: '전자제품',
  //     price: '150000',
  //     stock: 50,
  //     discountRate: 20,
  //     discountedPrice: 120000,
  //     description: '고음질 무선 블루투스 이어폰입니다. 편리한 사용과 뛰어난 음질을 제공합니다.',
  //   },
  // ];
  return {
    subscriptionProductList,
    subscriptionCategoryList,
    isLoading,
    error,
    fetchProducts,
    loadMore,
    hasMore,
    setSelectedCategory,
    selectedCategory,
  };
};

export default useList;
