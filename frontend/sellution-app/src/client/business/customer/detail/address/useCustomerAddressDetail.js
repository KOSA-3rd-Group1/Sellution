import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DUMMY = {
  name: '테스트회원명',
  zipcode: '12345',
  address: '서울특별시 서초구 바우뫼로37길 30 (양재동)',
  addressDetail: '테스트 상세 주소',
  phoneNumber: '01012345678',
  addressName: '테스트배송지명',
};

export const useCustomerAddressDetail = () => {
  const { customerId, addressId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({});

  // 서버에 데이터 요청
  useEffect(() => {
    console.log(customerId, addressId);
    setData(DUMMY);
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

  // 배송지 삭제
  const handleDeleteData = () => {
    alert('배송지 삭제');
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
