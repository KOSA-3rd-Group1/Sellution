import { useEffect, useState } from 'react';
import useDebounce from '../common/useDebounce';
import { useNavigate } from 'react-router-dom';

// 더미 데이터 생성 함수
const generateDummyData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    customer_id: `user${index + 1}`,
    name: `Usewwwwwwwsssssssssssss ${index + 1}`,
    phone_number: `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    join_date: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split('T')[0],
    type: ['신규', '일반', '휴면'][Math.floor(Math.random() * 3)],
    isInUse: ['이용중', '미이용중'][Math.floor(Math.random() * 2)],
  }));
};

//더미 데이터
const DUMMY_DATA = generateDummyData(10);

export const useCustomerList = () => {
  const HEADERS = [
    {
      key: 'customer_id',
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
      key: 'phone_number',
      label: '휴대폰 번호',
      type: 'search',
      width: 'min-w-52 w-52 max-w-52',
    },
    {
      key: 'join_date',
      label: '가입일',
      type: 'sort',
      width: 'min-w-36 w-36 max-w-36',
    },
    {
      key: 'type',
      label: '회원 유형',
      type: 'filter',
      options: ['신규', '일반', '휴면'],
      width: 'min-w-36 w-36 max-w-36 text-brandOrange',
    },
    {
      key: 'isInUse',
      label: '이용 여부',
      type: 'filter',
      options: ['이용중', '미이용중'],
      width: 'min-w-36 w-36 max-w-36 text-brandOrange',
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
