import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 더미 데이터 생성 함수
const generateDummyData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    eventId: index + 1,
    id: index + 1,
    couponName: `user${index + 1}`,
    couponDiscountRate: `${Math.floor(10 + Math.random() * 50)}`,
    targetCustomerType: ['신규', '일반', '휴면'][Math.floor(Math.random() * 3)],
    maxDownloadCount: `${Math.floor(100 + Math.random() * 500)}`,
    eventDate:
      new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0] +
      '  ~  ' +
      new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    eventState: ['시작 전', '진행중', '종료'][Math.floor(Math.random() * 3)],
  }));
};

//eventId
//No
//couponName, 쿠폰 이름
//couponDiscountRate, 할인율(%)
//targetCustomerType, 적용회원 [신규 회원, 휴면 회원, 전체, 일반 회원] 0, 1, 2
//maxDownloadCount, 수량 [무제한, ]
//eventDate 이벤트 적용기간
//eventState, 진행 상태 [시작 전, 진행중, 종료]

// 이벤트 삭제, 이벤트 추가, 이벤트 상세 보기

//더미 데이터
const DUMMY_DATA = generateDummyData(10);

export const useEventList = () => {
  const HEADERS = [
    {
      key: 'couponName',
      label: '쿠폰 이름',
      width: 'min-w-56 w-56 max-w-56',
    },
    {
      key: 'couponDiscountRate',
      label: '할인율(%)',
      type: 'none',
      width: 'min-w-44 w-44 max-w-44',
    },
    {
      key: 'targetCustomerType',
      label: '적용회원',
      type: 'none',
      width: 'min-w-44 w-44 max-w-44',
    },
    {
      key: 'maxDownloadCount',
      label: '수량',
      type: 'none',
      width: 'min-w-44 w-44 max-w-44',
    },
    {
      key: 'eventDate',
      label: '이벤트 적용기간',
      type: 'none',
      width: 'min-w-80 w-80 max-w-80 text-brandOrange',
    },
    {
      key: 'eventState',
      label: '진행 상태',
      type: 'none',
      width: 'min-w-44 w-44 max-w-44 text-brandOrange',
    },
  ];

  const ROW_HEIGHT = 'min-h-14 h-14 max-h-14';

  const navigate = useNavigate();

  // 테이블 데이터
  const [data, setData] = useState([]);

  // 데이터 총 개수
  const [totalDataCount, setTotalDataCount] = useState(0);

  // 날짜 범위 조회
  const [dateRangeValue, setDateRangeValue] = useState({
    startDate: null,
    endDate: null,
  });

  // api 요청으로 데이터 받아오기
  useEffect(() => {
    setData(DUMMY_DATA);
    setTotalDataCount(100);
  }, []);

  // 날짜 범위 조회 핸들러
  const handleChangeDateRangeValue = (newDataRangeValue) => {
    console.log('newValue:', newDataRangeValue);
    setDateRangeValue(newDataRangeValue);
  };

  // 이벤트 삭제 버튼
  const handleDeleteBtn = () => {
    alert('이벤트 삭제 버튼 로직 로직');
  };

  // 이벤트 등록 버튼
  const handleAddBtn = () => {
    navigate({
      pathname: 'add',
    });
  };

  // 테이블 row onClick 이벤트
  const handleRowEvent = (e) => {
    navigate({
      pathname: `${e}`,
    });
  };

  return {
    HEADERS,
    ROW_HEIGHT,
    data,
    totalDataCount,
    dateRangeValue,
    handleChangeDateRangeValue,
    handleDeleteBtn,
    handleAddBtn,
    handleRowEvent,
  };
};
