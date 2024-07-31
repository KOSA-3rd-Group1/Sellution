import { useCallback, useEffect, useState } from 'react';
import useDebounce from '@/client/business/common/useDebounce';
import useAuthStore from '@/client/store/stores/useAuthStore';
import useUserInfoStore from '@/client/store/stores/useUserInfoStore';
import { formatPrice, priceInServerFormat } from '@/client/utility/functions/formatterFunction';
import {
  formatPaymentStatus,
  transformPaymentStatus,
} from '@/client/utility/functions/paymentListFunction';
import { getPaymentHistoryList } from '@/client/utility/apis/paymentHistory/paymentHistoryListApi';
import { HEADERS } from '@/client/utility/tableinfo/PaymentHistoryListTableInfo';

// 더미 데이터 생성 함수
const generateDummyData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    orderId: `2024${Math.floor(100000 + Math.random() * 900000)}`,
    customerUsername: `User ${index + 1}`,
    paymentMethod: `CMS`,
    price: `${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split('T')[0],
    status: ['결제완료', '결제취소', '결제실패'][Math.floor(Math.random() * 3)],
  }));
};

//더미 데이터
const DUMMY_DATA = generateDummyData(10);

export const usePaymentHistoryList = ({
  queryParams,
  page,
  size,
  refresh,
  updateQueryParameter,
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const companyId = useUserInfoStore((state) => state.companyId);

  // 테이블 데이터
  const [data, setData] = useState([]); // 테이블 데이터
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [totalDataCount, setTotalDataCount] = useState(0); // 데이터 총 개수

  // 테이블 상태 관리 - 검색, 필터, 정렬 기능
  const [tableState, setTableState] = useState(
    HEADERS.reduce((acc, header) => {
      if (header.type === 'search') acc[header.key] = '';
      if (header.type === 'filter') acc[header.key] = 'All';
      if (header.type === 'sort') acc[header.key] = null;
      return acc;
    }, {}),
  );
  console.log('tableState>>>>>', tableState);

  // 날짜 범위 조회
  const [dateRangeValue, setDateRangeValue] = useState({
    startDate: null,
    endDate: null,
  });

  // 디바운스된 테이블 상태
  const debouncedTableState = useDebounce(tableState, 300);

  // formatData (수정 필요)
  const formatData = useCallback(
    (content, index, page, size) => ({
      ...content,
      id: content.paymentHisoryId, // 리턴 값에 없는것 같은데...
      no: index + 1 + page * size,
      price: formatPrice(content.price),
      status: formatPaymentStatus(content.status),
    }),
    [],
  );

  // prepareSearchParams(수정 필요)
  const prepareSearchParams = (searchCondition, page, size) => {
    const filterAndTransform = (obj) => {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        switch (key) {
          case 'customerType':
            if (value && value !== 'All') {
              acc[key] = formatPaymentStatus(value);
            }
            break;
          case 'customerUsername':
          case 'customerName':
          case 'customerPhoneNumber':
            if (value !== null && value.trim() !== '') acc[key] = value;
            break;
          default:
            break;
        }
        return acc;
      }, {});
    };

    // searchCondition 객체 필터링
    const filteredCondition = filterAndTransform(searchCondition);
    if (dateRangeValue.startDate !== null) {
      filteredCondition['startDate'] = dateRangeValue.startDate;
    }

    if (dateRangeValue.endDate !== null) {
      filteredCondition['endDate'] = dateRangeValue.endDate;
    }

    // 페이징 정보 추가
    return {
      ...filteredCondition,
      page: page - 1, // 페이지는 0부터 시작하므로 1을 빼줍니다
      size: size,
    };
  };

  // api 요청으로 데이터 받아오기
  useEffect(() => {
    const fetch = async (setAccesstoken, accessToken) => {
      const pageParam = prepareSearchParams(tableState, page, size);
      const response = await getPaymentHistoryList(pageParam, setAccessToken, accessToken); // API 요청
      console.log(response);
      //   const { content, empty, pageable, totalElements, totalPages } = response.data;

      // 필터링 시 현재 페이지에 데이터가 없는 경우 1page로 이동
      //   if (empty && page > 1) {
      //     updateQueryParameter(pageParam, 1);
      //   }

      //   if (!empty) {
      //     const formattedContent = content.map((item, index) => {
      //       return formatData(item, index, pageable.pageNumber, size);
      //     });
      //     setData(() => formattedContent);
      //     setTotalDataCount(totalElements);
      //     setTotalPages(totalPages);
      //     updateQueryParameter(pageParam, page);
      //   } else {
      //     setData([]);
      //     setTotalDataCount(0);
      //     setTotalPages(1);
      //     updateQueryParameter(pageParam, 1);
      //   }

      setData(DUMMY_DATA);
      setTotalDataCount(100);
      console.log(tableState);
    };
    fetch(setAccessToken, accessToken);
  }, [debouncedTableState, dateRangeValue, page, refresh]);

  // 날짜 범위 조회 핸들러
  const handleChangeDateRangeValue = (newDataRangeValue) => {
    console.log('newValue:', newDataRangeValue);
    setDateRangeValue(newDataRangeValue);
  };

  // 필터 초기화
  const handleFilterReset = () => {
    setTableState({});
  };

  return {
    data,
    totalPages,
    totalDataCount,
    tableState,
    dateRangeValue,
    setTableState,
    handleChangeDateRangeValue,
    handleFilterReset,
  };
};
