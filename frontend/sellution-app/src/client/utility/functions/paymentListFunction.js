// 회원 유형 변환 함수
export const formatPaymentStatus = (type) => {
  const types = {
    COMPLETE: '결제완료',
    PENDING: '결제보류',
    CANCEL: '결제취소',
  };
  return types[type] || type;
};

// queryParams 변화
export const transformPaymentStatus = (type) => {
  switch (type) {
    case 'COMPLETE':
      return '결제완료';
    case 'PENDING':
      return '결제보류';
    case 'CANCEL':
      return '결제취소';
    default:
      return 'ALL';
  }
};
