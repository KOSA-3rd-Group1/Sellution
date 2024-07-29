import { useCallback, useEffect, useState } from 'react';
import useAuthStore from '@/client/store/stores/useAuthStore';
import {
  getDisplaySetting,
  putDisplaySetting,
} from '@/client/utility/apis/shopManagement/shopManagementDisplaySettingApi';
import { generateShortFileName } from '@/client/utility/functions/formatterFunction';
import { ValidationError } from '@/client/utility/error/ValidationError';

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

export const useShopManagementDisplaySetting = ({
  openAlertModal,
  openAutoCloseModal,
  closeAutoCloseModal,
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [data, setData] = useState({}); // 회사명, 프로모션 문구
  const [logoImg, setLogoImg] = useState([]); //로고 이미지
  const [selectedLogoImg, setSelectedLogoImg] = useState(null);
  const [promotionImg, setPromotionImg] = useState([]); // 프로모션 이미지
  const [selectedPromotionImg, setSelectedPromotionImg] = useState(null);

  console.log('logoImg>>>>', logoImg);
  console.log('slelctedlogoImg>>>>', selectedLogoImg);
  console.log('promotionImg>>>>', promotionImg);
  console.log('selectedPromotionImg>>>>', selectedPromotionImg);

  const [themeColor, setThemeColor] = useState({
    name: 'orange',
    textColor: 'text-orange-700',
    darkBgColor: 'bg-orange-900',
    midBgColor: 'bg-orange-300',
    lightBgColor: 'bg-orange-100',
  });
  const [serviceType, setServiceType] = useState('BOTH');

  const [isChange, setIsChange] = useState(false); // 변경상태 감지
  const [refresh, setRefresh] = useState(false);
  const [confirmType, setConfirmType] = useState('resetContent');

  const convertImageUrlToFileAndBlob = useCallback(async (imageUrl) => {
    try {
      // S3 버킷 URL을 프록시 URL로 변경
      const proxyUrl = `/s3-bucket${imageUrl}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const fileName = imageUrl.split('/').pop() || 'image.png';
      const newImages = {
        file: new File([blob], fileName, { type: blob.type }),
        preview: URL.createObjectURL(blob),
        id: Date.now() + Math.random(),
      };
      return newImages;
    } catch (error) {
      //   console.error('Error converting image:', error);
      return null;
    }
  }, []);

  // 서버에 데이터 요청
  useEffect(() => {
    const fetch = async (companyId, setAccessToken, accessToken) => {
      const response = await getDisplaySetting(companyId, setAccessToken, accessToken);
      setData(() => ({ ...response.data }));

      if (response.data.logoImageUrl) {
        const newImages = await convertImageUrlToFileAndBlob(response.data.logoImageUrl);
        setLogoImg(() => [newImages]);
        setSelectedLogoImg(() => ({ ...newImages }));
      }

      if (response.data.promotionImageUrls && response.data.promotionImageUrls.length !== 0) {
        const formattedContent = await Promise.all(
          response.data.promotionImageUrls.map((item) => convertImageUrlToFileAndBlob(item)),
        );
        setPromotionImg(() => [...formattedContent]);
        setSelectedPromotionImg(() => ({ ...formattedContent[0] }));
      }
    };

    const companyId = 1;
    fetch(companyId, setAccessToken, accessToken);

    setThemeColor(DUMMY.themeColor);
    setServiceType(DUMMY.serviceType);
  }, []);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
    // if (!isChange) setIsChange(true);
  };

  // promotionImg 변경 시 사항
  const handleChangePromotionImg = (images) => {
    console.log('Current images:', images);
    // if (!isChange) setIsChange(true);
    setPromotionImg(images);
  };

  //   logoImg 변경 시 사항
  const handleChangeLogoImg = (images) => {
    console.log('Current images:', images);
    setLogoImg(images);
    // if (!isChange) setIsChange(true);
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
  };

  // 초기화 여부 확인
  const checkResetContent = () => {
    if (isChange) {
      setConfirmType('resetContent');
      openAlertModal('warning', '주의', '변경 사항이 저장되지 않았습니다. 계속하시겠습니까?');
    } else {
      openAlertModal('success', '성공', '변경사항이 없습니다.');
    }
  };

  // 변경사항 적용 여부 확인
  const checkSaveContent = () => {
    if (isChange) {
      setConfirmType('saveContent');
      openAlertModal('warning', '주의', '변경사항을 적용하시겠습니까?');
    } else {
      openAlertModal('success', '성공', '변경사항이 없습니다.');
    }
  };

  // 등록
  const handleSaveData = async () => {
    try {
      const formData = new FormData();

      // requestDTO 데이터 추가
      console.log(data);
      Object.keys(data).forEach((key) => {
        if (key !== 'logoImageUrl' && key !== 'promotionImageUrls') {
          formData.append(key, data[key]);
        }
      });

      // 로고 파일 추가
      if (logoImg.length > 0 && logoImg[0].file) {
        const shortLogoName = generateShortFileName('logo', 0);
        formData.append('logoFile', logoImg[0].file, shortLogoName);
      }

      // 프로모션 파일들 추가
      promotionImg.forEach((item, index) => {
        if (item.file) {
          const shortPromotionName = generateShortFileName('promo', index);
          formData.append('promotionFiles', item.file, shortPromotionName);
        }
      });

      // FormData 내용 로깅 (디버깅 목적)
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
      }

      await putDisplaySetting(formData, setAccessToken, accessToken);
      console.log('Display settings updated successfully');
    } catch (error) {
      console.error('Error updating display settings:', error);
      // 에러 처리 로직 (예: 사용자에게 알림)
    }
  };

  // 이전 상태로 복구
  const handleRestoreData = () => {};

  return {
    data,
    logoImg,
    selectedLogoImg,
    promotionImg,
    selectedPromotionImg,
    themeColor,
    serviceType,
    setLogoImg,
    setSelectedLogoImg,
    setPromotionImg,
    setSelectedPromotionImg,
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
