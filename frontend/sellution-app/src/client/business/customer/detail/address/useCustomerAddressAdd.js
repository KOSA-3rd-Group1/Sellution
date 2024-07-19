import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const useCustomerAddressAdd = () => {
  const { customerId, addressId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({});

  // 서버에 데이터 요청
  useEffect(() => {
    console.log(customerId, addressId);
    // setData(DUMMY);
  }, []);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // 목록으로 이동
  const moveList = () => {
    navigate({
      pathname: `/customer/${customerId}/address`,
    });
  };

  // 변경사항 적용
  const handleSaveData = () => {
    alert('변경사항 적용');
  };

  return {
    data,
    handleChangeInputValue,
    moveList,
    handleSaveData,
  };
};
