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
} from '@/client/utility/functions/orderDetailFunction';
import {
  postApproveOrder,
  postCancleOrder,
} from '@/client/utility/apis/customer/detail/order/customerOrderListApi';

export const useCustomerOrderList = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const { tables, setSelectedRows, setSelectAll, clearTable } = useTableStore();

  const { customerId } = useParams();

  const [subscriptionData, setSubscriptionData] = useState([]); // 정기 배송 테이블 데이터
  const [subscriptionTotalDataCount, setSubscriptionTotalDataCount] = useState(0); // 정기 배송 데이터 총 개수

  const [onetimeData, setOnetimeData] = useState([]); // 단건 배송 테이블 데이터
  const [onetimeTotalDataCount, setOnetimeTotalDataCount] = useState(0); // 단건 배송 데이터 총 개수

  const [orderInfo, setOrderInfo] = useState({}); // 주문 취소를 위한 주문 데이터
  console.log(orderInfo);

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
      orderType: formatOrderType(content.type),
      status: formatOrderStatus(content.status),
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
        console.log(content);
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
  }, []);

  // 간편 주문 승인 이벤트
  // 간편 주문 승인 일관 승인 시, 선택한 항목 하나씩 서버로 api 요청, 이후 응답받아서 성공하면 해당하는 데이터만 변경
  //   const handleApproveAllSimpleOrderBtn = (tableId) => {
  //     console.log(tables[tableId]);
  //     alert('간편 주문 일괄 승인');
  //   };

  // 간편 주문 승인 이벤트
  // 간편 주문 승인 시, 서버로 api 요청, 이후 응답 받아서 성공하면 해당 데이터 변경
  //   const handleApproveSimpleOrderBtn = (orderId) => {
  //     console.log('간편주문', orderId);

  //     alert(`간편 주문 승인 ${orderId}`);
  //   };

  //   const handleSelectedRows = (selectedRows) => {
  //     console.log(selectedRows);
  //   };

  // 간편 주문 승인 일괄 처리(수정 필요)
  const handleApproveAllSimpleOrderBtn = async (tableId) => {
    if (tables !== undefined && tables[tableId] !== undefined) {
      //   total
      console.log('이것이 테이블 아이디다', tableId, tables[tableId]);
      Object.entries(tables[tableId].selectedRows).forEach(async ([key, value]) => {
        if (value) {
          await handleApproveSimpleOrder(key);
        }
      });
      alert('간편 주문 일괄 승인');
    } else {
      alert('없음');
    }
    // 모달로 처리
  };

  // 간편 주문 승인 개별 처리
  const handleApproveOneSimpleOrderBtn = async (orderId) => {
    await handleApproveSimpleOrder(orderId);
    alert('간편 승인');
  };

  // 간편 주문 승인
  const handleApproveSimpleOrder = async (orderId) => {
    try {
      await postApproveOrder(orderId, setAccessToken, accessToken);
      //     alert(`간편 주문 승인 ${orderId}`);
    } catch (error) {
      console.log(error);
    }
  };

  // 주문 승인 일괄 처리
  const handleApproveCancleAll = async (tableId) => {
    if (tables !== undefined && tables[tableId] !== undefined) {
      Object.entries(tables[tableId].selectedRows).forEach(([key, value]) => {
        if (value) {
          console.log(tableId, key, orderInfo);
          handleApproveCancle(key, orderInfo[tableId][key]);
        }
      });
      alert('간편 주문 일괄 승인');
    } else {
      alert('없음');
    }
  };

  // 주문 승인 취소
  const handleApproveCancle = async (orderId, data) => {
    try {
      await postCancleOrder(orderId, data, setAccessToken, accessToken);
    } catch (error) {
      console.log(error);
    }
  };
  return {
    subscriptionData,
    subscriptionTotalDataCount,
    onetimeData,
    onetimeTotalDataCount,
    handleApproveAllSimpleOrderBtn,
    handleApproveOneSimpleOrderBtn,
    handleApproveCancleAll,
    // handleApproveSimpleOrderBtn,
    // handleSelectedRows,
  };
};
