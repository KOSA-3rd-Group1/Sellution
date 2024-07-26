// 회원 유형 변환 함수
export const formatCustomerType = (type) => {
  const types = {
    NEW: '신규',
    NORMAL: '일반',
    DORMANT: '휴면',
  };
  return types[type] || type;
};

//전화 번호 변환함수
export const formatPhoneNumber = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  return phone;
};

// queryParams 변화
export const transformCustomerType = (type) => {
  switch (type) {
    case 'NEW':
      return '신규';
    case 'NORMAL':
      return '일반';
    case 'DORMANT':
      return '휴면';
    default:
      return 'All';
  }
};

// queryParams 변화
export const transformLatestDeliveryDate = (type) => {
  switch (type) {
    case 'LATEST_DELIVERY_DATE_ASC':
      return '오름차순';
    case 'LATEST_DELIVERY_DATE_DESC':
      return '내림차순';
    default:
      return 'All';
  }
};
