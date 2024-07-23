import { useState, useEffect } from 'react';

const useHome = () => {
  const [activeSlide, setActiveSlide] = useState(1);
  const totalSlides = 4;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prevSlide) => (prevSlide === totalSlides ? 1 : prevSlide + 1));
    }, 2000);
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 해제
  }, []);

  const handleSlideChange = (slide) => {
    setActiveSlide(slide);
  };

  return {
    activeSlide,
    handleSlideChange,
  };
};

export default useHome;
