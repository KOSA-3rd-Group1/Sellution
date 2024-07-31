export const HEADERS = [
  {
    key: 'orderId',
    label: '주문 번호',
    type: 'search',
    width: 'min-w-44 w-44 max-w-44',
  },
  {
    key: 'customerUsername',
    label: '회원 아이디',
    type: 'search',
    width: 'min-w-44 w-44 max-w-44',
  },
  {
    key: 'paymentMethod',
    label: '결제 방법',
    type: 'none',
    width: 'min-w-44 w-44 max-w-44',
  },
  {
    key: 'price',
    label: '결제 가격',
    type: 'none',
    width: 'min-w-44 w-44 max-w-44',
  },
  {
    key: 'createdAt',
    label: '결제 시간',
    type: 'none',
    width: 'min-w-52 w-52 max-w-52',
  },
  {
    key: 'status',
    label: '결제 상태',
    type: 'filter',
    options: ['결제 완료', '결제 취소', '결제 실패'],
    width: 'min-w-44 w-44 max-w-44 text-brandOrange',
  },
];

export const ROW_HEIGHT = 'min-h-14 h-14 max-h-14';
