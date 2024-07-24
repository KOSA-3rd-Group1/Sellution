import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const selectTargetCustomerType = [
  { value: '0', label: '신규' },
  { value: '1', label: '일반' },
  { value: '2', label: '휴면' },
];

export const useEventAdd = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [selectedTargetCustomerType, setSelectedTargetCustomerType] = useState();

  // 서버에 데이터 요청
  useEffect(() => {
    console.log(data);
  }, []);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // 목록으로 이동
  const moveList = () => {
    navigate({
      pathname: '/event',
    });
  };

  // 변경사항 적용
  const handleSaveData = () => {
    alert('변경사항 적용');
  };

  // 적용 회원 변경
  const handleChangeSelectedTargetCustomerType = (selectedOption) => {
    setSelectedTargetCustomerType(selectedOption);
  };

  return {
    data,
    selectTargetCustomerType,
    selectedTargetCustomerType,
    handleChangeInputValue,
    handleChangeSelectedTargetCustomerType,
    moveList,
    handleSaveData,
  };
};
