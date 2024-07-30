import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import useAuthStore from '@/client/store/stores/useAuthStore';
import {
  deleteEventDetail,
  getEventDetail,
  putEventDetail,
} from '../../utility/apis/event/eventDetailApi';

// 더미 데이터 생성 함수
const generateDummyData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    eventId: index + 1,
    id: index + 1,
    couponName: `user${index + 1}`,
    couponDiscountRate: `${Math.floor(10 + Math.random() * 50)}`,
    targetCustomerType: ['신규', '일반', '휴면'][Math.floor(Math.random() * 3)],
    maxDownloadCount: `${Math.floor(100 + Math.random() * 500)}`,
    startDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split('T')[0],
    endDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split('T')[0],
    eventState: ['시작 전', '진행중', '종료'][Math.floor(Math.random() * 3)],
  }));
};

export const useEventDetail = () => {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const { eventId } = useParams();

  const [data, setData] = useState({});

  // 서버에 데이터 요청
  useEffect(() => {
    const fetch = async (eventId, setAccessToken, accessToken) => {
      const response = await getEventDetail(eventId, setAccessToken, accessToken);
      console.log(response);
      setData(response.data);
    };

    fetch(eventId, setAccessToken, accessToken);

    // const DUMMY_DATA = generateDummyData(1)[0];
    // setData((prev) => ({
    //   ...prev,
    //   id: DUMMY_DATA.id,
    //   couponName: DUMMY_DATA.couponName,
    //   targetCustomerType: DUMMY_DATA.targetCustomerType,
    //   couponDiscountRate: DUMMY_DATA.couponDiscountRate,
    //   maxDownloadCountCheck: DUMMY_DATA.maxDownloadCount == null ? 0 : 1,
    //   maxDownloadCount: DUMMY_DATA.maxDownloadCount != null ? DUMMY_DATA.maxDownloadCount : '',
    //   startDate: DUMMY_DATA.startDate,
    //   endDate: DUMMY_DATA.endDate,
    // }));
  }, []);

  // 변경 가능한 값 변경 handler
  const handleChangeInputValue = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // 목록으로 이동
  const moveList = () => {
    navigate({
      pathname: '/event',
    });
  };

  // 변경사항 적용
  const handleSaveData = async () => {
    const updateData = {
      couponName: data.couponName,
      eventEndDate: data.eventEndDate,
    };
    await putEventDetail(eventId, updateData, setAccessToken, accessToken);
    alert('변경사항 적용');
  };

  // 이벤트 삭제
  const handleDeleteData = async () => {
    await deleteEventDetail(eventId, setAccessToken, accessToken);
    alert('이벤트 삭제');
    moveList();
  };

  return {
    data,
    handleChangeInputValue,
    moveList,
    handleSaveData,
    handleDeleteData,
  };
};
