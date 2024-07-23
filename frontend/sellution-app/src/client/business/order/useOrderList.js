import { useEffect, useState } from 'react';
import useDebounce from '@/client/business/common/useDebounce';
import { useNavigate } from 'react-router-dom';

// 더미 데이터 생성 함수
const generateDummyData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    orderId: `${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: `${Math.floor(1000 + Math.random() * 9000)}`,
    code: `${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
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

export const useOrderList = () => {
  const HEADERS = [
    {
      key: 'code',
      label: '주문 번호',
      type: 'search',
      width: 'min-w-48 w-48 max-w-48',
    },
    {
      key: 'username',
      label: '회원 아이디',
      type: 'search',
      width: 'min-w-44 w-44 max-w-44',
    },
    {
      key: 'name',
      label: '회원명',
      type: 'search',
      width: 'min-w-44 w-44 max-w-44',
    },
    {
      key: 'phoneNumber',
      label: '휴대폰 번호',
      type: 'search',
      width: 'min-w-52 w-52 max-w-52',
    },
    {
      key: 'createdAt',
      label: '주문 등록일',
      type: 'none',
      width: 'min-w-36 w-36 max-w-36',
    },
    {
      key: 'product',
      label: '상품',
      type: 'none',
      width: 'min-w-56 w-56 max-w-56',
    },
    {
      key: 'type',
      label: '주문 유형',
      type: 'filter',
      options: ['단건', '정기 (월 단위)', '정기 (횟수 단위)'],
      width: 'min-w-40 w-40 max-w-40 text-brandOrange',
    },
    {
      key: 'status',
      label: '주문 상태',
      type: 'filter',
      options: ['승인 대기', '주문 승인', '주문 취소'],
      width: 'min-w-40 w-40 max-w-40 text-brandOrange',
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

  // 자동 주문 승인 여부
  const [isAutoOrderApproved, setIsAutoOrderApproved] = useState(false);

  // api 요청으로 데이터 받아오기
  useEffect(() => {
    setData(DUMMY_DATA);
    setTotalDataCount(100);
    setIsAutoOrderApproved(true);
    console.log(tableState);
  }, [debouncedTableState]);

  // 날짜 범위 조회 핸들러
  const handleChangeDateRangeValue = (newDataRangeValue) => {
    console.log('newValue:', newDataRangeValue);
    setDateRangeValue(newDataRangeValue);
  };

  // 자동 주문 승인 핸들러
  const handleToggleAutoOrderApproved = () => {
    setIsAutoOrderApproved(!isAutoOrderApproved);
  };

  // 간편 주문 승인 이벤트 (작업해야 할 부분: 간편 주문 승인 시, 서버로 api 요청, 이후 응답 받아서 성공하면 해당 데이터 변경)
  const handleApproveSimpleOrderBtn = () => {
    alert(`간편 주문 승인`);
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
    isAutoOrderApproved,
    setTableState,
    handleChangeDateRangeValue,
    handleToggleAutoOrderApproved,
    handleApproveSimpleOrderBtn,
    handleRowEvent,
  };
};
