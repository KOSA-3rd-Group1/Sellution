// 회원 유형 변환 함수
export const formatCustomerType = (type) => {
  const types = {
    NEW: '신규',
    NORMAL: '일반',
    DORMANT: '휴면',
  };
  return types[type] || type;
};

// queryParams 변화
export const transformCustomerType = (type) => {
  switch (type) {
    case '신규':
      return 'NEW';
    case '일반':
      return 'NORMAL';
    case '휴면':
      return 'DORMANT';
    default:
      return 'All';
  }
};

// 회원 유형 변환 함수
export const formatLatestDeliveryDate = (type) => {
  const types = {
    LATEST_DELIVERY_DATE_ASC: '오름차순',
    LATEST_DELIVERY_DATE_DESC: '내림차순',
  };
  return types[type] || type;
};

// queryParams 변화
export const transformLatestDeliveryDate = (type) => {
  switch (type) {
    case '오름차순':
      return 'LATEST_DELIVERY_DATE_ASC';
    case '내림차순':
      return 'LATEST_DELIVERY_DATE_DESC';
    default:
      return 'All';
  }
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
