// 전화 번호 변환함수 (클라이언트 -> 서버)
export const phoneNumberInServerFormat = (number) => {
  return number.replace(/-/g, '');
};

// LocalDateTime 변환 함수 (yyyy-MM-dd HH:mm:ss)
export const formatLocalDateTime = (isoDateString) => {
  const date = new Date(isoDateString); // Date 객체를 사용하여 ISO 8601 문자열을 파싱

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줌
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDateString;
};

// 금액 변환 함수
export const formatPrice = (price) => {
  const num = parseInt(price, 10);
  return num.toLocaleString('ko-KR') + ' 원';
};

// 할인 적용 후 금액 계산 함수

// 주문 유형 변환 함수
export const formatOrderType = (type) => {
  const types = {
    ONETIME: '단건',
    MONTH_SUBSCRIPTION: '정기(월 단위)',
    COUNT_SUBSCRIPTION: '정기(횟수 단위)',
  };
  return types[type] || type;
};

// 진행 상태 변환 함수
export const formatOrderStatus = (type) => {
  const types = {
    HOLD: '승인대기',
    APPROVED: '승인',
    CANCEL: '주문취소',
  };
  return types[type] || type;
};

// 요일 변환 함수
export const convertAndSortDays = (selectedDayList) => {
  const dayOrder = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const dayTranslation = {
    MON: '월',
    TUE: '화',
    WED: '수',
    THU: '목',
    FRI: '금',
  };

  const sortedAndTranslatedDays = selectedDayList
    .sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))
    .map((day) => dayTranslation[day]);

  return sortedAndTranslatedDays.join(', ');
};
