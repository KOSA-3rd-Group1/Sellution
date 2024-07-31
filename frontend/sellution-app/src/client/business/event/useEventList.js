import { useCallback, useEffect, useState } from 'react';
import useAuthStore from '@/client/store/stores/useAuthStore';
import { getEventList } from '@/client/utility/apis/event/eventListApi';
import {
  formatEventState,
  formatTargetCustomerType,
} from '@/client/utility/functions/eventListFunction';

// 더미 데이터 생성 함수
// const generateDummyData = (count) => {
//   return Array.from({ length: count }, (_, index) => ({
//     eventId: index + 1,
//     id: index + 1,
//     couponName: `user${index + 1}`,
//     couponDiscountRate: `${Math.floor(10 + Math.random() * 50)}`,
//     targetCustomerType: ['신규', '일반', '휴면'][Math.floor(Math.random() * 3)],
//     maxDownloadCount: `${Math.floor(100 + Math.random() * 500)}`,
//     eventDate:
//       new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0] +
//       '  ~  ' +
//       new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
//     state: ['시작 전', '진행중', '종료'][Math.floor(Math.random() * 3)],
//   }));
// };

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
// const DUMMY_DATA = generateDummyData(10);

export const useEventList = ({ page, size, refresh, updateQueryParameter }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  // 테이블 데이터
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
    console.log('newValue:', newDataRangeValue);
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
