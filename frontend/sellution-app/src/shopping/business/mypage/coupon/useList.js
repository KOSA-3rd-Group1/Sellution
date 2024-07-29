import axios from 'axios';
import { useEffect, useState } from 'react';
import { getMyCouponList } from './../../../utility/apis/mypage/coupon/couponApi';
import useAuthStore from '@/shopping/store/stores/useAuthStore';

const useList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const accessToken = useAuthStore((state) => state.accessToken);
  useEffect(() => {
    const fetchData = async () => {
      try {
        //const response = await axios.get('http://localhost:8080/events/coupons');
        const response = await getMyCouponList(accessToken, setAccessToken);
        setCoupons(response.data.content || []); // 페이지 응답에서 내용 추출
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { coupons, loading, error };
};

export default useList;
