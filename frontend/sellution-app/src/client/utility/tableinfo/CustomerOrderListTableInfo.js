export const SUBSCRIPTION_HEADERS = [
  {
    key: 'orderCreatedAt',
    label: '주문일',
    width: 'min-w-44 w-44 max-w-44',
  },
  {
    key: 'orderCode',
    label: '주문번호',
    width: 'min-w-44 w-44 max-w-44',
  },
  {
    key: 'orderedProduct',
    label: '상품 정보',
    width: 'min-w-72 w-72 max-w-72',
  },
  {
    key: 'totalPrice',
    label: '총금액',
    width: 'min-w-40 w-40 max-w-40',
  },
  {
    key: 'orderType',
    label: '주문 유형', // 정기(월 단위) <-MONTH_SUBSCRIPTION, 정기(횟수 단위) <- COUNT_SUBSRIPTION
    width: 'min-w-40 w-40 max-w-40',
  },
  {
    key: 'status', //주문 승인 여부
    label: '주문 상태',
    width: 'min-w-40 w-40 max-w-40 text-brandOrange',
  },
  {
    key: 'deliveryStatus', // 배송 상태
    label: '배송 상태',
    width: 'min-w-40 w-40 max-w-40 text-brandOrange',
  },
  {
    key: 'dayOption', // 선택한 요일
    label: '배송 주기',
    width: 'min-w-40 w-40 max-w-40',
  },
  {
    key: 'subscriptionPeriod', // 월 또는 주 단위 정기 주문
    label: '구독 기간',
    width: 'min-w-40 w-40 max-w-40',
  },
  {
    key: 'totalDeliveryCount', // 횟수 단위 정기 주문
    label: '총 배송 횟수',
    width: 'min-w-40 w-40 max-w-40',
  },
  {
    key: 'deliveryStartDate',
    label: '배송 시작일',
    width: 'min-w-40 w-40 max-w-40',
  },
  {
    key: 'deliveryEndDate',
    label: '배송 종료일',
    width: 'min-w-40 w-40 max-w-40',
  },
];

export const SUBSCRIPTION_ROW_HEIGHT = 'min-h-12 h-12 max-h-12';

export const ONETIME_HEADERS = [
  {
    key: 'orderCreatedAt',
    label: '주문일',
    width: 'min-w-44 w-44 max-w-44',
  },
  {
    key: 'orderCode',
    label: '주문번호',
    width: 'min-w-44 w-44 max-w-44',
  },
  {
    key: 'orderedProduct',
    label: '상품 정보',
    width: 'min-w-72 w-72 max-w-72',
  },
  {
    key: 'totalPrice',
    label: '총금액',
    width: 'min-w-40 w-40 max-w-40',
  },
  {
    key: 'orderType',
    label: '주문 유형', // 정기(월 단위) <-MONTH_SUBSCRIPTION, 정기(횟수 단위) <- COUNT_SUBSRIPTION
    width: 'min-w-40 w-40 max-w-40',
  },
  {
    key: 'status', //주문 승인 여부
    label: '주문 상태',
    width: 'min-w-40 w-40 max-w-40 text-brandOrange',
  },
  {
    key: 'deliveryStatus', // 배송 상태
    label: '배송 상태',
    width: 'min-w-40 w-40 max-w-40 text-brandOrange',
  },
  {
    key: 'deliveryStartDate',
    label: '배송 시작일',
    width: 'min-w-40 w-40 max-w-40',
  },
  {
    key: 'deliveryEndDate',
    label: '배송 종료일',
    width: 'min-w-40 w-40 max-w-40',
  },
];

export const ONETIME_ROW_HEIGHT = 'min-h-12 h-12 max-h-12';
