import { useState, useEffect } from 'react';
// import axios from 'axios';
import { getCompanyInfo } from '@/shopping/utility/apis/home/homeApi';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';

import { useParams, useNavigate } from 'react-router-dom';

const useHome = () => {
  const [activeSlide, setActiveSlide] = useState(1);
  const [data, setData] = useState(null); // 데이터 상태 추가
  const navigate = useNavigate();
  const { clientName } = useParams(); // url 상 clientName <- 회사명
  console.log("클라이언트 이름 ", clientName);

  // localstorage에서 관리되는 회사 정보
  // 추후 회사 정보가 필요한 작업에서 회사의 정보가 없다면 home으로 돌려보내야 합니다.
  const { name, getAllCompanyData, setAllCompanyData } = useCompanyInfoStore((state) => ({
    name: state.name,
    getAllCompanyData: state.getAllCompanyData,
    setAllCompanyData: state.setAllCompanyData,
  }));

  useEffect(() => {
    // API 요청 함수
    const fetchData = async (clientName, setAllCompanyData) => {
      try {
        const response = await getCompanyInfo(clientName, setAllCompanyData);
        // const companyId = 1; // 실제로 사용할 companyId 값 설정
        // const response = await axios.get(`http://localhost:8080/display-setting/${companyId}`);
        setData(response.data);
        console.log('홈 화면 api 데이터 ', response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (clientName.toLowerCase() != name.toLowerCase()) {
      fetchData(clientName, setAllCompanyData); // 데이터 요청 함수 호출
    } else {
      setData({ ...getAllCompanyData() });
      console.log('렌더링된 데이터', getAllCompanyData());
    }
  }, [clientName]); // 빈 배열을 두어 한 번만 실행되도록 설정 -> url의 clientName이 변경될 때마다 재 요청

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

  // event
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  useEffect(() => {
    const lastCloseDate = localStorage.getItem('popupClosedDate');
    const today = new Date().toISOString().split('T')[0];

    if (lastCloseDate === today) {
      setIsPopupOpen(false);
    }
  }, []);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleClosePopupForToday = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('popupClosedDate', today);
    setIsPopupOpen(false);
  };

  const moveToEventPage = () => {
    handleClosePopup();
    navigate(`/shopping/${clientName}/home/event`); // 이벤트 페이지로 이동
  };

  return {
    activeSlide,
    handleSlideChange,
    data, // 데이터 상태 반환
    isPopupOpen,
    handleClosePopup,
    handleClosePopupForToday,
    moveToEventPage,
  };
};

export default useHome;
