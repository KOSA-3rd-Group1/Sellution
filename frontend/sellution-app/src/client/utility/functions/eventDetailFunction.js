// 회원 유형 변환 함수 (서버 -> 클라이언트)
export const formatTargetCustomerType = (type) => {
  const types = {
    NEW: '신규',
    NORMAL: '일반',
    DORMANT: '휴면',
    ALL: '전체',
  };
  return types[type] || type;
};
