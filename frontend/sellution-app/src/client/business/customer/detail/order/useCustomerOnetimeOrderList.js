import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 더미 데이터 생성 함수
const generateDummyData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split('T')[0],
    orderId: `${Math.floor(10000000 + Math.random() * 90000000)}`,
    productInfo: '[no.131] light melange gray ... 외 3',
    totalPrice: `${Math.floor(100000 + Math.random() * 900000)}`,
    type: ['정기(횟수 단위)', '정기(월 단위)'][Math.floor(Math.random() * 2)],
    status: ['승인 대기', '주문 승인'][Math.floor(Math.random() * 2)],
    deliveryStartDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split('T')[0],
    deliveryEndDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split('T')[0],
  }));
};

//더미 데이터
const DUMMY_DATA = generateDummyData(3);

export const useCustomerOnetimeOrderList = () => {
  const HEADERS = [
    {
      key: 'createdAt',
      label: '주문일',
      width: 'min-w-40 w-40 max-w-40',
    },
    {
      key: 'orderId',
      label: '주문번호',
      width: 'min-w-44 w-44 max-w-44',
    },
    {
      key: 'productInfo',
      label: '상품 정보',
      width: 'min-w-72 w-72 max-w-72',
    },
    {
      key: 'totalPrice',
      label: '총금액',
      width: 'min-w-40 w-40 max-w-40',
    },
    {
      key: 'type',
      label: '주문 유형', // 정기(월 단위) <-MONTH_SUBSCRIPTION, 정기(횟수 단위) <- COUNT_SUBSRIPTION
      width: 'min-w-40 w-40 max-w-40',
    },
    {
      key: 'status', //주문 승인 여부
      label: '주문 상태',
      width: 'min-w-48 w-48 max-w-48 text-brandOrange',
    },
    {
      key: 'deliveryStartDate',
      label: '배송 시작일',
      width: 'min-w-40 w-40 max-w-40',
    },
    {
      key: 'deliveryEndDate',
      label: '배송 종료일',
      width: 'min-w-40 w-40 max-w-40',
    },
  ];

  const ROW_HEIGHT = 'min-h-12 h-12 max-h-12';

  const navigate = useNavigate();

  // 정기 배송 테이블 데이터
  const [data, setData] = useState([]);

  // 정기 배송 데이터 총 개수
  const [totalDataCount, setTotalDataCount] = useState(0);

  // api 요청으로 데이터 받아오기 (작업해야 할 부분)
  useEffect(() => {
    setData(DUMMY_DATA);
    setTotalDataCount(10);
  }, []);

  // 간편 주문 승인 이벤트 (작업해야 할 부분: 간편 주문 승인 일관 승인 시, 서버로 api 요청, 이후 응답받아서 성공하면 해당하는 데이터만 변경)
  const handleApproveAllSimpleOrderBtn = () => {
    alert('간편 주문 일괄 승인');
  };

  // 간편 주문 승인 이벤트 (작업해야 할 부분: 간편 주문 승인 시, 서버로 api 요청, 이후 응답 받아서 성공하면 해당 데이터 변경)
  const handleApproveSimpleOrderBtn = (orderId) => {
    alert(`간편 주문 승인 ${orderId}`);
  };

  // 테이블 row onClick 이벤트
  const handleRowEvent = (e) => {
    navigate({
      pathname: `${e}`,
    });
  };

  const moveList = () => {
    navigate({
      pathname: '/customer',
    });
  };

  return {
    HEADERS,
    ROW_HEIGHT,
    data,
    totalDataCount,
    handleApproveAllSimpleOrderBtn,
    handleApproveSimpleOrderBtn,
    handleRowEvent,
    moveList,
  };
};
