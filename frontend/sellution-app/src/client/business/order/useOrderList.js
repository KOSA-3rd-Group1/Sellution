import { useCallback, useEffect, useState } from 'react';
import useDebounce from '@/client/business/common/useDebounce';
import useAuthStore from '@/client/store/stores/useAuthStore';
import useTableStore from '@/client/store/stores/useTableStore';
import { formatPhoneNumber } from '@/client/utility/functions/formatterFunction';
import {
  formatOrderType,
  formatOrderStatus,
  transformOrderType,
  transformOrderStatus,
} from '@/client/utility/functions/orderListFunction';
import { HEADERS } from '@/client/utility/tableinfo/CustomerListTableInfo';

// 더미 데이터 생성 함수
const generateDummyData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    orderId: `${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: `${Math.floor(1000 + Math.random() * 9000)}`,
    orderCode: `${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
    username: `User ${index + 1}`,
    name: `User ${index + 1}`,
    phoneNumber: `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split('T')[0],
    product: `product items ... ${index + 1}`,
    type: ['단건', '정기 (월 단위)', '정기 (횟수 단위)'][Math.floor(Math.random() * 3)],
    status: ['주문 취소', '승인 대기', '주문 승인'][Math.floor(Math.random() * 3)],
  }));
};

//orderId
//customerId
// 아래는 테이블에 들어갈 것
//No
//code, 주문번호 14자리, 검색 150
//username 회원 아이디, 검색 180
//name, 회원명, 검색 150
//phoneNumber휴대폰번호, 검색 180
//createdAt, 주문등록일 130
//product, 상품 260
//type, 주문유형, [ONETIME, MONTH_SUBSCRIPTION, COUNT_SUBSCRIPTION],선택 130
//status, 주문상태, [HOLD, APPROVED, CANCEL] 130

//더미 데이터
const DUMMY_DATA = generateDummyData(10);

export const useOrderList = ({ queryParams, page, size, refresh, updateQueryParameter }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const { tables, setSelectedRows, setSelectAll } = useTableStore();

  // 테이블 데이터
  const [data, setData] = useState([]); // 테이블 데이터
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [totalDataCount, setTotalDataCount] = useState(0); // 데이터 총 개수

  // 자동 주문 승인 여부
  const [isAutoOrderApproved, setIsAutoOrderApproved] = useState(false);

  // 테이블 상태 관리 - 검색, 필터, 정렬 기능
  const [tableState, setTableState] = useState(
    HEADERS.reduce((acc, header) => {
      if (header.type === 'search') acc[header.key] = '';
      if (header.type === 'filter') acc[header.key] = 'All';
      if (header.type === 'sort') acc[header.key] = null;
      return acc;
    }, {}),
  );

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
      id: content.orderId, // 리턴 값에 없는것 같은데...
      no: index + 1 + page * size,
      phoneNumber: formatPhoneNumber(content.customer.phoneNumber),
      type: formatOrderType(content.type),
      status: formatOrderStatus(content.status),
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
              acc[key] = transformOrderType(value);
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
      // const responseData = await getOrderList(pageParam, setAccessToken, accessToken); // API 요청
      //   const { content, empty, pageable, totalElements, totalPages } = responseData.data;

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
      //   setIsAutoOrderApproved(true); // 이건 확인해봐야...
    };
    // fetch(setAccessToken, accessToken);

    setData(DUMMY_DATA);
    setTotalDataCount(100);
    setIsAutoOrderApproved(true);
    console.log(tableState);
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

  // 자동 주문 승인 핸들러 - API 요청
  const handleToggleAutoOrderApproved = () => {
    setIsAutoOrderApproved(!isAutoOrderApproved);
  };

  // 간편 주문 승인 이벤트 (작업해야 할 부분: 간편 주문 승인 시, 서버로 api 요청, 이후 응답 받아서 성공하면 해당 데이터 변경)
  const handleApproveAllSimpleOrderBtn = (tableId) => {
    console.log(tables[tableId]);
    alert('간편 주문 일괄 승인');
  };

  const handleApproveSimpleOrderBtn = (orderId) => {
    console.log('간편주문', orderId);
    alert(`간편 주문 승인`);
  };

  return {
    data,
    totalPages,
    totalDataCount,
    tableState,
    dateRangeValue,
    isAutoOrderApproved,
    setTableState,
    handleChangeDateRangeValue,
    handleFilterReset,
    handleToggleAutoOrderApproved,
    handleApproveAllSimpleOrderBtn,
  };
};
