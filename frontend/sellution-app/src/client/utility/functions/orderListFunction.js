// 주문 유형 변환 함수
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
    case '단건':
      return 'ONETIME';
    case '정기(월 단위)':
      return 'MONTH_SUBSCRIPTION';
    case '정기(횟수 단위)':
      return 'COUNT_SUBSCRIPTION';
    default:
      return 'All';
  }
};

// 주문 상태 변환 함수
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
    case '승인대기':
      return 'HOLD';
    case '승인':
      return 'APPROVED';
    case '주문취소':
      return 'CANCEL';
    default:
      return 'All';
  }
};

// 배송 상태 변환 함수
export const formatDeliveryStatus = (type) => {
  const types = {
    BEFORE_DELIVERY: '배송전',
    IN_PROGRESS: '배송중',
    COMPLETE: '배송완료',
  };
  return types[type] || type;
};

// queryParams 변화
export const transformDeliveryStatus = (type) => {
  switch (type) {
    case '배송전':
      return 'BEFORE_DELIVERY';
    case '배송중':
      return 'IN_PROGRESS';
    case '배송완료':
      return 'COMPLETE';
    default:
      return 'All';
  }
};
