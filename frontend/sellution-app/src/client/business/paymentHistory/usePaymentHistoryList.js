import { useEffect, useState } from 'react';
import useDebounce from '@/client/business/common/useDebounce';
import { useNavigate } from 'react-router-dom';

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

export const usePaymentHistoryList = () => {
  const HEADERS = [
    {
      key: 'orderId',
      label: '주문 번호',
      type: 'search',
      width: 'min-w-44 w-44 max-w-44',
    },
    {
      key: 'customerUsername',
      label: '회원 아이디',
      type: 'search',
      width: 'min-w-44 w-44 max-w-44',
    },
    {
      key: 'paymentMethod',
      label: '결제 방법',
      type: 'none',
      width: 'min-w-44 w-44 max-w-44',
    },
    {
      key: 'price',
      label: '결제 가격',
      type: 'none',
      width: 'min-w-44 w-44 max-w-44',
    },
    {
      key: 'createdAt',
      label: '결제 시간',
      type: 'none',
      width: 'min-w-52 w-52 max-w-52',
    },
    {
      key: 'status',
      label: '결제 상태',
      type: 'filter',
      options: ['결제 완료', '결제 취소', '결제 실패'],
      width: 'min-w-44 w-44 max-w-44 text-brandOrange',
    },
  ];

  const ROW_HEIGHT = 'min-h-14 h-14 max-h-14';

  const navigate = useNavigate();

  // 테이블 데이터
  const [data, setData] = useState([]);

  // 테이블 상태 관리 - 검색, 필터, 정렬 기능
  const [tableState, setTableState] = useState(
    HEADERS.reduce((acc, header) => {
      if (header.type === 'search') acc[header.key] = '';
      if (header.type === 'filter') acc[header.key] = 'All';
      if (header.type === 'sort') acc[header.key] = null;
      return acc;
    }, {}),
  );

  // 데이터 총 개수
  const [totalDataCount, setTotalDataCount] = useState(0);

  // 디바운스된 테이블 상태
  const debouncedTableState = useDebounce(tableState, 300);

  // 날짜 범위 조회
  const [dateRangeValue, setDateRangeValue] = useState({
    startDate: null,
    endDate: null,
  });

  // api 요청으로 데이터 받아오기
  useEffect(() => {
    setData(DUMMY_DATA);
    setTotalDataCount(100);
    console.log(tableState);
  }, [debouncedTableState]);

  // 날짜 범위 조회 핸들러
  const handleChangeDateRangeValue = (newDataRangeValue) => {
    console.log('newValue:', newDataRangeValue);
    setDateRangeValue(newDataRangeValue);
  };

  // 대량 회원 관리 버튼
  const handleBulkCustomerManagementBtn = () => {
    alert('대량 회원 관리 버튼');
  };

  // 쿠폰 발송 버튼
  const handleSendCouponBtn = () => {
    alert('쿠폰 발송 버튼 로직');
  };

  // 회원 등록 버튼
  const handleAddCustomerBtn = () => {
    navigate({
      pathname: 'add',
    });
  };

  // 테이블 row onClick 이벤트
  const handleRowEvent = (e) => {
    navigate({
      pathname: `${e}`,
    });
  };

  return {
    HEADERS,
    ROW_HEIGHT,
    data,
    totalDataCount,
    tableState,
    dateRangeValue,
    setTableState,
    handleChangeDateRangeValue,
    handleBulkCustomerManagementBtn,
    handleSendCouponBtn,
    handleAddCustomerBtn,
    handleRowEvent,
  };
};
