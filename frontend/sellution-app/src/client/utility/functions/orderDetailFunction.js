// 전화 번호 변환함수 (클라이언트 -> 서버)
import { addMonths, format, isValid, parse } from "date-fns";

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

export function calculateFutureDate(selectedStartDate, paymentCount) {
  let startDate;

  // selectedStartDate가 문자열인 경우 처리
  if (typeof selectedStartDate === 'string') {
    // 'YYYY-MM-DD' 형식으로 파싱 시도
    startDate = parse(selectedStartDate, 'yyyy-MM-dd', new Date());

    // 파싱 실패 시 ISO 형식(YYYY-MM-DDTHH:mm:ss.sssZ)으로 파싱 시도
    if (!isValid(startDate)) {
      startDate = new Date(selectedStartDate);
    }
  } else if (selectedStartDate instanceof Date) {
    // 이미 Date 객체인 경우 그대로 사용
    startDate = selectedStartDate;
  } else {
    // 유효하지 않은 입력인 경우 현재 날짜 사용
    console.warn('Invalid date input. Using current date.');
    startDate = new Date();
  }

  // 날짜가 여전히 유효하지 않은 경우 에러 throw
  if (!isValid(startDate)) {
    throw new Error('Invalid date input: ' + selectedStartDate);
  }

  // paymentCount가 숫자가 아닌 경우 처리
  const months = Number(paymentCount);
  if (isNaN(months)) {
    throw new Error('Invalid paymentCount: ' + paymentCount);
  }

  // 날짜 계산
  const futureDate = addMonths(startDate, months);

  // 결과를 'YYYY-MM-DD' 형식의 문자열로 변환
  return format(futureDate, 'yyyy-MM-dd');
}

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
