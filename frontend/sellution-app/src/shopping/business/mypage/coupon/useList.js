import axios from 'axios';
import { useEffect, useState } from 'react';

const useList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/events/coupons');
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
