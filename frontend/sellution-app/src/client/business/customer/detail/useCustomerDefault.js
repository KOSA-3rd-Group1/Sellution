import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DUMMY = {
  name: '테스트회원명',
  username: 'testuser1234',
  phoneNumber: '01012345678',
  createdAt: '2024-07-17',
  type: '휴면',
  isInUse: '미이용중',
};

export const useCustomerDefault = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({});

  // 서버에 데이터 요청
  useEffect(() => {
    console.log(customerId);
    setData(DUMMY);
  }, []);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // 목록으로 이동
  const moveList = () => {
    navigate({
      pathname: '/customer',
    });
  };

  // 변경사항 적용
  const handleSaveData = () => {
    alert('변경사항 적용');
  };

  // 회원 삭제
  const handleDeleteData = () => {
    alert('회원 삭제');
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
