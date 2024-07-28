import { useCallback, useEffect, useState } from 'react';
import useDebounce from '@/client/business/common/useDebounce';
import useAuthStore from '@/client/store/stores/useAuthStore';
import { getCustomerList } from '@/client/utility/apis/customer/customerListApi';
import {
  formatCustomerType,
  formatPhoneNumber,
  transformCustomerType,
  transformLatestDeliveryDate,
} from '@/client/utility/functions/customerListFunction';
import { HEADERS } from '@/client/utility/tableinfo/CustomerListTableInfo';

// 더미 데이터 생성 함수
// const generateDummyData = (count) => {
//   return Array.from({ length: count }, (_, index) => ({
//     id: index + 1,
//     customerUsername: `user${index + 1}`,
//     customerName: `Usewwwwwwwsssssssssssss ${index + 1}`,
//     customerPhoneNumber: `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
//     customerCreatedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
//       .toISOString()
//       .split('T')[0],
//     customerType: ['신규', '일반', '휴면'][Math.floor(Math.random() * 3)],
//     latestDeliveryDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
//       .toISOString()
//       .split('T')[0],
//   }));
// };

//더미 데이터
// const DUMMY_DATA = generateDummyData(10);

export const useCustomerList = ({ queryParams, page, size, refresh, updateQueryParameter }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [data, setData] = useState([]); // 테이블 데이터
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [totalDataCount, setTotalDataCount] = useState(0); // 데이터 총 개수

  // 테이블 상태 관리 - 검색, 필터, 정렬 기능
  const [tableState, setTableState] = useState(
    HEADERS.reduce((acc, header) => {
      const value = queryParams.get(header.key);
      switch (header.key) {
        case 'customerType':
          acc[header.key] = value ? transformCustomerType(value) : 'All';
          break;
        case 'latestDeliveryDate':
          acc[header.key] = transformLatestDeliveryDate(queryParams.get('sortOption'));
          break;
        default:
          acc[header.key] = value || '';
          break;
      }
      return acc;
    }, {}),
  );

  // 날짜 범위 조회
  const [dateRangeValue, setDateRangeValue] = useState({
    startDate: queryParams.get('startDate'),
    endDate: queryParams.get('endDate'),
  });

  // 디바운스된 테이블 상태
  const debouncedTableState = useDebounce(tableState, 300);

  const formatData = useCallback(
    (content, index, page, size) => ({
      ...content,
      id: content.customerId,
      no: index + 1 + page * size,
      customerPhoneNumber: formatPhoneNumber(content.customerPhoneNumber),
      customerType: formatCustomerType(content.customerType),
      latestDeliveryDate: content.latestDeliveryDate || '-',
    }),
    [],
  );

  const prepareSearchParams = (searchCondition, page, size) => {
    const filterAndTransform = (obj) => {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        switch (key) {
          case 'latestDeliveryDate':
            if (value !== null) {
              if (value === '오름차순') {
                acc['sortOption'] = 'LATEST_DELIVERY_DATE_ASC';
              } else if (value === '내림차순') {
                acc['sortOption'] = 'LATEST_DELIVERY_DATE_DESC';
              }
            }
            break;
          case 'customerType':
            if (value && value !== 'All') {
              if (value === '신규') {
                acc[key] = 'NEW';
              } else if (value === '일반') {
                acc[key] = 'NORMAL';
              } else if (value === '휴면') {
                acc[key] = 'DORMANT';
              }
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
    const fetch = async (setAccessToken, accessToken) => {
      const pageParam = prepareSearchParams(tableState, page, size);
      const response = await getCustomerList(pageParam, setAccessToken, accessToken); // API 요청

      const { content, empty, pageable, totalElements, totalPages } = response.data;

      // 필터링 시 현재 페이지에 데이터가 없는 경우 1page로 이동
      if (empty && page > 1) {
        updateQueryParameter(pageParam, 1);
      }

      if (!empty) {
        const formattedContent = content.map((item, index) => {
          return formatData(item, index, pageable.pageNumber, size);
        });
        setData(() => formattedContent);
        setTotalDataCount(totalElements);
        setTotalPages(totalPages);
        updateQueryParameter(pageParam, page);
      } else {
        setData([]);
        setTotalDataCount(0);
        setTotalPages(1);
        updateQueryParameter(pageParam, 1);
      }
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
