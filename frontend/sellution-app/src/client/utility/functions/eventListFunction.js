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
//     case 'UPCOMING':
//       return '진행예정';
//     case 'ONGOING':
//       return '진행중';
//     case 'END':
//       return '종료';
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
//     case 'NEW':
//       return '신규';
//     case 'NORMAL':
//       return '일반';
//     case 'DORMANT':
//       return '휴면';
//     default:
//       return 'All';
//   }
// };
