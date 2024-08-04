export const HEADERS = [
  {
    key: 'customerUsername',
    label: '회원 아이디',
    type: 'search',
    width: 'min-w-44 w-44 max-w-44',
  },
  {
    key: 'customerName',
    label: '회원명',
    type: 'search',
    width: 'min-w-44 w-44 max-w-44',
  },
  {
    key: 'customerPhoneNumber',
    label: '휴대폰 번호',
    type: 'search',
    width: 'min-w-52 w-52 max-w-52',
  },
  {
    key: 'customerCreatedAt',
    label: '가입일',
    type: 'none',
    width: 'min-w-36 w-36 max-w-36',
  },
  {
    key: 'customerType',
    label: '회원 유형',
    type: 'filter',
    options: ['신규', '일반', '휴면'],
    width: 'min-w-36 w-36 max-w-36 text-brandOrange',
  },
  //   {
  //     key: 'latestDeliveryDate',
  //     label: '최신 주문 일자',
  //     type: 'filter',
  //     options: ['오름차순', '내림차순'],
  //     width: 'min-w-36 w-36 max-w-36 text-brandOrange',
  //   },
];

export const ROW_HEIGHT = 'min-h-14 h-14 max-h-14';
