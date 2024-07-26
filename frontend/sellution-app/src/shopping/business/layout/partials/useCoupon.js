//import axios from 'axios';
import useAuthStore from '@/shopping/store/stores/useAuthStore';
import { postCoupon } from '../../../utility/apis/home/eventApi';

const useCoupon = () => {

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const accessToken = useAuthStore((state) => state.accessToken);
  
  const handleDownload = async (eventId) => {
    try {
      const response = await postCoupon(eventId, accessToken, setAccessToken);
      //const response = await axios.post(`http://localhost:8080/events/${eventId}/coupons`);
      if (response.status === 200) {
        console.log('쿠폰이 성공적으로 다운로드되었습니다.');
        alert('쿠폰이 성공적으로 다운로드되었습니다.');
      } else {
        console.error('쿠폰 다운로드에 실패했습니다:', response);
      }
    } catch (error) {
      console.error('쿠폰 다운로드에 실패했습니다:', error);
    }
  };
  return {
    handleDownload,
  };
};

export default useCoupon;