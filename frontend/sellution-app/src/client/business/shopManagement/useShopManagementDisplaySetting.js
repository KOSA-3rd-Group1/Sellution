import { useEffect, useState } from 'react';

const DUMMY = {
  displayName: '테스트 회사명',
  logoImg: '로고 이미지',
  promotionImg: ['프로모션 이미지1', '프로모션 이미지1', '프로모션 이미지1'],
  mainPromotion1Title: '함께, 건강하고 단건하게',
  mainPromotion1Content: '최고의 퀄리티를 위해 아끼지 않고 가득 담았습니다',
  mainPromotion2Title: '가정배송 서비스',
  mainPromotion2Content: '지금 로그인 해주세요!',
  themeColor: {
    name: 'orange',
    textColor: 'text-orange-700',
    darkBgColor: 'bg-orange-900',
    midBgColor: 'bg-orange-300',
    lightBgColor: 'bg-orange-100',
  },
  serviceType: 'ONETIME',
};

export const useShopManagementDisplaySetting = () => {
  const [data, setData] = useState({}); // 회사명, 프로모션 문구
  const [logoImg, setLogoImg] = useState(); //로고 이미지
  const [promotionImg, setPromotionImg] = useState([]); // 프로모션 이미지
  const [themeColor, setThemeColor] = useState({
    name: 'orange',
    textColor: 'text-orange-700',
    darkBgColor: 'bg-orange-900',
    midBgColor: 'bg-orange-300',
    lightBgColor: 'bg-orange-100',
  });
  const [serviceType, setServiceType] = useState('BOTH');

  // 서버에 데이터 요청
  useEffect(() => {
    console.log(data);
    setData((prev) => ({
      ...prev,
      displayName: DUMMY.displayName,
      mainPromotion1Title: DUMMY.mainPromotion1Title,
      mainPromotion1Content: DUMMY.mainPromotion1Content,
      mainPromotion2Title: DUMMY.mainPromotion2Title,
      mainPromotion2Content: DUMMY.mainPromotion2Content,
    }));
    setThemeColor(DUMMY.themeColor);
    setServiceType(DUMMY.serviceType);
  }, []);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // promotionImg 변경 시 사항
  const handleChangePromotionImg = (images) => {
    console.log('Current images:', images);
    setPromotionImg(images);
  };

  //   logoImg 변경 시 사항
  const handleChangeLogoImg = (images) => {
    console.log('Current images:', images);
    setLogoImg(images);
  };

  // themeColor 변경 시 사항
  const handleChangeThemeColor = (color) => {
    console.log('theme clolr:', color);
    setThemeColor(color);
  };

  // 이미지 업데이트 시 이벤트 (선택)
  const handleUploadSuccess = (newImages) => {
    console.log('Uploaded images:', newImages);
  };

  // 이미지 제거 전 이벤트 (선택)
  const handleBeforeRemove = (image, index) => {
    return window.confirm(`이미지를 제거하시겠습니까?`);
  };

  // 이미지 수정 전 이벤트 (선택)
  const handleEditImage = (updatedImage, index) => {
    return window.confirm(`이미지를 변경하시겠습니까?`);
    //   console.log('Updated image:', updatedImage, 'at index:', index);
  };

  // 등록
  const handleSaveData = () => {
    alert('변경사항 적용');
  };

  // 이전 상태로 복구
  const handleRestoreData = () => {};

  return {
    data,
    logoImg,
    promotionImg,
    themeColor,
    serviceType,
    handleChangeInputValue,
    handleChangePromotionImg,
    handleChangeLogoImg,
    handleChangeThemeColor,
    handleUploadSuccess,
    handleBeforeRemove,
    handleEditImage,
    handleRestoreData,
    handleSaveData,
  };
};
