import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '@/client/store/stores/useAuthStore';
import { getOrderDetail } from '@/client/utility/apis/order/orderDetailApi';
import {
  formatOrderType,
  formatOrderStatus,
  formatPrice,
  formatPhoneNumber,
  convertAndSortDays,
  formatLocalDateTime,
} from '@/client/utility/functions/orderDetailFunction';

export const useCustomerOrderDetail = ({ moveToPathname }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const { cusotmerId, orderId } = useParams();

  const [data, setData] = useState({});

  const [serviceType, setServiceType] = useState(null);

  const [orderProductData, setOrderProductData] = useState([]);
  const [deliveryInfoData, setDeliveryInfoData] = useState(null);
  const [paymentInfoData, setPaymentInfoData] = useState();
  const [addressInfo, setAddressInfo] = useState({});
  const [ordererInfo, setOrdererInfo] = useState({});
  const [paymentMethod, setPaymentMethod] = useState({});

  // 주문 상세 조회 데이터 format
  const formatOrderProductData = useCallback(
    (item, type, status) => ({
      productImage: item.productImageList[0].imageUrl, // 이미지 정보
      productName: item.productName,
      count: item.count,
      type: type,
      price: formatPrice(item.price),
      discountRate: item.discountRate,
      discountedPrice: formatPrice(
        item.price - parseInt(parseInt(item.discountRate, 10) * parseInt(item.price) * 0.01, 10),
      ),
      status: status,
    }),
    [],
  );

  // 정기 배송 정보 데이터 format
  const formatDeliveryInfoData = useCallback(
    (item, type) => ({
      type, // 결제 단위
      subscriptionPeriod:
        item.type === 'MONTH_SUBSCRIPTION'
          ? `${item.selectedMonthOption} 개월`
          : `${item.totalDeliveryCount} 회`, // 이용 기간
      remainingDeliveryCount: `${item.remainingDeliveryCount} 회`, // 남은 배송 횟수
      regularDeliveryDate: `${item.selectedWeekOption}주 간격 / ${convertAndSortDays(item.selectedDayList)}`, // 정기 배송 날짜
      deliveryStartDate: item.deliveryStartDate, // 배송 시작일
      deliveryEndDate: item.deliveryEndDate, // 배송 종료일
      nextDeliveryDate: item.nextDeliveryDate, // 다음 배송 날짜
    }),
    [],
  );

  //   // 결제 정보 데이터 format (재현이에게)
  //   const formatPaymentInfoData = useCallback(
  //     (item) => ({
  //       totalPrice, // 총 주문 금액
  //       // 총 상품 금액
  //       // 총 배송비
  //       // 기본 배송비
  //       // 총 할인 금액
  //       // 쿠폰 할인 금액 없으면 -
  //       // 상품 할인 금액 없으면 -
  //       // 결제 금액 (총 주문 금액 - 총 할인 금액)
  //       // 결제 방식 CMS
  //     }),
  //     [],
  //   );

  // 배송지 정보 데이터 format
  const formatAddressInfo = useCallback(
    (item) => ({
      name: item.address.name, // 수령인
      zipcode: item.address.zipcode, // 우편번호
      address: `${item.address.address} ${item.address.addressDetail}`, // 배송지 주소
      phoneNumber: formatPhoneNumber(item.address.phoneNumber), // 수령인 전화번호
      addressName: item.address.addressName, // 배송지 명
    }),
    [],
  );

  // 주문자 정보 데이터 format
  const formatOrdererInfo = useCallback(
    (item) => ({
      name: item.customer.name, // 주문하시는 분
      phoneNumber: formatPhoneNumber(item.customer.phoneNumber), // 휴대폰 번호
    }),
    [],
  );

  // 결제 방법 정보 데이터 format
  const formatPaymentMethod = useCallback(
    (item, type) => ({
      paymentMethod: 'CMS', // 결제 방법
      perPrice:
        type === 'MONTH_SUBSCRIPTION'
          ? `매월 ${formatPrice(item.perPrice)}`
          : `총 ${formatPrice(item.totalPrice)}`, // 결제 금액 (정기 결제 금액)
    }),
    [],
  );

  // 서버에 데이터 요청
  useEffect(() => {
    const fetch = async (orderId, setAccessToken, accessToken) => {
      const response = await getOrderDetail(orderId, setAccessToken, accessToken);

      console.log('response >>>>>>>>>>>', response.data);

      setData({
        orderCode: response.data.orderCode,
        orderCreatedAt: formatLocalDateTime(response.data.orderCreatedAt),
      });
      const orderType = await formatOrderType(response.data.type);
      const orderStatus = await formatOrderStatus(response.data.status);

      // 서비스 유형
      setServiceType(response.data.type);

      // 주문 상세 조회 데이터
      const formattedOrderProducList = await response.data.orderedProductList.map((item) => {
        return formatOrderProductData(item, orderType, orderStatus);
      });
      setOrderProductData(formattedOrderProducList);

      // 정기 배송 정보 데이터
      if (response.data.type !== '"ONETIME"') {
        const formattedDeliveryInfoData = formatDeliveryInfoData(response.data, orderType);
        setDeliveryInfoData(formattedDeliveryInfoData);
      }

      // 배송지 정보 데이터 format
      const formattedAddresInfo = formatAddressInfo(response.data);
      setAddressInfo(formattedAddresInfo);

      // 주문자 정보 데이터 format
      const formattedOrdererInfo = formatOrdererInfo(response.data);
      setOrdererInfo(formattedOrdererInfo);

      // 결제 방법 정보 데이터
      const formattedPaymentMethod = formatPaymentMethod(response.data, response.data.type);
      setPaymentMethod(formattedPaymentMethod);
    };

    fetch(orderId, setAccessToken, accessToken);
  }, []);

  // 목록으로 이동
  const moveList = () => {
    moveToPathname(`/customer/${cusotmerId}/order`);
  };

  return {
    serviceType,
    orderProductData,
    deliveryInfoData,
    paymentInfoData,
    addressInfo,
    ordererInfo,
    paymentMethod,
    data,
    moveList,
  };
};
