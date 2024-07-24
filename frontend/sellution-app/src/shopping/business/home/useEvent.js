import { useState, useEffect } from 'react';
import axios from 'axios';

const useEvent = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/events/company/1');
        setCoupons(response.data || []); // 데이터가 없을 경우 빈 배열로 설정
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

export default useEvent;
