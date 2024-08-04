import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '@/client/store/stores/useAuthStore';
import useTableStore from '@/client/store/stores/useTableStore';
import { formatPrice } from '@/client/utility/functions/formatterFunction';
import { getCustomerOrderList } from '@/client/utility/apis/customer/detail/order/customerOrderListApi';
import {
  formatOrderType,
  formatOrderStatus,
  convertAndSortDays,
  formatLocalDateTime,
  formatDeliveryStatus,
} from '@/client/utility/functions/orderDetailFunction';
import {
  postApproveOrder,
  postCancleOrder,
} from '@/client/utility/apis/customer/detail/order/customerOrderListApi';

export const useCustomerOrderList = ({ openAlertModal }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const { tables, setSelectedRows, setSelectAll, clearTable } = useTableStore();

  const { customerId } = useParams();

  const [subscriptionData, setSubscriptionData] = useState([]); // 정기 배송 테이블 데이터
  const [subscriptionTotalDataCount, setSubscriptionTotalDataCount] = useState(0); // 정기 배송 데이터 총 개수

  const [onetimeData, setOnetimeData] = useState([]); // 단건 배송 테이블 데이터
  const [onetimeTotalDataCount, setOnetimeTotalDataCount] = useState(0); // 단건 배송 데이터 총 개수

  const [orderInfo, setOrderInfo] = useState({}); // 주문 취소를 위한 주문 데이터

  const [isDataChange, setIsDataChange] = useState(false);
  const [confirmType, setConfirmType] = useState('approveOrder');
  const [orderType, setOrderType] = useState('onetime'); // subscription
  const [selectedOrderId, setSelectedOrderId] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  // 수정 필요
  const formatData = useCallback(
    (content) => ({
      //   ...content,
      id: content.orderId,
      orderCreatedAt: formatLocalDateTime(content.orderCreatedAt),
      orderCode: content.orderCode,
      orderedProduct:
        content.orderedProductList?.length > 1
          ? `${content.orderedProductList[0].productName} ... 외 ${content.orderedProductList?.length - 1}건`
          : `${content.orderedProductList[0].productName}`,
      totalPrice: formatPrice(content.totalPrice),
      status: formatOrderStatus(content.status),
      deliveryStatus: formatDeliveryStatus(content.deliveryStatus),
      orderType: formatOrderType(content.type),
      dayOption: `${content.selectedWeekOption}주 간격 / ${convertAndSortDays(content.selectedDayList)}`,
      subscriptionPeriod:
        content.type === 'MONTH_SUBSCRIPTION'
          ? `${content.selectedMonthOption} 개월`
          : `${content.totalDeliveryCount} 회`, // 이용 기간
      totalDeliveryCount: `${content.totalDeliveryCount} 회`, // 남은 배송 횟수
      deliveryStartDate: content.deliveryStartDate,
      deliveryEndDate: content.deliveryEndDate,
    }),
    [],
  );

  //수정 필요
  const separateData = async (content) => {
    const { newOntimeData, newSubscriptionData } = await content.reduce(
      (acc, item) => {
        const newItem = formatData(item);
        if (item.type === 'ONETIME') {
          acc.newOntimeData.push(newItem);
        } else {
          acc.newSubscriptionData.push(newItem);
        }
        return acc;
      },
      { newOntimeData: [], newSubscriptionData: [] },
    );

    setSubscriptionData(() => newSubscriptionData);
    setSubscriptionTotalDataCount(newSubscriptionData.length);

    setOnetimeData(() => newOntimeData);
    setOnetimeTotalDataCount(newOntimeData.length);
  };

  // api 요청으로 데이터 받아오기
  useEffect(() => {
    const fetch = async (customerId, setAccessToken, accessToken) => {
      const response = await getCustomerOrderList(customerId, setAccessToken, accessToken);
      const { content, empty, pageable, totalElements, totalPages } = response.data;

      if (!empty) {
        separateData(content);

        const newOrderInfo = { onetime: {}, subscription: {} };
        content.forEach((item) => {
          if (item.type === 'ONETIME') {
            newOrderInfo['onetime'][item.orderId] = {
              customerId: item.customer.id,
              accountId: item.accountId,
            };
          } else {
            newOrderInfo['subscription'][item.orderId] = {
              customerId: item.customer.id,
              accountId: item.accountId,
            };
          }
        });
        setOrderInfo(() => ({ ...newOrderInfo }));
      }
    };

    fetch(customerId, setAccessToken, accessToken);

    return () => {
      clearTable('onetime');
      clearTable('subscription');
    };
  }, [isDataChange]);

  // 간편 주문 승인 일괄 처리(수정 필요)

  // 간편 주문 승인 일괄 처리 여부 확인
  const checkAppoveOrderAll = (tableId) => {
    if (tables !== undefined && tables[tableId] !== undefined && tables[tableId]?.selectedRows) {
      const hasTrueValue = Object.values(tables[tableId].selectedRows).some(
        (value) => value === true,
      );
      if (hasTrueValue) {
        setConfirmType('approveOrder');
        setOrderType(tableId);

        openAlertModal('warning', '주의', '선택한 주문들을 승인하시겠습니까?');
        return;
      }
    }
  };

  // 간편 주문 승인 처리 여부 확인
  const checkAppoveOrderOne = (orderId) => {
    setConfirmType('approveOrderOne');
    setSelectedOrderId(orderId);

    openAlertModal('warning', '주의', '선택한 주문을 승인하시겠습니까?');
  };

  // 주문 취소 일괄 처리 여부 확인
  const checkCancleOrder = (tableId) => {
    if (tables !== undefined && tables[tableId] !== undefined && tables[tableId]?.selectedRows) {
      const hasTrueValue = Object.values(tables[tableId].selectedRows).some(
        (value) => value === true,
      );
      if (hasTrueValue) {
        setConfirmType('cancleOrder');
        setOrderType(tableId);

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

    const approvePromises = Object.entries(tables[orderType].selectedRows).map(
      async ([key, value]) => {
        if (value) {
          try {
            await postApproveOrder(key, setAccessToken, accessToken);
            successCnt += 1;
          } catch (err) {
            errorCnt += 1;
          }
        }
      },
    );

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

  // 간편 주문 승인 처리
  const handleApproveOneSimpleOrder = async () => {
    try {
      setIsLoading(true);
      const startTime = Date.now();

      const approvePromises = await postApproveOrder(selectedOrderId, setAccessToken, accessToken);

      await Promise.all([
        approvePromises,
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

      openAlertModal('success', '성공', '작업이 성공적으로 완료되었습니다.');
    } catch (error) {
      setIsLoading(false);

      openAlertModal(
        'error',
        '오류',
        `${error.response.data.message}` ||
          '알 수 없는 오류가 발생했습니다. 반복적으로 문제가 발생하는 경우, 지원팀에 문의해 주세요.',
      );
    }
  };

  // 주문 취소 일괄 처리
  const handleCancleAllOrder = async () => {
    setIsLoading(true);
    const startTime = Date.now();

    let successCnt = 0;
    let errorCnt = 0;

    const approvePromises = Object.entries(tables[orderType].selectedRows).map(
      async ([key, value]) => {
        if (value) {
          try {
            await postCancleOrder(key, orderInfo[orderType][key], setAccessToken, accessToken);
            successCnt += 1;
          } catch (err) {
            errorCnt += 1;
          }
        }
      },
    );

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
      case 'approveOrderOne':
        handleApproveOneSimpleOrder();
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
    subscriptionData,
    subscriptionTotalDataCount,
    onetimeData,
    onetimeTotalDataCount,
    isLoading,
    checkAppoveOrderAll,
    checkAppoveOrderOne,
    checkCancleOrder,
    handleOnConfirm,
  };
};
