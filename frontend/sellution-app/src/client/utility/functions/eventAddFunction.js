// 회원 유형 변환 함수 (서버 -> useState)
export const formatOrderType = (type) => {
  const types = {
    NEW: '신규',
    NORMAL: '일반',
    DORMANT: '휴면',
    ALL: '전체',
  };
  return types[type] || type;
};

// queryParams 변화 (useState -> 서버)
export const transformOrderType = (type) => {
  switch (type) {
    case '신규':
      return 'NEW';
    case '일반':
      return 'NORMAL';
    case '휴면':
      return 'DORMANT';
    case '전체':
    default:
      return 'ALL';
  }
};
