// 닫기 아이콘
export const XIcon = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={props.className}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <line x1='18' y1='6' x2='6' y2='18'></line>
    <line x1='6' y1='6' x2='18' y2='18'></line>
  </svg>
);

// 삼각형 주의 아이콘
export const AlertTriangleIcon = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={props.className}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'></path>
    <line x1='12' y1='9' x2='12' y2='13'></line>
    <line x1='12' y1='17' x2='12.01' y2='17'></line>
  </svg>
);

// 원형 확인 아이콘
export const CheckCircleIcon = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={props.className}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path>
    <polyline points='22 4 12 14.01 9 11.01'></polyline>
  </svg>
);

// 원형 X 아이콘
export const XCircleIcon = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={props.className}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='12' cy='12' r='10'></circle>
    <line x1='15' y1='9' x2='9' y2='15'></line>
    <line x1='9' y1='9' x2='15' y2='15'></line>
  </svg>
);

// 정보 안내 아이콘
export const InfoIcon = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={props.className}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='12' cy='12' r='10'></circle>
    <line x1='12' y1='16' x2='12' y2='12'></line>
    <line x1='12' y1='8' x2='12.01' y2='8'></line>
  </svg>
);
