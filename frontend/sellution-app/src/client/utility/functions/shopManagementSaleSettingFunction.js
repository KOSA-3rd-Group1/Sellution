// 적용 상품 타입 변환 (서버 -> 전역변수)
export const formatSellType = (type) => {
  const types = {
    ALL: 0, // 전체상품
    CATEGORY: 1, //카테고리
    EACH: 2, //개별상품
  };
  return types[type];
};

// 적용 상품 타입 변환 (전역변수 -> 서버)
export const transformSellType = (type) => {
  switch (type) {
    case 1:
      return '개별상품';
    case 2:
      return '카테고리';
    case 0:
    default:
      return '전체상품';
  }
};

// 정기 배송 유형 타입 변환 (서버 -> 전역변수)
export const formatSubscriptionType = (type) => {
  const types = {
    MONTH: 0,
    COUNT: 1,
  };
  if (type) {
    return types[type];
  } else {
    return null;
  }
};

// 정기 배송 유형 타입 변환 (전역변수 -> 서버)
export const transformSubscriptionType = (type) => {
  switch (type) {
    case 1:
      return 'MONTH';
    case 0:
      return 'COUNT';
    default:
      return null;
  }
};

// dayValues 변환 (서버 -> 전역변수)
export const formatDayValues = (dayValues) => {
  const dayOption = { MON: false, TUE: false, WED: false, THU: false, FRI: false };
  if (dayValues && dayValues.length !== 0) {
    dayValues.forEach((item) => {
      dayOption[item.value] = true;
    });
  }
  return dayOption;
};

// dayValues 변환 (전역변수 -> 서버)
export const transformDayValues = (dayOption) => {
  const dayValues = Object.entries(dayOption)
    .filter(([key, value]) => value)
    .map(([key, value]) => key);
  return dayValues;
};

// weekValues 변환 (서버 -> 전역변수)
export const formatWeekValues = (weekValues) => {
  const weekOption = { 1: false, 2: false, 3: false, 4: false, 5: false };
  if (weekValues && weekValues.length !== 0) {
    weekValues.forEach((item) => {
      weekValues[item.value] = true;
    });
  }
  return weekOption;
};

// weekValues 변환 (전역변수 -> 서버)
export const transformWeekValues = (dayOption) => {
  const weekValues = Object.entries(dayOption)
    .filter(([key, value]) => value)
    .map(([key, value]) => key);
  return weekValues;
};
