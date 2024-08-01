// 주문 유형 변환 함수
export const formatPaymentStatus = (type) => {
  const types = {
    COMPLETE: '결제완료',
    PENDING: '결제실패',
    CANCEL: '결제취소',
  };
  return types[type] || type;
};

// queryParams 변화
export const transformPaymentStatus = (type) => {
  switch (type) {
    case '결제완료':
      return 'COMPLETE';
    case '결제실패':
      return 'PENDING';
    case '결제취소':
      return 'CANCEL';
    default:
      return 'All';
  }
};
