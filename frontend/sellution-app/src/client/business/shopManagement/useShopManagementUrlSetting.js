import { useEffect, useState } from 'react';
import useAuthStore from '@/client/store/stores/useAuthStore';
import {
  getUrlSetting,
  putUrlSetting,
} from '@/client/utility/apis/shopManagement/shopManagementUrlSettingApi';
import { ValidationError } from '@/client/utility/error/ValidationError';

export const useShopManagementUrlSetting = ({ openAlertModal }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [data, setData] = useState({});
  const [isChange, setIsChange] = useState(false); // 변경상태 감지
  const [refresh, setRefresh] = useState(false);
  const [confirmType, setConfirmType] = useState('resetContent');

  // 서버에 데이터 요청
  useEffect(() => {
    const fetch = async (companyId, setAccessToken, accessToken) => {
      const response = await getUrlSetting(companyId, setAccessToken, accessToken);
      console.log(response);
      setData(() => ({ ...response.data }));
    };

    const companyId = 1;
    fetch(companyId, setAccessToken, accessToken);
  }, [refresh]);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
    if (!isChange) setIsChange(true);
  };

  const handleChangeInputNameValue = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
      ['shopUrl']: `https://www.sellution.shop/shopping/${value}/home`,
    }));
    if (!isChange) setIsChange(true);
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

  // 변경 사항 초기화
  const handleResetData = () => {
    openAlertModal('success', '성공', '작업이 성공적으로 완료되었습니다.');
    setRefresh(!refresh);
  };

  // 변경사항 적용
  const handleSaveData = async () => {
    try {
      await putUrlSetting(data, setAccessToken, accessToken);
      openAlertModal('success', '성공', '변경사항이 성공적으로 적용되었습니다.');
    } catch (error) {
      if (error instanceof ValidationError) {
        openAlertModal('error', '오류', error.message);
      } else {
        openAlertModal('error', '오류', `${error.response.data.message}`);
        setRefresh(!refresh);
      }
    }
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

  const handleDownload = (imageUrl) => {
    const fileName = imageUrl.split('/').pop(); // 파일 이름 추출 (URL의 마지막 부분)

    const link = document.createElement('a'); // a 태그를 생성하고 설정
    link.href = imageUrl;
    link.download = fileName || 'qr_code.png'; // 파일 이름이 추출되지 않으면 기본값 사용
    link.target = '_blank'; // 일부 브라우저에서 필요할 수 있음

    document.body.appendChild(link); // 링크를 문서에 추가하고 클릭 이벤트를 발생시킨 후 제거
    link.click();
    document.body.removeChild(link);
  };

  return {
    data,
    handleChangeInputValue,
    handleChangeInputNameValue,
    checkResetContent,
    checkSaveContent,
    handleOnConfirm,
    handleDownload,
  };
};
