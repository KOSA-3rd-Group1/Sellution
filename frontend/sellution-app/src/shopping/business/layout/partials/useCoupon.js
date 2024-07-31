import useAuthStore from '@/shopping/store/stores/useAuthStore';
import { postCoupon } from '../../../utility/apis/home/eventApi';
import { useLocation, useNavigate } from 'react-router-dom';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';

const useCoupon = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const accessToken = useAuthStore((state) => state.accessToken);
  const clientName = useCompanyInfoStore((state) => state.name);

  const handleDownload = async (eventId) => {
    if (accessToken === null || accessToken === '') {
      navigate(`/shopping/${clientName}/login`, {
        state: { from: location.pathname },
      });
      return;
    }
    try {
      const response = await postCoupon(eventId, accessToken, setAccessToken);
      if (response.status === 200) {
        console.log('쿠폰이 성공적으로 다운로드되었습니다.');
        alert('쿠폰이 성공적으로 다운로드되었습니다.');
      } else {
        console.error('쿠폰 다운로드에 실패했습니다:', response);
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = getErrorMessage(error.response.data);
        console.log('여기야2', errorMessage);
        alert(`쿠폰 다운로드에 실패했습니다: ${errorMessage}`);
      } else {
        console.log('여기야2', error.message);
        alert('쿠폰 다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  const getErrorMessage = (data) => {
    switch (data.code) {
      case 4000:
        return '토큰이 만료되었습니다. 다시 로그인해주세요.';
      case 4001:
        return '지원하지 않는 JWT 형식입니다.';
      case 4002:
        return 'JWT 구조가 유효하지 않습니다.';
      case 4003:
        return 'JWT 서명이 유효하지 않습니다.';
      case 4004:
        return 'JWT claims 문자열이 비었습니다.';
      case 4005:
        return 'Refresh Token이 존재하지 않습니다.';
      case 4006:
        return 'SMS 인증 대기 시간입니다.';
      case 4007:
        return '제한된 요청 횟수를 초과하였습니다.';
      case 4008:
        return '유효하지 않은 인증번호입니다.';
      case 4009:
        return '유효하지 않은 요청입니다.';
      case 4010:
        return '요청이 만료되었습니다.';
      case 4011:
        return '기존에 사용한 이력이 있는 비밀번호입니다.';
      // Add more cases as needed for different error codes
      default:
        return '알 수 없는 오류가 발생했습니다.';
    }
  };

  return {
    handleDownload,
  };
};

export default useCoupon;
