// usePreviousLocation.js
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const usePreviousLocation = () => {
  const location = useLocation();   //현재 브라우저의 위치 정보
  const prevLocationRef = useRef(null); //이전 위치 저장

  useEffect(() => {
    prevLocationRef.current = location; //현재 위치 정보가 변경될 때마다 값을 업데이트
  }, [location]);

  const getPreviousLocation = () => prevLocationRef.current; //현재 저장된 이전 위치를 반환

  return { getPreviousLocation };
};
