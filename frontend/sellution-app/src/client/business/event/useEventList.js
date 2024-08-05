import { useCallback, useEffect, useState } from 'react';
import useAuthStore from '@/client/store/stores/useAuthStore';
import useTableStore from '@/client/store/stores/useTableStore';
import { getEventList, deleteEventList } from '@/client/utility/apis/event/eventListApi';
import {
  formatEventState,
  formatTargetCustomerType,
} from '@/client/utility/functions/eventListFunction';

export const useEventList = ({ page, size, refresh, updateQueryParameter, openAlertModal }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const { tables, setSelectedRows, setSelectAll, clearTable } = useTableStore((state) => ({
    tables: state.tables.eventlist,
    setSelectedRows: state.setSelectedRows,
    setSelectAll: state.setSelectAll,
    clearTable: state.clearTable,
  }));

  const [data, setData] = useState([]); // 테이블 데이터
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [totalDataCount, setTotalDataCount] = useState(0); // 데이터 총 개수

  const [isDataChange, setIsDataChange] = useState(false);
  const [confirmType, setConfirmType] = useState('deleteEvent');

  const [isLoading, setIsLoading] = useState(false);

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

    return () => {
      clearTable('eventlist');
    };
  }, [dateRangeValue, page, refresh, isDataChange]);

  // 날짜 범위 조회 핸들러
  const handleChangeDateRangeValue = (newDataRangeValue) => {
    setDateRangeValue(newDataRangeValue);
  };

  // 이벤트 삭제 여부 확인
  const checkDeleteEvent = () => {
    if (tables !== undefined && tables?.selectedRows !== undefined) {
      const hasTrueValue = Object.values(tables?.selectedRows).some((value) => value === true);
      if (hasTrueValue) {
        setConfirmType('deleteEvent');
        openAlertModal('warning', '주의', '선택한 이벤트들을 삭제하시겠습니까?');
        return;
      }
    }
    openAlertModal('error', '오류', '선택한 이벤트가 없습니다.');
  };

  // 이벤트 삭제
  const handleDeleteEvent = async () => {
    setIsLoading(true);
    const startTime = Date.now();

    let successCnt = 0;
    let errorCnt = 0;

    const deletePromises = Object.entries(tables.selectedRows).map(async ([key, value]) => {
      if (value) {
        try {
          await deleteEventList(key, setAccessToken, accessToken);
          successCnt += 1;
        } catch (err) {
          errorCnt += 1;
        }
      }
    });

    await Promise.all([
      Promise.all(deletePromises),
      new Promise((resolve) => setTimeout(resolve, 1000)), // 최소 1초 대기
    ]);

    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    if (elapsedTime < 1000) {
      // 1초 미만으로 걸렸다면, 남은 시간만큼 더 대기
      await new Promise((resolve) => setTimeout(resolve, 1000 - elapsedTime));
    }

    setIsLoading(false);
    setIsDataChange(!isDataChange);

    openAlertModal('success', '작업 완료', `성공 : ${successCnt}, 실패 : ${errorCnt}`);
  };

  // handle onConfirm
  const handleOnConfirm = () => {
    switch (confirmType) {
      case 'deleteEvent':
        handleDeleteEvent();
        break;
      default:
        break;
    }
  };

  return {
    data,
    isLoading,
    totalPages,
    totalDataCount,
    dateRangeValue,
    handleChangeDateRangeValue,
    checkDeleteEvent,
    handleOnConfirm,
  };
};
