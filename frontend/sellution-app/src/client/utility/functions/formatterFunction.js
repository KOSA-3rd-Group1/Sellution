// 모든 하이픈 제거
export const accountNumberInServerFormat = (number) => {
  return number.replace(/-/g, '');
};

// 전화 번호 변환함수 (클라이언트 -> 서버)
export const phoneNumberInServerFormat = (number) => {
  return number.replace(/-/g, '');
};

// 전화 번호 변환함수 (서버 -> 클라이언트)
export const formatPhoneNumber = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  return phone;
};

// 금액 변환함수 (클라이언트 -> 서버)
export const priceInServerFormat = (price) => {
  const num = parseInt(price.replace(/[^\d]/g, ''), 10);
  return num.toString();
};

// 금액 변환함수 (서버 -> 클라이언트)
export const formatPrice = (price) => {
  const num = parseInt(price, 10);
  return num.toLocaleString('ko-KR') + ' 원';
};

// 파일 이름 생성 함수
export const generateShortFileName = (prefix, index) =>
  `${prefix}_${index}_${Date.now().toString(36)}.jpg`;

// LocalDateTime 변환 함수 (yyyy-MM-dd HH:mm:ss)
export const formatLocalDateTime = (isoDateString) => {
  const date = new Date(isoDateString); // Date 객체를 사용하여 ISO 8601 문자열을 파싱

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줌
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedDateString = `${year}-${month}-${day} / ${hours}:${minutes}:${seconds}`;
  return formattedDateString;
};
