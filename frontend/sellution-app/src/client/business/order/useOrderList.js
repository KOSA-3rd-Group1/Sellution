import { useCallback, useEffect, useState } from 'react';
import useDebounce from '@/client/business/common/useDebounce';
import useAuthStore from '@/client/store/stores/useAuthStore';
import useUserInfoStore from '@/client/store/stores/useUserInfoStore';
import useTableStore from '@/client/store/stores/useTableStore';
import {
  getOrderList,
  postApproveOrder,
  postAutoApproveToggle,
  postCancleOrder,
} from '@/client/utility/apis/order/orderListApi';
import { formatPhoneNumber } from '@/client/utility/functions/formatterFunction';
import {
  formatOrderType,
  formatOrderStatus,
  formatDeliveryStatus,
  transformOrderType,
  transformOrderStatus,
  transformDeliveryStatus,
} from '@/client/utility/functions/orderListFunction';
import { HEADERS } from '@/client/utility/tableinfo/CustomerListTableInfo';

export const useOrderList = ({
  queryParams,
  page,
  size,
  refresh,
  updateQueryParameter,
  openAlertModal,
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const companyId = useUserInfoStore((state) => state.companyId);

  const { isAutoApproved, setIsAutoApproved } = useUserInfoStore((state) => ({
    isAutoApproved: state.isAutoApproved,
    setIsAutoApproved: state.setIsAutoApproved,
  }));

  const { tables, setSelectedRows, setSelectAll, clearTable } = useTableStore((state) => ({
    tables: state.tables.orderlist,
    setSelectedRows: state.setSelectedRows,
    setSelectAll: state.setSelectAll,
    clearTable: state.clearTable,
  }));

  const [data, setData] = useState([]); // 테이블 데이터
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [totalDataCount, setTotalDataCount] = useState(0); // 데이터 총 개수
  const [orderInfo, setOrderInfo] = useState({}); // 주문 취소를 위한 주문 데이터
  //   const [holdCount, setHoldCount] = useState(0);
  const [isDataChange, setIsDataChange] = useState(false);
  const [confirmType, setConfirmType] = useState('approveOrder');

  const [isLoading, setIsLoading] = useState(false);

  // 테이블 상태 관리 - 검색, 필터, 정렬 기능
  const [tableState, setTableState] = useState(
    HEADERS.reduce((acc, header) => {
      const value = queryParams.get(header.key);
      switch (header.key) {
        case 'orderType':
          acc[header.key] = value ? formatOrderType(value) : 'All';
          break;
        case 'status':
          acc[header.key] = value ? formatOrderStatus(value) : 'All';
          break;
        case 'deliveryStatus':
          acc[header.key] = value ? formatDeliveryStatus(value) : 'All';
          break;
        default:
          acc[header.key] = value || '';
          break;
      }
      return acc;
    }, {}),
  );

  // 날짜 범위 조회
  const [dateRangeValue, setDateRangeValue] = useState({
    startDate: null,
    endDate: null,
  });

  // 디바운스된 테이블 상태
  const debouncedTableState = useDebounce(tableState, 300);

  // formatData (수정 필요)
  const formatData = useCallback(
    (content, index, page, size) => ({
      id: content.orderId,
      no: index + 1 + page * size, // No.
      orderCode: content.orderCode, // 주문 번호
      customerName: content.customer.name, // 회원명
      customerPhoneNumber: formatPhoneNumber(content.customer.phoneNumber), // 휴대폰 번호
      orderCreatedAt: content.orderCreatedAt.split('T')[0],
      deliveryStartDate: content.deliveryStartDate, // 주문 시작일
      deliveryEndDate: content.deliveryEndDate, // 주문 종료일
      orderedProduct:
        content.orderedProductList?.length > 1
          ? `${content.orderedProductList[0].productName} ... 외 ${content.orderedProductList?.length - 1}건`
          : `${content.orderedProductList[0].productName}`,
      orderType: formatOrderType(content.type),
      status: formatOrderStatus(content.status),
      deliveryStatus: formatDeliveryStatus(content.deliveryStatus),
    }),
    [],
  );

  const prepareSearchParams = (searchCondition, page, size) => {
    const filterAndTransform = (obj) => {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        switch (key) {
          case 'orderType':
            if (value) {
              const transformValue = transformOrderType(value);
              if (transformValue !== 'All') acc[key] = transformValue;
            }
            break;
          case 'status':
            if (value) {
              const transformValue = transformOrderStatus(value);
              if (transformValue !== 'All') acc[key] = transformValue;
            }
            break;
          case 'deliveryStatus':
            if (value) {
              const transformValue = transformDeliveryStatus(value);
              if (transformValue !== 'All') acc[key] = transformValue;
            }
            break;
          case 'orderCode':
            if (value !== null && value.trim() !== '') acc[key] = parseInt(value, 10);
            break;
          case 'customerName':
          case 'customerPhoneNumber':
            if (value !== null && value.trim() !== '') acc[key] = value;
            break;
          default:
            break;
        }
        return acc;
      }, {});
    };

    // searchCondition 객체 필터링
    const filteredCondition = filterAndTransform(searchCondition);
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
    const fetch = async (companyId, setAccessToken, accessToken) => {
      const pageParam = prepareSearchParams(tableState, page, size);
      const responseData = await getOrderList(companyId, pageParam, setAccessToken, accessToken); // API 요청

      const { content, empty, pageable, totalElements, totalPages } = responseData.data;

      // 필터링 시 현재 페이지에 데이터가 없는 경우 1page로 이동
      if (empty && page > 1) {
        updateQueryParameter(pageParam, 1);
      }

      if (!empty) {
        const formattedContent = content.map((item, index) => {
          return formatData(item, index, pageable.pageNumber, size);
        });
        const newOrderInfo = {};
        content.forEach((item) => {
          newOrderInfo[item.orderId] = {
            customerId: item.customer.id,
            accountId: item.accountId,
          };
        });
        // const updateHoldCount = content.filter((item) => item.status === 'HOLD').length;

        setOrderInfo(() => ({ ...newOrderInfo }));
        setData(() => formattedContent);
        setTotalDataCount(totalElements);
        setTotalPages(totalPages);
        // setHoldCount(updateHoldCount);
        updateQueryParameter(pageParam, page);
      } else {
        setData([]);
        setTotalDataCount(0);
        setTotalPages(1);
        // setHoldCount(0);
        updateQueryParameter(pageParam, 1);
      }
    };

    fetch(companyId, setAccessToken, accessToken);

    return () => {
      clearTable('orderlist');
    };
  }, [debouncedTableState, dateRangeValue, page, refresh, isDataChange]);

  // 날짜 범위 조회 핸들러
  const handleChangeDateRangeValue = (newDataRangeValue) => {
    setDateRangeValue(newDataRangeValue);
  };

  // 필터 초기화
  const handleFilterReset = (tableId) => {
    setTableState({});
    clearTable(tableId);
  };

  // 자동 주문 승인 핸들러 - API 요청
  const handleToggleAutoOrderApproved = async () => {
    try {
      await postAutoApproveToggle(companyId, setAccessToken, accessToken);
      await setIsAutoApproved(!isAutoApproved);
    } catch (error) {
      //   console.log(error);
    }
  };

  // 간편 주문 승인 일괄 처리 여부 확인
  const checkAppoveOrder = () => {
    if (tables !== undefined && tables?.selectedRows !== undefined) {
      const hasTrueValue = Object.values(tables?.selectedRows).some((value) => value === true);
      if (hasTrueValue) {
        setConfirmType('approveOrder');
        openAlertModal('warning', '주의', '선택한 주문들을 승인하시겠습니까?');
        return;
      }
    }
    openAlertModal('error', '오류', '선택한 주문이 없습니다.');
  };

  // 간편 주문 취소 일괄 처리 여부 확인
  const checkCancleOrder = () => {
    if (tables !== undefined && tables?.selectedRows !== undefined) {
      const hasTrueValue = Object.values(tables?.selectedRows).some((value) => value === true);
      if (hasTrueValue) {
        setConfirmType('cancleOrder');
        openAlertModal('warning', '주의', '선택한 주문들을 취소하시겠습니까?');
        return;
      }
    }
    openAlertModal('error', '오류', '선택한 주문이 없습니다.');
  };

  // 간편 주문 승인 일괄 처리
  const handleApproveAllSimpleOrder = async () => {
    setIsLoading(true);
    const startTime = Date.now();

    let successCnt = 0;
    let errorCnt = 0;

    const approvePromises = Object.entries(tables.selectedRows).map(async ([key, value]) => {
      if (value) {
        try {
          await postApproveOrder(key, setAccessToken, accessToken);
          successCnt += 1;
        } catch (err) {
          errorCnt += 1;
        }
      }
    });

    await Promise.all([
      Promise.all(approvePromises),
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

    openAlertModal('success', '승인 완료', `성공 : ${successCnt}, 실패 : ${errorCnt}`);
  };

  // 주문 취소 일괄 처리
  const handleCancleAllOrder = async () => {
    setIsLoading(true);
    const startTime = Date.now();

    let successCnt = 0;
    let errorCnt = 0;

    const approvePromises = Object.entries(tables.selectedRows).map(async ([key, value]) => {
      if (value) {
        try {
          await postCancleOrder(key, orderInfo[key], setAccessToken, accessToken);
          successCnt += 1;
        } catch (err) {
          errorCnt += 1;
        }
      }
    });

    await Promise.all([
      Promise.all(approvePromises),
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

    openAlertModal('success', '취소 완료', `성공 : ${successCnt}, 실패 : ${errorCnt}`);
  };

  // handle onConfirm
  const handleOnConfirm = () => {
    switch (confirmType) {
      case 'approveOrder':
        handleApproveAllSimpleOrder();
        break;
      case 'cancleOrder':
        handleCancleAllOrder();
        break;
      default:
        // moveList();
        break;
    }
  };

  return {
    data,
    // holdCount,
    totalPages,
    totalDataCount,
    tableState,
    dateRangeValue,
    isAutoApproved,
    isLoading,
    setTableState,
    handleChangeDateRangeValue,
    handleFilterReset,
    handleToggleAutoOrderApproved,
    checkAppoveOrder,
    checkCancleOrder,
    handleOnConfirm,
  };
};
