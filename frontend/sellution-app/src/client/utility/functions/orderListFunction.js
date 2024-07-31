// 회원 유형 변환 함수
export const formatOrderType = (type) => {
  const types = {
    ONETIME: '단건',
    MONTH_SUBSCRIPTION: '정기(월 단위)',
    COUNT_SUBSCRIPTION: '정기(횟수 단위)',
  };
  return types[type] || type;
};

// queryParams 변화
export const transformOrderType = (type) => {
  switch (type) {
    case 'ONETIME':
      return '단건';
    case 'MONTH_SUBSCRIPTION':
      return '정기(월 단위)';
    case 'COUNT_SUBSCRIPTION':
      return '정기(횟수 단위)';
    default:
      return 'ALL';
  }
};

// 회원 유형 변환 함수
export const formatOrderStatus = (type) => {
  const types = {
    HOLD: '승인대기',
    APPROVED: '승인',
    CANCEL: '주문취소',
  };
  return types[type] || type;
};

// queryParams 변화
export const transformOrderStatus = (type) => {
  switch (type) {
    case 'HOLD':
      return '승인대기';
    case 'APPROVED':
      return '승인';
    case 'CANCEL':
      return '주문취소';
    default:
      return 'ALL';
  }
};
