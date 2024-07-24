import { useEffect, useState } from 'react';

// 더미 데이터 생성 함수
const generateDummyData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: 'testcompany',
    shopUrl: 'https://www.sellution.shop/shopping/testcompany/home',
    qrCode: `${Math.floor(10 + Math.random() * 90)}000`,
    isShopVisible: [true, false][Math.floor(Math.random() * 2)],
  }));
};

export const useShopManagementUrlSetting = () => {
  const [data, setData] = useState({});

  // 서버에 데이터 요청
  useEffect(() => {
    console.log(data);
    const newData = generateDummyData(1)[0];
    setData((prev) => ({ ...prev, ...newData }));
  }, []);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleChangeInputNameValue = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
      ['shopUrl']: `https://www.sellution.shop/shopping/${value}/home`,
    }));
  };

  // 등록
  const handleSaveData = () => {
    alert('변경사항 적용');
  };

  return {
    data,
    handleChangeInputValue,
    handleChangeInputNameValue,
    handleSaveData,
  };
};
