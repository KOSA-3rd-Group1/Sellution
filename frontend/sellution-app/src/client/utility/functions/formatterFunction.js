// 모든 하이픈 제거
export const accountNumberInServerFormat = (number) => {
  return number.replace(/-/g, '');
};

export const phoneNumberInServerFormat = (number) => {
  return number.replace(/-/g, '');
};

//전화 번호 변환함수 (서버 -> 클라이언트)
export const formatPhoneNumber = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  return phone;
};
