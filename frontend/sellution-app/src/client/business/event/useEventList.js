import { useCallback, useEffect, useState } from 'react';
import useAuthStore from '@/client/store/stores/useAuthStore';
import { getEventList } from '@/client/utility/apis/event/eventListApi';
import {
  formatEventState,
  formatTargetCustomerType,
} from '@/client/utility/functions/eventListFunction';

export const useEventList = ({ page, size, refresh, updateQueryParameter }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [data, setData] = useState([]); // 테이블 데이터
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [totalDataCount, setTotalDataCount] = useState(0); // 데이터 총 개수

  // 날짜 범위 조회
  const [dateRangeValue, setDateRangeValue] = useState({
    startDate: null,
    endDate: null,
  });

  // formatData
  const formatData = useCallback(
    (content, index, page, size) => ({
      ...content,
      id: content.id,
      no: index + 1 + page * size,
      state: formatEventState(content.state),
      targetCustomerType: formatTargetCustomerType(content.targetCustomerType),
      eventDate: content.eventStartDate + '  ~  ' + content.eventEndDate,
    }),
    [],
  );

  // prepareSearchParams
  const prepareSearchParams = (page, size) => {
    const filteredCondition = {};
    if (dateRangeValue.startDate !== null) {
      filteredCondition['startDate'] = dateRangeValue.startDate;
    }

    if (dateRangeValue.endDate !== null) {
      filteredCondition['endDate'] = dateRangeValue.endDate;
    }

    // 페이징 정보 추가
    return {
      ...filteredCondition,
      page: page - 1, // 페이지는 0부터 시작하므로 1을 빼줍니다
      size: size,
    };
  };

  // api 요청으로 데이터 받아오기
  useEffect(() => {
    const fetch = async (setAccessToken, accessToken) => {
      const pageParam = prepareSearchParams(page, size);
      const response = await getEventList(pageParam, setAccessToken, accessToken);
      console.log(response);
      const { content, empty, pageable, totalElements, totalPages } = response.data;

      // 필터링 시 현재 페이지에 데이터가 없는 경우 1page로 이동
      if (empty && page > 1) {
        updateQueryParameter(pageParam, 1);
      }

      if (!empty) {
        const formattedContent = content.map((item, index) => {
          return formatData(item, index, pageable.pageNumber, size);
        });
        setData(() => formattedContent);
        setTotalDataCount(totalElements);
        setTotalPages(totalPages);
        updateQueryParameter(pageParam, page);
      } else {
        setData([]);
        setTotalDataCount(0);
        setTotalPages(1);
        updateQueryParameter(pageParam, 1);
      }
    };

    fetch(setAccessToken, accessToken);
  }, [dateRangeValue, page, refresh]);

  // 날짜 범위 조회 핸들러
  const handleChangeDateRangeValue = (newDataRangeValue) => {
    // console.log('newValue:', newDataRangeValue);
    setDateRangeValue(newDataRangeValue);
  };

  // 이벤트 삭제 버튼
  const handleDeleteBtn = () => {
    alert('이벤트 삭제 버튼 로직 로직');
  };

  return {
    data,
    totalPages,
    totalDataCount,
    dateRangeValue,
    handleChangeDateRangeValue,
    handleDeleteBtn,
  };
};
