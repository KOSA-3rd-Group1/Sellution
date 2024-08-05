import { useCallback, useEffect, useState } from 'react';
import useAuthStore from '@/client/store/stores/useAuthStore';
import useUserInfoStore from '@/client/store/stores/useUserInfoStore';
import {
  getDisplaySetting,
  putDisplaySetting,
} from '@/client/utility/apis/shopManagement/shopManagementDisplaySettingApi';
import {
  generateShortFileName,
  generateShortFileName2,
} from '@/client/utility/functions/formatterFunction';
import { ValidationError } from '@/client/utility/error/ValidationError';

// const DUMMY = {
//   displayName: '테스트 회사명',
//   logoImg: '로고 이미지',
//   promotionImg: ['프로모션 이미지1', '프로모션 이미지1', '프로모션 이미지1'],
//   mainPromotion1Title: '함께, 건강하고 단건하게',
//   mainPromotion1Content: '최고의 퀄리티를 위해 아끼지 않고 가득 담았습니다',
//   mainPromotion2Title: '가정배송 서비스',
//   mainPromotion2Content: '지금 로그인 해주세요!',
//   //   themeColor: {
//   //     name: 'orange',
//   //     textColor: 'text-orange-700',
//   //     darkBgColor: 'bg-orange-900',
//   //     midBgColor: 'bg-orange-300',
//   //     lightBgColor: 'bg-orange-100',
//   //   },
//   themeColor: { name: 'Blue' },
//   serviceType: 'ONETIME',
// };

export const useShopManagementDisplaySetting = ({
  openAlertModal,
  openAutoCloseModal,
  closeAutoCloseModal,
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const companyId = useUserInfoStore((state) => state.companyId);

  const [data, setData] = useState({}); // 회사명, 프로모션 문구
  const [logoImg, setLogoImg] = useState([]); //로고 이미지
  const [selectedLogoImg, setSelectedLogoImg] = useState(null);
  const [promotionImg, setPromotionImg] = useState([]); // 프로모션 이미지
  const [selectedPromotionImg, setSelectedPromotionImg] = useState(null);

  const [isChange, setIsChange] = useState(false); // 변경상태 감지
  const [refresh, setRefresh] = useState(false);
  const [confirmType, setConfirmType] = useState('resetContent');

  const [isLoading, setIsLoading] = useState(false);

  // const convertImageUrlToFileAndBlob = useCallback(async (imageUrl) => {
  //   try {
  //     // S3 버킷 URL을 프록시 URL로 변경
  //     const proxyUrl = `/s3-bucket${imageUrl}`;
  //     //   const proxyUrl = `${imageUrl}`;
  //     const response = await fetch(proxyUrl);
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const blob = await response.blob();
  //     const fileName = imageUrl.split('/').pop() || 'image.png';
  //     const newImages = {
  //       file: new File([blob], fileName, { type: blob.type }),
  //       preview: URL.createObjectURL(blob),
  //       id: Date.now() + Math.random(),
  //     };
  //     return newImages;
  //   } catch (error) {
  //     //   console.error('Error converting image:', error);
  //     return null;
  //   }
  // }, []);

  const convertImageUrlToFileAndBlob = useCallback(async (imageUrl) => {
    try {
      // S3 버킷 URL을 프록시 URL로 변경
      //   const proxyUrl = `/s3-bucket${imageUrl}`;
      //   const proxyUrl = `${imageUrl}`;
      //   const response = await fetch(proxyUrl);
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // URL에서 파일 이름 추출
      const urlParts = imageUrl.split('/');
      let fileName = urlParts[urlParts.length - 1];

      //   // 파일 이름에 확장자가 없으면 .png 추가
      //   if (!fileName.toLowerCase().endsWith('.png')) {
      //     fileName += '.png';
      //   }

      const blob = await response.blob();
      //   const fileName = imageUrl.split('/').pop() || 'image.png';
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

    fetch(companyId, setAccessToken, accessToken);
  }, [refresh]);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
    if (!isChange) setIsChange(true);
  };

  // promotionImg 변경 시 사항
  const handleChangePromotionImg = (images) => {
    // console.log('Current images:', images);
    setPromotionImg(images);
    if (!isChange) setIsChange(true);
  };

  // logoImg 변경 시 사항
  const handleChangeLogoImg = (images) => {
    // console.log('Current images:', images);
    setLogoImg(images);
    if (!isChange) setIsChange(true);
  };

  // 이미지 업데이트 시 이벤트 (선택)
  const handleUploadSuccess = (newImages) => {
    // console.log('Uploaded images:', newImages);
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
      if (!data.displayName) {
        throw ValidationError('회사명 입력은 필수입니다.');
      } else if (promotionImg?.length === 0) {
        throw ValidationError('프로모션 이미지는 1개 이상 등록해야 합니다.');
      }

      setIsLoading(true);
      const startTime = Date.now();

      const formData = new FormData();

      // requestDTO 데이터 추가
      Object.keys(data).forEach((key) => {
        if (key !== 'logoImageUrl' && key !== 'promotionImageUrls') {
          formData.append(key, data[key]);
        }
      });

      // 로고 파일 추가
      if (logoImg.length > 0 && logoImg[0].file) {
        const shortLogoName = generateShortFileName2('logo', 0, logoImg[0].file);
        // const shortLogoName = generateShortFileName('logo', 0);
        formData.append('logoFile', logoImg[0].file, shortLogoName);
      }

      // 프로모션 파일들 추가
      promotionImg.forEach((item, index) => {
        if (item.file) {
          const shortPromotionName = generateShortFileName2('promo', index, item.file);
          //   const shortPromotionName = generateShortFileName('promo', index);
          formData.append('promotionFiles', item.file, shortPromotionName);
        }
      });

      // FormData 내용 로깅 (디버깅 목적)
      //   for (let [key, value] of formData.entries()) {
      //     console.log(`${key}: ${value instanceof File ? value.name : value}`);
      //   }

      const approvePromise = await putDisplaySetting(formData, setAccessToken, accessToken);

      await Promise.all([
        approvePromise,
        new Promise((resolve) => setTimeout(resolve, 1000)), // 최소 1초 대기
      ]);

      const endTime = Date.now();
      const elapsedTime = endTime - startTime;

      if (elapsedTime < 1000) {
        // 1초 미만으로 걸렸다면, 남은 시간만큼 더 대기
        await new Promise((resolve) => setTimeout(resolve, 1000 - elapsedTime));
      }

      setIsLoading(false);
      setIsChange(false);
      setRefresh(!refresh);

      openAlertModal('success', '성공', '변경사항이 성공적으로 적용되었습니다.');
    } catch (error) {
      if (error instanceof ValidationError) {
        openAlertModal('error', '오류', error.message);
      } else {
        openAlertModal('error', '오류', `${error.response.data.message}`);
      }
      setIsChange(false);
      setRefresh(!refresh);
    }
  };

  // 이전 상태로 복구
  const handleResetData = () => {
    openAlertModal('success', '성공', '작업이 성공적으로 완료되었습니다.');
    setIsChange(false);
    setRefresh(!refresh);
  };

  // handle onConfirm
  const handleOnConfirm = () => {
    switch (confirmType) {
      case 'saveContent':
        handleSaveData();
        break;
      case 'resetContent':
      default:
        handleResetData();
        break;
    }
  };

  return {
    data,
    logoImg,
    selectedLogoImg,
    promotionImg,
    selectedPromotionImg,
    isLoading,
    setLogoImg,
    setSelectedLogoImg,
    setPromotionImg,
    setSelectedPromotionImg,
    handleChangeInputValue,
    handleChangePromotionImg,
    handleChangeLogoImg,
    handleUploadSuccess,
    handleBeforeRemove,
    handleEditImage,
    checkResetContent,
    checkSaveContent,
    handleOnConfirm,
  };
};
