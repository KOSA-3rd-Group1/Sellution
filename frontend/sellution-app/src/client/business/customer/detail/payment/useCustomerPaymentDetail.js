import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DUMMY = {
  paymentMethod: 'CMS',
  bank: '신한 은행',
  accountNumber: `${Math.floor(100000 + Math.random() * 900000)}-01-${Math.floor(100000 + Math.random() * 900000)}`,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
    .toISOString()
    .split('T')[0],
  name: '홍길동',
};

export const useCustomerPaymentDetail = () => {
  const { customerId, paymentId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({});

  // 서버에 데이터 요청
  useEffect(() => {
    console.log(customerId, paymentId);
    setData(DUMMY);
  }, []);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // 목록으로 이동
  const moveList = () => {
    navigate({
      pathname: `/customer/${customerId}/payment`,
    });
  };

  // 변경사항 적용
  const handleSaveData = () => {
    alert('변경사항 적용');
  };

  // 회원 삭제
  const handleDeleteData = () => {
    alert('결제 수단 삭제');
    moveList();
  };

  return {
    data,
    handleChangeInputValue,
    moveList,
    handleSaveData,
    handleDeleteData,
  };
};
