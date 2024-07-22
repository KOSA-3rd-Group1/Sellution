import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 더미 데이터 생성 함수
const generateDummyData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    paymentMethod: `CMS`,
    bank: `신한 은행`,
    accountNumber: `${Math.floor(100000 + Math.random() * 900000)}-01-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split('T')[0],
  }));
};

//더미 데이터
const DUMMY_DATA = generateDummyData(5);

export const useCustomerPaymentList = () => {
  const HEADERS = [
    {
      key: 'paymentMethod',
      label: '결제 수단',
      //   type: 'search',
      width: 'min-w-48 w-48 max-w-48',
    },
    {
      key: 'bank',
      label: '결제사',
      //   type: 'search',
      width: 'min-w-48 w-48 max-w-48',
    },
    {
      key: 'accountNumber',
      label: '계좌번호',
      //   type: 'search',
      width: 'min-w-56 w-56 max-w-56',
    },
    {
      key: 'createdAt',
      label: '등록일',
      //   type: 'sort',
      width: 'min-w-48 w-48 max-w-48',
    },
  ];

  const ROW_HEIGHT = 'min-h-14 h-14 max-h-14';

  const navigate = useNavigate();

  // 테이블 데이터
  const [data, setData] = useState([]);

  // 데이터 총 개수
  const [totalDataCount, setTotalDataCount] = useState(0);

  // api 요청으로 데이터 받아오기
  useEffect(() => {
    setData(DUMMY_DATA);
    setTotalDataCount(100);
  }, []);

  // 등록 버튼
  const handleAddBtn = () => {
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
    handleAddBtn,
    handleRowEvent,
    moveList,
  };
};
