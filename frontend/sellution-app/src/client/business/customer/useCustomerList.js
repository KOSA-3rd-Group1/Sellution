import { useCallback, useEffect, useState } from 'react';
import useDebounce from '@/client/business/common/useDebounce';
// import { useNavigate } from 'react-router-dom';

// 더미 데이터 생성 함수
const generateDummyData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    customerUsername: `user${index + 1}`,
    customerName: `Usewwwwwwwsssssssssssss ${index + 1}`,
    customerPhoneNumber: `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    customerCreatedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split('T')[0],
    customerType: ['신규', '일반', '휴면'][Math.floor(Math.random() * 3)],
    lastestDeliveryDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split('T')[0],
  }));
};

//더미 데이터
const DUMMY_DATA = generateDummyData(10);

const HEADERS = [
  {
    key: 'customerUsername',
    label: '회원 아이디',
    type: 'search',
    width: 'min-w-44 w-44 max-w-44',
  },
  {
    key: 'customerName',
    label: '회원명',
    type: 'search',
    width: 'min-w-44 w-44 max-w-44',
  },
  {
    key: 'customerPhoneNumber',
    label: '휴대폰 번호',
    type: 'search',
    width: 'min-w-52 w-52 max-w-52',
  },
  {
    key: 'customerCreatedAt',
    label: '가입일',
    type: 'sort',
    width: 'min-w-36 w-36 max-w-36',
  },
  {
    key: 'customerType',
    label: '회원 유형',
    type: 'filter',
    options: ['신규', '일반', '휴면'],
    width: 'min-w-36 w-36 max-w-36 text-brandOrange',
  },
  {
    key: 'lastestDeliveryDate',
    label: '최신 주문 일자',
    type: 'sort',
    width: 'min-w-36 w-36 max-w-36 text-brandOrange',
  },
];

const ROW_HEIGHT = 'min-h-14 h-14 max-h-14';

//전화 번호 변환함수
const formatPhoneNumber = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  return phone;
};

// 회원 유형 변환 함수
const formatCustomerType = (type) => {
  const types = {
    NEW: '신규',
    NORMAL: '일반',
    DORMANT: '휴면',
  };
  return types[type] || type;
};

export const useCustomerList = ({ AuthBaseInstance, page, size, refresh }) => {
  //   const navigate = useNavigate();

  // 테이블 데이터
  const [data, setData] = useState([]);

  // 페이지네이션
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

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

  const formatData = useCallback(
    (content, index, page, size) => ({
      ...content,
      id: index + 1 + page * size,
      customerPhoneNumber: formatPhoneNumber(content.customerPhoneNumber),
      customerType: formatCustomerType(content.customerType),
      lastestDeliveryDate: content.lastestDeliveryDate || '-',
    }),
    [],
  );

  // api 요청으로 데이터 받아오기
  useEffect(() => {
    const fetch = async () => {
      const instance = await AuthBaseInstance();
      // api 로직 분리 필요
      const pageParam = { page: page - 1, size };
      const responseData = await instance.get(`/api/customers/list`, { params: { ...pageParam } });
      // api 로직 분리 필요
      const { content, empty, pageable, totalElements, totalPages } = responseData.data;
      if (!empty) {
        const formattedContent = content.map((item, index) => {
          return formatData(item, index, pageable.pageNumber, size);
        });
        setData(() => formattedContent);
        setTotalDataCount(totalElements);
        // setPage(pageable.pageNumber);
        setTotalPages(totalPages);
      } else {
        setData([]);
        setTotalDataCount(0);
      }
    };
    fetch();
    console.log(tableState);
  }, [debouncedTableState, page, size, refresh]);

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
  //   const handleAddCustomerBtn = () => {
  //     navigate({
  //       pathname: 'add',
  //     });
  //   };

  // 테이블 row onClick 이벤트
  //   const handleRowEvent = (e) => {
  //     navigate({
  //       pathname: `${e}`,
  //     });
  //   };

  return {
    HEADERS,
    ROW_HEIGHT,
    data,
    totalDataCount,
    tableState,
    dateRangeValue,
    totalPages,
    setTableState,
    handleChangeDateRangeValue,
    handleBulkCustomerManagementBtn,
    handleSendCouponBtn,
    // handleAddCustomerBtn,
    // handleRowEvent,
  };
};
