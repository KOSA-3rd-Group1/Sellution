import { useEffect, useState } from 'react';

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

  return {
    data,
    totalDataCount,
    handleApproveAllSimpleOrderBtn,
    handleApproveSimpleOrderBtn,
  };
};

// 삭제 예정
