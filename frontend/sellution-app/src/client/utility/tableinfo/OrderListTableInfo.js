export const HEADERS = [
  {
    key: 'orderCode',
    label: '주문 번호',
    type: 'search',
    width: 'min-w-48 w-48 max-w-48',
  },
  {
    key: 'username',
    label: '회원 아이디',
    type: 'search',
    width: 'min-w-44 w-44 max-w-44',
  },
  {
    key: 'name',
    label: '회원명',
    type: 'search',
    width: 'min-w-44 w-44 max-w-44',
  },
  {
    key: 'phoneNumber',
    label: '휴대폰 번호',
    type: 'search',
    width: 'min-w-52 w-52 max-w-52',
  },
  {
    key: 'createdAt',
    label: '주문 등록일',
    type: 'none',
    width: 'min-w-36 w-36 max-w-36',
  },
  {
    key: 'product',
    label: '상품',
    type: 'none',
    width: 'min-w-56 w-56 max-w-56',
  },
  {
    key: 'type',
    label: '주문 유형',
    type: 'filter',
    options: ['단건', '정기 (월 단위)', '정기 (횟수 단위)'],
    width: 'min-w-40 w-40 max-w-40 text-brandOrange',
  },
  {
    key: 'status',
    label: '주문 상태',
    type: 'filter',
    options: ['승인 대기', '주문 승인', '주문 취소'],
    width: 'min-w-40 w-40 max-w-40 text-brandOrange',
  },
];

export const ROW_HEIGHT = 'min-h-14 h-14 max-h-14';
