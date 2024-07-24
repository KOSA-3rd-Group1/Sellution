import { useState, useEffect } from 'react';
import axios from 'axios';

const useHome = () => {
  const [activeSlide, setActiveSlide] = useState(1);
  const [data, setData] = useState(null); // 데이터 상태 추가

  useEffect(() => {
    // API 요청 함수
    const fetchData = async () => {
      try {
        const companyId = 1; // 실제로 사용할 companyId 값 설정
        const response = await axios.get(`http://localhost:8080/display-setting/${companyId}`);
        setData(response.data);
        console.log('홈 화면 api 데이터 ', response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // 데이터 요청 함수 호출
  }, []); // 빈 배열을 두어 한 번만 실행되도록 설정

  useEffect(() => {
    const totalSlides =
      data && data.promotionImageUrls.length > 0 ? data.promotionImageUrls.length : 2;
    const interval = setInterval(() => {
      setActiveSlide((prevSlide) => (prevSlide === totalSlides ? 1 : prevSlide + 1));
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [data]);

  const handleSlideChange = (slide) => {
    setActiveSlide(slide);
  };

  return {
    activeSlide,
    handleSlideChange,
    data, // 데이터 상태 반환
  };
};

export default useHome;
