import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 더미 데이터 생성 함수
const generateDummyData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `홍길동`,
    addressName: `회사`,
    address: '서울특별시 서초구 바우뫼로37길 30 (양재동), 1004동 1004호',
    zipcode: `${Math.floor(10000 + Math.random() * 90000)}`,
    phoneNumber: `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    isDefaultAddress: ['Y', 'N', 'N', 'N', 'N'][Math.floor(Math.random() * 5)],
  }));
};

//더미 데이터
const DUMMY_DATA = generateDummyData(5);

export const useCustomerAddressList = () => {
  const HEADERS = [
    {
      key: 'name',
      label: '수령인',
      width: 'min-w-44 w-44 max-w-44',
    },
    {
      key: 'addressName',
      label: '배송지명',
      width: 'min-w-44 w-44 max-w-44',
    },
    {
      key: 'address',
      label: '주소',
      width: 'min-w-[500px] w-[500px] max-w-[500px]',
    },
    {
      key: 'zipcode',
      label: '우편번호',
      width: 'min-w-36 w-36 max-w-36',
    },
    {
      key: 'phoneNumber',
      label: '휴대폰 번호',
      width: 'min-w-52 w-52 max-w-52',
    },
  ];

  const ROW_HEIGHT = 'min-h-14 h-14 max-h-14';

  const navigate = useNavigate();

  // 테이블 데이터
  const [data, setData] = useState([]);

  const defaultAddressObject = data.find((item) => item.isDefaultAddress === 'Y');

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
    defaultAddressObject,
    handleAddBtn,
    handleRowEvent,
    moveList,
  };
};
