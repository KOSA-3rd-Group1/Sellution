// 이벤트 상태 변환 함수(서버 -> 클라이언트)
export const formatEventState = (type) => {
  const types = {
    UPCOMING: '진행예정',
    ONGOING: '진행중',
    END: '종료',
  };
  return types[type] || type;
};

// // queryParams 변화 (클라이언트 -> 서버)
// export const transformEventState = (type) => {
//   switch (type) {
//     case '진행예정':
//       return 'UPCOMING';
//     case '진행중':
//       return 'ONGOING';
//     case '종료':
//       return 'END';
//     default:
//       return 'All';
//   }
// };

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

// // queryParams 변화
// export const transformTargetCustomerType = (type) => {
//   switch (type) {
//     case '신규':
//       return 'NEW';
//     case '일반':
//       return 'NORMAL';
//     case '휴면':
//       return 'DORMANT';
//     case '전체':
//       return 'ALL';
//     default:
//       return 'All';
//   }
// };
