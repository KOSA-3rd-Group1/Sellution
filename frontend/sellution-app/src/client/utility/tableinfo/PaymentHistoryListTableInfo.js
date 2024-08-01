export const HEADERS = [
  {
    key: 'orderCode',
    label: '주문 번호',
    type: 'search',
    width: 'min-w-44 w-44 max-w-44',
  },
  {
    key: 'userName',
    label: '회원 아이디',
    type: 'search',
    width: 'min-w-44 w-44 max-w-44',
  },
  {
    key: 'paymentMethod',
    label: '결제 방법',
    type: 'none',
    width: 'min-w-40 w-40 max-w-40',
  },
  {
    key: 'price',
    label: '결제 가격',
    type: 'none',
    width: 'min-w-44 w-44 max-w-44',
  },
  {
    key: 'paymentDate',
    label: '결제 시간',
    type: 'none',
    width: 'min-w-52 w-52 max-w-52',
  },
  {
    key: 'remainingPayCount',
    label: '남은 결제 횟수',
    type: 'none',
    width: 'min-w-32 w-32 max-w-32',
  },
  {
    key: 'totalCountForPayment',
    label: '총 결제 횟수',
    type: 'none',
    width: 'min-w-32 w-32 max-w-32',
  },
  {
    key: 'status',
    label: '결제 상태',
    type: 'filter',
    options: ['결제완료', '결제실패', '결제취소'],
    width: 'min-w-44 w-44 max-w-44 text-brandOrange',
  },
];

export const ROW_HEIGHT = 'min-h-14 h-14 max-h-14';
