import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '@/client/store/stores/useAuthStore';
import useTableStore from '@/client/store/stores/useTableStore';
import { getCustomerOrderList } from '@/client/utility/apis/customer/detail/order/customerOrderListApi';

// 더미 데이터 생성 함수
const generateDummyDataSubscriptionData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split('T')[0],
    orderId: `${Math.floor(10000000 + Math.random() * 90000000)}`,
    productInfo: '[no.131] light melange gray ... 외 3',
    totalPrice: `${Math.floor(100000 + Math.random() * 900000)}`,
    type: ['정기(횟수 단위)', '정기(월 단위)'][Math.floor(Math.random() * 2)],
    status: ['승인 대기', '주문 승인'][Math.floor(Math.random() * 2)],
    dayOption: `${Math.floor(1 + Math.random() * 4)}주 간격 (월 / 금)`,
    totalDeliveryCount: `${Math.floor(1 + Math.random() * 9)}`,
    dateOption: `${Math.floor(1 + Math.random() * 12)}개월`,
    deliveryStartDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split('T')[0],
    deliveryEndDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split('T')[0],
  }));
};

// 더미 데이터 생성 함수
const generateDummyOneTimeOrderData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split('T')[0],
    orderId: `${Math.floor(10000000 + Math.random() * 90000000)}`,
    productInfo: '[no.131] light melange gray ... 외 3',
    totalPrice: `${Math.floor(100000 + Math.random() * 900000)}`,
    type: ['정기(횟수 단위)', '정기(월 단위)'][Math.floor(Math.random() * 2)],
    status: ['승인 대기', '주문 승인'][Math.floor(Math.random() * 2)],
    deliveryStartDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split('T')[0],
    deliveryEndDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split('T')[0],
  }));
};

//더미 데이터
const DUMMY_DATA_SUBSCRIPTION = generateDummyDataSubscriptionData(10);
const DUMMY_DATA_ONETIME = generateDummyOneTimeOrderData(10);

export const useCustomerOrderList = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const { tables, setSelectedRows, setSelectAll } = useTableStore();

  const { customerId } = useParams();

  const [subscriptionData, setSubscriptionData] = useState([]); // 정기 배송 테이블 데이터
  const [subscriptionTotalDataCount, setSubscriptionTotalDataCount] = useState(0); // 정기 배송 데이터 총 개수

  const [onetimeData, setOnetimeData] = useState([]); // 단건 배송 테이블 데이터
  const [onetimeTotalDataCount, setOnetimeTotalDataCount] = useState(0); // 단건 배송 데이터 총 개수

  // 수정 필요
  const formatData = useCallback(
    (content) => ({
      ...content,
      id: content.orderId,
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
      }

      // 아래 더미데이터 제거 예정
      setSubscriptionData(DUMMY_DATA_SUBSCRIPTION);
      setOnetimeData(DUMMY_DATA_ONETIME);

      setSubscriptionTotalDataCount(10);
      setOnetimeTotalDataCount(10);
    };

    fetch(customerId, setAccessToken, accessToken);
  }, []);

  // 간편 주문 승인 이벤트
  // 간편 주문 승인 일관 승인 시, 선택한 항목 하나씩 서버로 api 요청, 이후 응답받아서 성공하면 해당하는 데이터만 변경
  const handleApproveAllSimpleOrderBtn = (tableId) => {
    console.log(tables[tableId]);
    alert('간편 주문 일괄 승인');
  };

  // 간편 주문 승인 이벤트
  // 간편 주문 승인 시, 서버로 api 요청, 이후 응답 받아서 성공하면 해당 데이터 변경
  const handleApproveSimpleOrderBtn = (orderId) => {
    console.log('간편주문', orderId);

    alert(`간편 주문 승인 ${orderId}`);
  };

  const handleSelectedRows = (selectedRows) => {
    console.log(selectedRows);
  };

  return {
    subscriptionData,
    subscriptionTotalDataCount,
    onetimeData,
    onetimeTotalDataCount,
    handleApproveAllSimpleOrderBtn,
    handleApproveSimpleOrderBtn,
    handleSelectedRows,
  };
};
