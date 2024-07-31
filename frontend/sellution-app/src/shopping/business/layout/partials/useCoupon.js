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
        console.log('쿠폰이 다운로드 성공');
        alert('쿠폰이 성공적으로 다운로드되었습니다.');
      } else {
        console.error('쿠폰 다운로드에 실패했습니다:', response);
      }
    } catch (error) {
      if (error.response.data.message) {
        const errorMessage = error.response.data.message;
        alert(`${errorMessage}`);
      } else {
        console.log('여기야2222222', error);
        alert('쿠폰 다운로드에 실패했습니다. 고객센터에 문의하세요');
      }
    }
  };

  return {
    handleDownload,
  };
};

export default useCoupon;
