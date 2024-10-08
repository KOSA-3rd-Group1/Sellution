//햄버거 아이콘
export const HambergerIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 20 20'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fillRule='evenodd'
      d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
      clipRule='evenodd'
    ></path>
  </svg>
);

//햄버거 닫기 아이콘
export const HambergerCloseIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 20 20'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fillRule='evenodd'
      d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
      clipRule='evenodd'
    ></path>
  </svg>
);

//회사 아이콘
export const CompanyIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className} // 여기에서 className 속성을 추가합니다.
    {...props} // 다른 props도 전달할 수 있도록 확장 연산자를 사용합니다.
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      {' '}
      <path
        d='M10.5 6H9.5C9.22386 6 9 6.22386 9 6.5V7.5C9 7.77614 9.22386 8 9.5 8H10.5C10.7761 8 11 7.77614 11 7.5V6.5C11 6.22386 10.7761 6 10.5 6Z'
        fill='#000000'
      ></path>{' '}
      <path
        d='M14.5 6H13.5C13.2239 6 13 6.22386 13 6.5V7.5C13 7.77614 13.2239 8 13.5 8H14.5C14.7761 8 15 7.77614 15 7.5V6.5C15 6.22386 14.7761 6 14.5 6Z'
        fill='#000000'
      ></path>{' '}
      <path
        d='M10.5 9.5H9.5C9.22386 9.5 9 9.72386 9 10V11C9 11.2761 9.22386 11.5 9.5 11.5H10.5C10.7761 11.5 11 11.2761 11 11V10C11 9.72386 10.7761 9.5 10.5 9.5Z'
        fill='#000000'
      ></path>{' '}
      <path
        d='M14.5 9.5H13.5C13.2239 9.5 13 9.72386 13 10V11C13 11.2761 13.2239 11.5 13.5 11.5H14.5C14.7761 11.5 15 11.2761 15 11V10C15 9.72386 14.7761 9.5 14.5 9.5Z'
        fill='#000000'
      ></path>{' '}
      <path
        d='M10.5 13H9.5C9.22386 13 9 13.2239 9 13.5V14.5C9 14.7761 9.22386 15 9.5 15H10.5C10.7761 15 11 14.7761 11 14.5V13.5C11 13.2239 10.7761 13 10.5 13Z'
        fill='#000000'
      ></path>{' '}
      <path
        d='M14.5 13H13.5C13.2239 13 13 13.2239 13 13.5V14.5C13 14.7761 13.2239 15 13.5 15H14.5C14.7761 15 15 14.7761 15 14.5V13.5C15 13.2239 14.7761 13 14.5 13Z'
        fill='#000000'
      ></path>{' '}
      <path
        d='M18.25 19.25H17.75V4C17.7474 3.80189 17.6676 3.61263 17.5275 3.47253C17.3874 3.33244 17.1981 3.25259 17 3.25H7C6.80189 3.25259 6.61263 3.33244 6.47253 3.47253C6.33244 3.61263 6.25259 3.80189 6.25 4V19.25H5.75C5.55109 19.25 5.36032 19.329 5.21967 19.4697C5.07902 19.6103 5 19.8011 5 20C5 20.1989 5.07902 20.3897 5.21967 20.5303C5.36032 20.671 5.55109 20.75 5.75 20.75H18.25C18.4489 20.75 18.6397 20.671 18.7803 20.5303C18.921 20.3897 19 20.1989 19 20C19 19.8011 18.921 19.6103 18.7803 19.4697C18.6397 19.329 18.4489 19.25 18.25 19.25ZM16.25 19.25H11V17C11 16.8674 10.9473 16.7402 10.8536 16.6464C10.7598 16.5527 10.6326 16.5 10.5 16.5H9.5C9.36739 16.5 9.24021 16.5527 9.14645 16.6464C9.05268 16.7402 9 16.8674 9 17V19.25H7.75V4.75H16.25V19.25Z'
        fill='#000000'
      ></path>{' '}
    </g>
  </svg>
);

//홈 아이콘
export const HomeIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='M15.5 14.69h-1.25V7.78a.62.62 0 0 0-.25-.47L8.4 2.7a.65.65 0 0 0-.81 0L2 7.31a.62.62 0 0 0-.22.47v6.91H.5V7.78a1.87 1.87 0 0 1 .68-1.44l5.62-4.6a1.88 1.88 0 0 1 2.39 0l5.63 4.6a1.87 1.87 0 0 1 .68 1.44z'></path>
      <path d='M11.05 12.11H9.8A1.72 1.72 0 0 0 8 10.49a1.72 1.72 0 0 0-1.8 1.62H5a3 3 0 0 1 3-2.87 3 3 0 0 1 3.05 2.87zm-6.1 0H6.2v2.58H4.95zm4.85 0h1.25v2.58H9.8z'></path>
    </g>
  </svg>
);

//회원 아이콘
export const CustomerIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='M8 7.83c-3.08 0-5.59 2.17-5.59 4.84V16h1.27v-3.33c0-2 1.94-3.57 4.32-3.57s4.32 1.6 4.32 3.57V16h1.27v-3.33c0-2.67-2.51-4.84-5.59-4.84zm.1-1.22a3.22 3.22 0 0 0 3.1-3.31A3.21 3.21 0 0 0 8.1 0 3.21 3.21 0 0 0 5 3.3a3.22 3.22 0 0 0 3.1 3.31zm0-5.32a1.92 1.92 0 0 1 1.81 2 1.93 1.93 0 0 1-1.81 2 1.93 1.93 0 0 1-1.8-2 1.92 1.92 0 0 1 1.8-2z'></path>
    </g>
  </svg>
);

//주문 아이콘
export const OrderIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='M13.13 4.13 9.37.37A1.26 1.26 0 0 0 8.48 0H3.75A1.25 1.25 0 0 0 2.5 1.25v13.5A1.25 1.25 0 0 0 3.75 16h8.5a1.25 1.25 0 0 0 1.25-1.25V5a1.26 1.26 0 0 0-.37-.87zm-.88 10.62h-8.5V1.25h3.48V5a1.25 1.25 0 0 0 1.25 1.27h3.77zm0-9.73H8.48V1.25L12.25 5z'></path>
      <path d='M5 7.5h6v1.25H5zM5 10h6v1.25H5z'></path>
    </g>
  </svg>
);

//상품 아이콘
export const ProductIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='M15.5 2.75a1.25 1.25 0 0 0-1.25-1.25H1.75A1.25 1.25 0 0 0 .5 2.75v2.5h1.25v8A1.25 1.25 0 0 0 3 14.5h10a1.25 1.25 0 0 0 1.25-1.25v-8h1.25zM13 5.25v8H3v-8h10zM14.25 4H1.75V2.75h12.5z'></path>
      <path d='M7.38 8.38h1.24a.63.63 0 0 0 0-1.26H7.38a.63.63 0 0 0 0 1.26z'></path>
    </g>
  </svg>
);

//출고 아이콘
export const ReleaseIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='m15.66 7-.91-2.68L8.62.85a1.28 1.28 0 0 0-1.24 0L1.25 4.32.34 7a1.24 1.24 0 0 0 .58 1.5l.33.18V11a1.25 1.25 0 0 0 .63 1l5.5 3.11a1.28 1.28 0 0 0 1.24 0l5.5-3.11a1.25 1.25 0 0 0 .63-1V8.68l.33-.18a1.24 1.24 0 0 0 .58-1.5zM10 9.87l-.48-1.28L14 6.13l.44 1.28zM8 1.94 13.46 5 8 8 2.54 5zM1.52 7.41 2 6.13l4.48 2.46L6 9.87zm1 1.95 4.25 2.32.62-1.84v3.87L2.5 11zM13.5 11l-4.88 2.71V9.84l.63 1.84 4.25-2.32z'></path>
    </g>
  </svg>
);

//결제 내역 아이콘
export const PaymentHistoryIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='M14.75 2.5H1.25A1.2 1.2 0 0 0 0 3.64v8.72a1.2 1.2 0 0 0 1.25 1.14h13.5A1.2 1.2 0 0 0 16 12.36V3.64a1.2 1.2 0 0 0-1.25-1.14zm0 9.75H1.25v-8.5h13.5z'></path>
      <path d='M7 8.62h2a.34.34 0 0 1 .33.38.33.33 0 0 1-.33.29H7.08A.33.33 0 0 1 6.75 9H5.49a1.58 1.58 0 0 0 1.58 1.54h.31v1.26h1.24v-1.26H9A1.58 1.58 0 0 0 10.56 9a1.51 1.51 0 0 0-.34-1A1.59 1.59 0 0 0 9 7.38H7A.34.34 0 0 1 6.69 7a.13.13 0 0 1 .01 0 .34.34 0 0 1 .3-.3h1.94a.34.34 0 0 1 .33.3h1.25a1.59 1.59 0 0 0-1.58-1.55h-.32V4.2H7.37v1.25H7A1.6 1.6 0 0 0 5.44 7a1.55 1.55 0 0 0 .35 1A1.59 1.59 0 0 0 7 8.62z'></path>
    </g>
  </svg>
);

//이벤트
export const EventIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='M15.5 6a1.25 1.25 0 0 0-1.25-1.25h-1.06a2.19 2.19 0 0 0 .23-1A2.22 2.22 0 0 0 11.2 1.5 3.78 3.78 0 0 0 8 3.07 3.78 3.78 0 0 0 4.8 1.5a2.22 2.22 0 0 0-2.22 2.22 2.19 2.19 0 0 0 .23 1H1.75A1.25 1.25 0 0 0 .5 6v2.5h1.25v4.79A1.25 1.25 0 0 0 3 14.5h10a1.25 1.25 0 0 0 1.25-1.25V8.46h1.25zm-4.3-3.25a1 1 0 0 1 0 2H8.68a2.36 2.36 0 0 1 2.52-2zm-6.4 0a2.36 2.36 0 0 1 2.52 2H4.8a1 1 0 0 1 0-1.95zM1.75 6h4.37v1.21H1.75zm4.37 7.29H3V8.46h3.12zm1.26 0V6h1.24v7.29zm5.62 0H9.88V8.46H13zm1.25-6H9.88V6h4.37z'></path>
    </g>
  </svg>
);

//쇼핑몰관리 아이콘
export const ShopManagementIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='M14.25 1.5H1.75A1.25 1.25 0 0 0 .5 2.75v7.5a1.25 1.25 0 0 0 1.25 1.25H6.1v1.75H4v1.25h8v-1.25H9.91V11.5h4.34a1.25 1.25 0 0 0 1.25-1.25v-7.5a1.25 1.25 0 0 0-1.25-1.25zM8.66 13.25H7.35V11.5h1.31zm5.59-3H1.75v-7.5h12.5z'></path>
    </g>
  </svg>
);

//시계 아이콘
export const ClockIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='M8.06.56A8.05 8.05 0 0 0 1.24 4.2V1.55H0V5a1.16 1.16 0 0 0 1.15 1.14h3.44V4.9H2.27a6.79 6.79 0 0 1 5.79-3.1 6.48 6.48 0 0 1 6.7 6.2 6.48 6.48 0 0 1-6.7 6.2A6.48 6.48 0 0 1 1.36 8H.12a7.71 7.71 0 0 0 7.94 7.44A7.71 7.71 0 0 0 16 8 7.71 7.71 0 0 0 8.06.56z'></path>
      <path d='M7.44 4.28v4.34h3.6V7.38H8.68v-3.1H7.44z'></path>
    </g>
  </svg>
);

//추가 아이콘
export const PlusCircleIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='-1.6 -1.6 19.20 19.20'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g
      id='SVGRepo_bgCarrier'
      strokeWidth='0'
      transform='translate(2.3200000000000003,2.3200000000000003), scale(0.71)'
    >
      <rect
        x='-1.6'
        y='-1.6'
        width='19.20'
        height='19.20'
        rx='9.6'
        fill='#F37021'
        strokeWidth='0'
      ></rect>
    </g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='M8.64 4.33H7.39v3.05H4.34v1.25h3.05v3.05h1.25V8.63h3.05V7.38H8.64V4.33z'></path>
      <path d='M8 .5A7.77 7.77 0 0 0 0 8a7.77 7.77 0 0 0 8 7.5A7.77 7.77 0 0 0 16 8 7.77 7.77 0 0 0 8 .5zm0 13.75A6.52 6.52 0 0 1 1.25 8 6.52 6.52 0 0 1 8 1.75 6.52 6.52 0 0 1 14.75 8 6.52 6.52 0 0 1 8 14.25z'></path>
    </g>
  </svg>
);

//알림 아이콘
export const NotificationIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='m13.58 11.6-1.33-2.18V6.33A4.36 4.36 0 0 0 10 2.26a2.45 2.45 0 0 0 0-.38A1.94 1.94 0 0 0 8 0a1.94 1.94 0 0 0-2 1.88 1.64 1.64 0 0 0 0 .38 4.36 4.36 0 0 0-2.25 4.07v3.09L2.42 11.6a1.25 1.25 0 0 0 1.06 1.9h1.77A2.68 2.68 0 0 0 8 16a2.68 2.68 0 0 0 2.75-2.5h1.77a1.25 1.25 0 0 0 1.06-1.9zM7.25 1.88A.7.7 0 0 1 8 1.25a.7.7 0 0 1 .75.63 6 6 0 0 0-.75 0 5.9 5.9 0 0 0-.75 0zM8 14.75a1.44 1.44 0 0 1-1.5-1.25h3A1.44 1.44 0 0 1 8 14.75zm-4.52-2.5 1.34-2.17.18-.31V6.33a4 4 0 0 1 .6-2.12A2.68 2.68 0 0 1 8 3.12a2.68 2.68 0 0 1 2.4 1.09 4 4 0 0 1 .6 2.12v3.44l.18.31 1.34 2.17z'></path>
    </g>
  </svg>
);

//캘린더 아이콘
export const CalendarIcon = (props) => (
  <svg
    fill='none'
    className={props.className}
    {...props}
    viewBox='0 0 15 15'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g clipPath='url(#clip0_671_2892)'>
      <path
        d='M8.75 13.75H6.25C3.89298 13.75 2.71447 13.75 1.98223 13.0177C1.25 12.2856 1.25 11.107 1.25 8.75V7.5C1.25 5.14298 1.25 3.96447 1.98223 3.23223C2.71447 2.5 3.89298 2.5 6.25 2.5H8.75C11.107 2.5 12.2856 2.5 13.0177 3.23223C13.75 3.96447 13.75 5.14298 13.75 7.5V8.75C13.75 11.107 13.75 12.2856 13.0177 13.0177C12.6095 13.426 12.0626 13.6066 11.25 13.6866'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path d='M4.375 2.5V1.5625' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
      <path d='M10.625 2.5V1.5625' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
      <path
        d='M13.4375 5.625H10.3906H6.71875M1.25 5.625H3.67188'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        d='M11.25 10.625C11.25 10.9702 10.9702 11.25 10.625 11.25C10.2798 11.25 10 10.9702 10 10.625C10 10.2798 10.2798 10 10.625 10C10.9702 10 11.25 10.2798 11.25 10.625Z'
        fill='currentColor'
      />
      <path
        d='M11.25 8.125C11.25 8.47019 10.9702 8.75 10.625 8.75C10.2798 8.75 10 8.47019 10 8.125C10 7.77981 10.2798 7.5 10.625 7.5C10.9702 7.5 11.25 7.77981 11.25 8.125Z'
        fill='currentColor'
      />
      <path
        d='M8.125 10.625C8.125 10.9702 7.84519 11.25 7.5 11.25C7.15481 11.25 6.875 10.9702 6.875 10.625C6.875 10.2798 7.15481 10 7.5 10C7.84519 10 8.125 10.2798 8.125 10.625Z'
        fill='currentColor'
      />
      <path
        d='M8.125 8.125C8.125 8.47019 7.84519 8.75 7.5 8.75C7.15481 8.75 6.875 8.47019 6.875 8.125C6.875 7.77981 7.15481 7.5 7.5 7.5C7.84519 7.5 8.125 7.77981 8.125 8.125Z'
        fill='currentColor'
      />
      <path
        d='M5 10.625C5 10.9702 4.72018 11.25 4.375 11.25C4.02982 11.25 3.75 10.9702 3.75 10.625C3.75 10.2798 4.02982 10 4.375 10C4.72018 10 5 10.2798 5 10.625Z'
        fill='currentColor'
      />
      <path
        d='M5 8.125C5 8.47019 4.72018 8.75 4.375 8.75C4.02982 8.75 3.75 8.47019 3.75 8.125C3.75 7.77981 4.02982 7.5 4.375 7.5C4.72018 7.5 5 7.77981 5 8.125Z'
        fill='currentColor'
      />
    </g>
  </svg>
);

//검색 아이콘
export const SearchIcon = (props) => (
  <svg
    fill='none'
    className={props.className}
    {...props}
    viewBox='0 0 15 15'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M6.27138 11.2932C7.13393 11.294 7.98194 11.0711 8.73263 10.6463L10.8151 12.7288C11.0688 12.9825 11.4129 13.125 11.7717 13.125C12.1305 13.125 12.4746 12.9825 12.7283 12.7288C12.982 12.4751 13.1245 12.131 13.1245 11.7722C13.1245 11.4134 12.982 11.0693 12.7283 10.8157L10.6458 8.73315C11.2413 7.67586 11.4337 6.43864 11.1873 5.25044C10.941 4.06223 10.2726 3.00347 9.30583 2.27008C8.33905 1.53669 7.13935 1.17831 5.92871 1.26126C4.71808 1.34421 3.57847 1.86288 2.72076 2.72128C2.0185 3.42351 1.54025 4.31823 1.34649 5.29227C1.15273 6.26631 1.25217 7.27594 1.63223 8.19347C2.01229 9.111 2.65589 9.89522 3.48166 10.447C4.30742 10.9987 5.27825 11.2932 6.27138 11.2932ZM3.60451 3.60503C4.22147 2.98835 5.03316 2.60466 5.90129 2.51933C6.76943 2.434 7.64029 2.65231 8.36551 3.13707C9.09073 3.62182 9.62545 4.34303 9.87855 5.17782C10.1317 6.01261 10.0875 6.90933 9.75358 7.71521C9.41967 8.52109 8.81667 9.18626 8.04733 9.59741C7.27798 10.0086 6.38988 10.1402 5.53433 9.97001C4.67879 9.79978 3.90873 9.33819 3.35535 8.66387C2.80197 7.98955 2.49951 7.14422 2.49951 6.2719C2.49799 5.77636 2.59489 5.28546 2.78458 4.82766C2.97426 4.36986 3.25296 3.95428 3.60451 3.60503Z'
      fill='currentColor'
    />
  </svg>
);

//대량 회원 아이콘
export const BulkCustomerIcon = (props) => (
  <svg
    fill='none'
    className={props.className}
    {...props}
    viewBox='0 0 15 15'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M2.18697 5.00002C2.18709 4.40746 2.34039 3.825 2.63198 3.30916C2.92357 2.79332 3.34356 2.36161 3.85118 2.05593C4.3588 1.75025 4.93682 1.58099 5.52915 1.56455C6.12147 1.54812 6.70799 1.68509 7.23177 1.96215C7.75556 2.23922 8.19884 2.64698 8.51858 3.14586C8.83832 3.64475 9.02367 4.21781 9.05664 4.80945C9.08961 5.40109 8.96909 5.9912 8.70677 6.52252C8.44444 7.05385 8.04922 7.50834 7.55947 7.84189C8.61416 8.22873 9.52895 8.92234 10.1861 9.83346C10.8433 10.7446 11.2127 11.8315 11.247 12.9544C11.2488 13.0159 11.2385 13.0773 11.2167 13.1348C11.1948 13.1924 11.1618 13.2451 11.1196 13.29C11.0343 13.3805 10.9166 13.4335 10.7923 13.4372C10.668 13.4409 10.5472 13.3951 10.4567 13.3099C10.3662 13.2246 10.3132 13.1068 10.3095 12.9825C10.2722 11.7647 9.7623 10.6092 8.8877 9.7609C8.0131 8.91261 6.84256 8.43821 5.62415 8.43821C4.40575 8.43821 3.23521 8.91261 2.36061 9.7609C1.486 10.6092 0.97606 11.7647 0.938842 12.9825C0.932584 13.1049 0.87864 13.22 0.788566 13.3031C0.698492 13.3862 0.579453 13.4307 0.45695 13.4271C0.334447 13.4235 0.218224 13.3721 0.13318 13.2839C0.0481357 13.1956 0.00103444 13.0776 0.0019667 12.955C0.0360613 11.832 0.405471 10.745 1.06265 9.83372C1.71982 8.92247 2.63468 8.22877 3.68947 7.84189C3.22616 7.52674 2.84701 7.103 2.58512 6.60764C2.32322 6.11228 2.18653 5.56035 2.18697 5.00002ZM5.62447 2.50002C4.96143 2.50002 4.32554 2.76341 3.8567 3.23225C3.38786 3.70109 3.12447 4.33697 3.12447 5.00002C3.12447 5.66306 3.38786 6.29894 3.8567 6.76778C4.32554 7.23662 4.96143 7.50002 5.62447 7.50002C6.28751 7.50002 6.92339 7.23662 7.39223 6.76778C7.86107 6.29894 8.12447 5.66306 8.12447 5.00002C8.12447 4.33697 7.86107 3.70109 7.39223 3.23225C6.92339 2.76341 6.28751 2.50002 5.62447 2.50002Z'
      fill='currentColor'
    />
    <path
      d='M10.805 4.9999C10.7125 4.9999 10.6225 5.00615 10.5338 5.01865C10.4718 5.02975 10.4083 5.02825 10.3469 5.01424C10.2855 5.00024 10.2276 4.97402 10.1766 4.93714C10.1256 4.90027 10.0825 4.85349 10.0499 4.79961C10.0174 4.74573 9.99604 4.68585 9.98713 4.62353C9.97823 4.56121 9.98197 4.49774 9.99813 4.4369C10.0143 4.37606 10.0425 4.3191 10.0812 4.26942C10.1198 4.21973 10.1681 4.17834 10.2231 4.14771C10.2781 4.11709 10.3387 4.09785 10.4013 4.09115C11.0229 4.00128 11.6567 4.12065 12.2031 4.43048C12.7494 4.74031 13.1772 5.22301 13.4192 5.80261C13.6611 6.38221 13.7035 7.0258 13.5396 7.63211C13.3757 8.23842 13.0148 8.77302 12.5138 9.15178C13.2503 9.48155 13.8756 10.0174 14.3143 10.6947C14.7531 11.3719 14.9864 12.1617 14.9863 12.9687C14.9863 13.093 14.9369 13.2122 14.849 13.3001C14.7611 13.388 14.6419 13.4374 14.5175 13.4374C14.3932 13.4374 14.274 13.388 14.1861 13.3001C14.0982 13.2122 14.0488 13.093 14.0488 12.9687C14.0487 12.2712 13.824 11.5924 13.4079 11.0327C12.9919 10.473 12.4066 10.0622 11.7388 9.86115L11.405 9.76115V8.71365L11.6613 8.58303C12.0411 8.39062 12.3451 8.07581 12.524 7.68943C12.7029 7.30305 12.7464 6.86764 12.6474 6.4535C12.5485 6.03936 12.3128 5.67066 11.9785 5.40692C11.6443 5.14318 11.2308 4.99979 10.805 4.9999Z'
      fill='currentColor'
    />
  </svg>
);

//쿠폰 발송 아이콘
export const SendIcon = (props) => (
  <svg
    fill='none'
    className={props.className}
    {...props}
    viewBox='0 0 14 14'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g clipPath='url(#clip0_784_7872)'>
      <path
        d='M6.25 7.75L9.5923 4.375M6.25 7.75L2.78651 5.18271C2.30553 4.80422 2.4558 4.04586 3.04556 3.8755L13 1L10.8378 9.93917C10.7238 10.4867 10.0669 10.7228 9.625 10.375L8.125 9.25M6.25 7.75V11.5L8.125 9.25M6.25 7.75L8.125 9.25M3.25 13L4.75 11.5M1 12.25L4.375 8.875M1 9.25L2.875 7.375'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </g>
  </svg>
);

//회원 등록 아이콘
export const AddCustomerIcon = (props) => (
  <svg
    fill='none'
    className={props.className}
    {...props}
    viewBox='0 0 14 14'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g clipPath='url(#clip0_784_7868)'>
      <path
        d='M7.00065 6.29995C7.55444 6.29995 8.09579 6.13574 8.55625 5.82807C9.01671 5.5204 9.37559 5.0831 9.58751 4.57147C9.79944 4.05983 9.85489 3.49685 9.74685 2.9537C9.63881 2.41055 9.37214 1.91164 8.98055 1.52005C8.58896 1.12847 8.09005 0.861792 7.5469 0.753754C7.00376 0.645715 6.44077 0.701164 5.92914 0.91309C5.4175 1.12502 4.9802 1.4839 4.67254 1.94436C4.36487 2.40481 4.20065 2.94616 4.20065 3.49995C4.20142 4.24232 4.49667 4.95406 5.0216 5.479C5.54654 6.00393 6.25828 6.29918 7.00065 6.29995ZM7.00065 1.28329C7.43907 1.28329 7.86764 1.41329 8.23216 1.65686C8.59669 1.90043 8.88081 2.24663 9.04858 2.65167C9.21636 3.05671 9.26026 3.50241 9.17472 3.9324C9.08919 4.36239 8.87808 4.75737 8.56807 5.06737C8.25806 5.37738 7.86309 5.5885 7.4331 5.67403C7.00311 5.75956 6.55741 5.71566 6.15237 5.54789C5.74733 5.38011 5.40113 5.096 5.15756 4.73147C4.91399 4.36694 4.78398 3.93837 4.78398 3.49995C4.7846 2.91225 5.01834 2.34879 5.43391 1.93321C5.84949 1.51764 6.41294 1.2839 7.00065 1.28329ZM2.33398 12.8333V10.2083C2.33491 9.35767 2.67323 8.54215 3.27471 7.94068C3.87619 7.3392 4.6917 7.00088 5.54232 6.99995H8.45898C9.11741 6.99986 9.75971 7.20363 10.2977 7.58329H5.54232C4.84636 7.58406 4.17913 7.86087 3.68702 8.35298C3.1949 8.8451 2.91809 9.51233 2.91732 10.2083V12.25H6.41732V12.8327L2.33398 12.8333ZM12.834 11.0833V11.666H10.5007V14H9.91732V11.666H7.58398V11.0833H9.91732V8.74995H10.5007V11.0833H12.834Z'
        fill='currentColor'
      />
    </g>
  </svg>
);

//목록 아이콘
export const ListIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='M3.8 3.05H16v1.26H3.8zm0 4.29H16V8.6H3.8zm0 4.36H16v1.26H3.8zM1.25 2.5A1.22 1.22 0 0 1 2.5 3.68a1.22 1.22 0 0 1-1.25 1.17A1.22 1.22 0 0 1 0 3.68 1.22 1.22 0 0 1 1.25 2.5zm0 4.3a1.18 1.18 0 1 1 0 2.35 1.18 1.18 0 1 1 0-2.35zm0 4.35a1.18 1.18 0 1 1 0 2.35 1.18 1.18 0 1 1 0-2.35z'></path>
    </g>
  </svg>
);

//간편 주문 아이콘
export const SimpleOrderIcon = (props) => (
  <svg
    fill='none'
    className={props.className}
    {...props}
    viewBox='0 0 18 18'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M6.42885 3.85718C6.06766 3.85718 5.49623 3.85718 4.71456 3.85718C4.24118 3.85718 3.85742 4.24093 3.85742 4.71432V14.1429C3.85742 14.6163 4.24118 15 4.71456 15H13.286C13.7594 15 14.1431 14.6163 14.1431 14.1429V4.71432C14.1431 4.24093 13.7594 3.85718 13.286 3.85718C12.5241 3.85718 11.9527 3.85718 11.5717 3.85718'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M7.28683 3H10.7154C11.1888 3 11.5725 3.38376 11.5725 3.85714C11.5725 4.33053 11.1888 4.71429 10.7154 4.71429H7.28683C6.81344 4.71429 6.42969 4.33053 6.42969 3.85714C6.42969 3.38376 6.81344 3 7.28683 3Z'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M6.42969 9.85719L8.14397 11.5715L12.4297 7.28577'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

//위 꺽쇠 아이콘
export const ChevronUpIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='m8.05 5.82 5.56 5.66.89-.87L8.91 4.9a1.18 1.18 0 0 0-.86-.39 1.13 1.13 0 0 0-.85.39l-5.7 5.7.88.89z'></path>
    </g>
  </svg>
);

//아래 꺽쇠 아이콘
export const ChevronDownIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='M8 10.18 2.39 4.52l-.89.87 5.59 5.71a1.18 1.18 0 0 0 .86.39 1.13 1.13 0 0 0 .85-.39l5.7-5.7-.88-.89z'></path>
    </g>
  </svg>
);

//왼쪽 꺽쇠 아이콘
export const ChevronLeftIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='m5.82 8 5.66-5.56-.87-.89L4.9 7.09a1.18 1.18 0 0 0-.39.91 1.13 1.13 0 0 0 .39.85l5.7 5.7.89-.88z'></path>
    </g>
  </svg>
);

//오른쪽 꺽쇠 아이콘
export const ChevronRightIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='m10.18 8.05-5.66 5.56.87.89 5.71-5.59a1.18 1.18 0 0 0 .39-.86 1.13 1.13 0 0 0-.39-.85L5.4 1.5l-.89.88z'></path>
    </g>
  </svg>
);

//... 아이콘
export const MoreHorizontalIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
    transform='rotate(90)'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='M8 2.5a1.22 1.22 0 0 1 1.25 1.17A1.21 1.21 0 0 1 8 4.84a1.21 1.21 0 0 1-1.25-1.17A1.22 1.22 0 0 1 8 2.5zm0 8.66a1.17 1.17 0 1 1-1.25 1.17A1.21 1.21 0 0 1 8 11.16zm0-4.33a1.17 1.17 0 1 1 0 2.34 1.17 1.17 0 1 1 0-2.34z'></path>
    </g>
  </svg>
);

//수정 아이콘
export const EditIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      {' '}
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z'
        fill='currentColor'
      ></path>{' '}
    </g>
  </svg>
);

//휴지통 아이콘
export const TrashIcon = (props) => (
  <svg
    fill='none'
    className={props.className}
    {...props}
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M16.8794 22.5003H7.11937C6.63232 22.501 6.16361 22.3146 5.81003 21.9796C5.45645 21.6447 5.24501 21.1867 5.21937 20.7003L4.35938 5.32031H19.6394L18.7794 20.7003C18.7537 21.1867 18.5423 21.6447 18.1887 21.9796C17.8351 22.3146 17.3664 22.501 16.8794 22.5003Z'
      stroke='currentColor'
      strokeWidth='1.91'
      strokeMiterlimit='10'
    />
    <path
      d='M2.44922 5.32031H21.5492'
      stroke='currentColor'
      strokeWidth='1.91'
      strokeMiterlimit='10'
    />
    <path
      d='M10.0897 1.5H13.9097C14.4163 1.5 14.9021 1.70123 15.2603 2.05943C15.6185 2.41762 15.8197 2.90344 15.8197 3.41V5.32H8.17969V3.41C8.17969 2.90344 8.38092 2.41762 8.73911 2.05943C9.09731 1.70123 9.58312 1.5 10.0897 1.5Z'
      stroke='currentColor'
      strokeWidth='1.91'
      strokeMiterlimit='10'
    />
    <path d='M12 8.17969V19.6397' stroke='currentColor' strokeWidth='1.91' strokeMiterlimit='10' />
    <path
      d='M15.8184 8.17969V19.6397'
      stroke='currentColor'
      strokeWidth='1.91'
      strokeMiterlimit='10'
    />
    <path
      d='M8.17969 8.17969V19.6397'
      stroke='currentColor'
      strokeWidth='1.91'
      strokeMiterlimit='10'
    />
  </svg>
);

//링크 아이콘
export const LinkIcon = (props) => (
  <svg
    fill='none'
    className={props.className}
    {...props}
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      {' '}
      <path
        d='M10.0464 14C8.54044 12.4882 8.67609 9.90087 10.3494 8.22108L15.197 3.35462C16.8703 1.67483 19.4476 1.53865 20.9536 3.05046C22.4596 4.56228 22.3239 7.14956 20.6506 8.82935L18.2268 11.2626'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      ></path>{' '}
      <path
        d='M13.9536 10C15.4596 11.5118 15.3239 14.0991 13.6506 15.7789L11.2268 18.2121L8.80299 20.6454C7.12969 22.3252 4.55237 22.4613 3.0464 20.9495C1.54043 19.4377 1.67609 16.8504 3.34939 15.1706L5.77323 12.7373'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      ></path>{' '}
    </g>
  </svg>
);

//다운로드 아이콘
export const DownloadIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      {' '}
      <title></title>{' '}
      <g id='Complete'>
        {' '}
        <g id='download'>
          {' '}
          <g>
            {' '}
            <path
              d='M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
            ></path>{' '}
            <g>
              {' '}
              <polyline
                data-name='Right'
                fill='none'
                id='Right-2'
                points='7.9 12.3 12 16.3 16.1 12.3'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
              ></polyline>{' '}
              <line
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                x1='12'
                x2='12'
                y1='2.7'
                y2='14.2'
              ></line>{' '}
            </g>{' '}
          </g>{' '}
        </g>{' '}
      </g>{' '}
    </g>
  </svg>
);

//팔레트 아이콘
export const PaletteIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='M8 .5C3.58.5 0 3.86 0 8s3.58 7.5 8 7.5c4.69 0 1.04-2.83 2.79-4.55.76-.75 1.63-.87 2.44-.87.37 0 .73.03 1.06.03.99 0 1.72-.23 1.72-2.1C16 3.86 12.42.5 8 .5zm6.65 8.32c-.05.01-.16.02-.37.02-.14 0-.29 0-.45-.01-.19 0-.39-.01-.61-.01-.89 0-2.19.13-3.32 1.23-1.17 1.16-.9 2.6-.74 3.47.03.18.08.44.09.6-.16.05-.52.13-1.26.13-3.72 0-6.75-2.8-6.75-6.25S4.28 1.75 8 1.75s6.75 2.8 6.75 6.25c0 .5-.06.74-.1.82z'></path>
      <path d='M5.9 9.47c-1.03 0-1.86.8-1.86 1.79s.84 1.79 1.86 1.79 1.86-.8 1.86-1.79-.84-1.79-1.86-1.79zm0 2.35c-.35 0-.64-.25-.64-.56s.29-.56.64-.56.64.25.64.56-.29.56-.64.56zm-.2-4.59c0-.99-.84-1.79-1.86-1.79s-1.86.8-1.86 1.79.84 1.79 1.86 1.79 1.86-.8 1.86-1.79zm-1.86.56c-.35 0-.64-.25-.64-.56s.29-.56.64-.56.64.25.64.56-.29.56-.64.56zM7.37 2.5c-1.03 0-1.86.8-1.86 1.79s.84 1.79 1.86 1.79 1.86-.8 1.86-1.79S8.39 2.5 7.37 2.5zm0 2.35c-.35 0-.64-.25-.64-.56s.29-.56.64-.56.64.25.64.56-.29.56-.64.56zm2.47 1.31c0 .99.84 1.79 1.86 1.79s1.86-.8 1.86-1.79-.84-1.79-1.86-1.79-1.86.8-1.86 1.79zm2.5 0c0 .31-.29.56-.64.56s-.64-.25-.64-.56.29-.56.64-.56.64.25.64.56z'></path>
    </g>
  </svg>
);

//X 아이콘
export const CloseIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      {' '}
      <g id='Menu / Close_LG'>
        {' '}
        <path
          id='Vector'
          d='M21 21L12 12M12 12L3 3M12 12L21.0001 3M12 12L3 21.0001'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        ></path>{' '}
      </g>{' '}
    </g>
  </svg>
);

//Eye 아이콘
export const EyeOnIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='M8 5.5A2.59 2.59 0 0 0 5.33 8 2.59 2.59 0 0 0 8 10.5 2.59 2.59 0 0 0 10.67 8 2.59 2.59 0 0 0 8 5.5zm0 3.75A1.35 1.35 0 0 1 6.58 8 1.35 1.35 0 0 1 8 6.75 1.35 1.35 0 0 1 9.42 8 1.35 1.35 0 0 1 8 9.25z'></path>
      <path d='M8 2.5A8.11 8.11 0 0 0 0 8a8.11 8.11 0 0 0 8 5.5A8.11 8.11 0 0 0 16 8a8.11 8.11 0 0 0-8-5.5zm5.4 7.5A6.91 6.91 0 0 1 8 12.25 6.91 6.91 0 0 1 2.6 10a7.2 7.2 0 0 1-1.27-2A7.2 7.2 0 0 1 2.6 6 6.91 6.91 0 0 1 8 3.75 6.91 6.91 0 0 1 13.4 6a7.2 7.2 0 0 1 1.27 2 7.2 7.2 0 0 1-1.27 2z'></path>
    </g>
  </svg>
);

//EyeOff 아이콘
export const EyeOffIcon = (props) => (
  <svg
    fill='currentColor'
    className={props.className}
    {...props}
    viewBox='0 0 16 16'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      <path d='M8 2.5a9.77 9.77 0 0 0-2.53.32l1 1.05A8.78 8.78 0 0 1 8 3.75 6.91 6.91 0 0 1 13.4 6a7.2 7.2 0 0 1 1.27 2 7.2 7.2 0 0 1-1.27 2c-.12.13-.24.26-.37.38l.89.89A8.24 8.24 0 0 0 16 8a8.11 8.11 0 0 0-8-5.5zm5 9.56-.9-.9-6.97-6.91-1-1-1.19-1.19-.88.88 1 1A8.25 8.25 0 0 0 0 8a8.11 8.11 0 0 0 8 5.5 9.05 9.05 0 0 0 3.82-.79l1.24 1.23.88-.88-1-1zM6.66 7.54l1.67 1.67a1.47 1.47 0 0 1-.36 0A1.35 1.35 0 0 1 6.55 8a1.07 1.07 0 0 1 .11-.46zM8 12.25A6.91 6.91 0 0 1 2.6 10a7.2 7.2 0 0 1-1.27-2A7.2 7.2 0 0 1 2.6 6 6.49 6.49 0 0 1 4 4.84l1.74 1.79A2.33 2.33 0 0 0 5.3 8 2.59 2.59 0 0 0 8 10.5a2.78 2.78 0 0 0 1.32-.33l1.58 1.58a8 8 0 0 1-2.9.5z'></path>
    </g>
  </svg>
);

//ImageUpload 아이콘
export const ImageUploadIcon = (props) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    className={props.className}
    {...props}
    xmlns='http://www.w3.org/2000/svg'
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      {' '}
      <path
        d='M13 4H8.8C7.11984 4 6.27976 4 5.63803 4.32698C5.07354 4.6146 4.6146 5.07354 4.32698 5.63803C4 6.27976 4 7.11984 4 8.8V15.2C4 16.8802 4 17.7202 4.32698 18.362C4.6146 18.9265 5.07354 19.3854 5.63803 19.673C6.27976 20 7.11984 20 8.8 20H15.2C16.8802 20 17.7202 20 18.362 19.673C18.9265 19.3854 19.3854 18.9265 19.673 18.362C20 17.7202 20 16.8802 20 15.2V11'
        stroke='currentColor'
        strokeWidth='1'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></path>{' '}
      <path
        d='M4 16L8.29289 11.7071C8.68342 11.3166 9.31658 11.3166 9.70711 11.7071L13 15M13 15L15.7929 12.2071C16.1834 11.8166 16.8166 11.8166 17.2071 12.2071L20 15M13 15L15.25 17.25'
        stroke='currentColor'
        strokeWidth='1'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></path>{' '}
      <path
        d='M18 8V3M18 3L16 5M18 3L20 5'
        stroke='currentColor'
        strokeWidth='1'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></path>{' '}
    </g>
  </svg>
);

//홈화면 footer 아이콘 - 홈
export const ShoppingHomeIcon = (props) => (
  <svg
    viewBox='0 0 1024 1024'
    fill='currentColor'
    stroke='currentColor'
    strokeWidth='5'
    className={props.className}
    xmlns='http://www.w3.org/2000/svg'
  >
    <path d='M972 520.8c-6.4 0-12-2.4-16.8-7.2L530.4 86.4c-4.8-4.8-11.2-8-18.4-8-6.4 0-12.8 2.4-18.4 8L68.8 512c-4.8 4.8-10.4 7.2-16.8 7.2s-12-2.4-16-6.4c-4.8-4-7.2-8.8-7.2-15.2-0.8-7.2 2.4-14.4 7.2-19.2L458.4 52.8c14.4-14.4 32.8-22.4 52.8-22.4s38.4 8 52.8 22.4L988.8 480c4.8 4.8 7.2 11.2 7.2 18.4 0 7.2-4 13.6-8.8 17.6-4.8 3.2-10.4 4.8-15.2 4.8z' />
    <path d='M637.6 998.4v-33.6h-33.6V904c0-51.2-41.6-92-92-92-51.2 0-92 41.6-92 92v60.8h-33.6v33.6H196.8c-40.8 0-73.6-32.8-73.6-73.6V509.6c0-13.6 10.4-24 24-24s24 10.4 24 24v415.2c0 14.4 11.2 25.6 25.6 25.6h175.2v-45.6c0-77.6 63.2-140 140-140s140 63.2 140 140v45.6h175.2c14.4 0 25.6-11.2 25.6-25.6V509.6c0-13.6 10.4-24 24-24s24 10.4 24 24v415.2c0 40.8-32.8 73.6-73.6 73.6H637.6z' />
    <path d='M604 998.4v-48h48v48h-48z m-232 0v-48h48v48h-48z' />
  </svg>
);
//홈화면 footer 아이콘 - 정기배송
export const ShoppingSubscriptionDeliveryIcon = (props) => (
  <svg
    viewBox='0 0 1024 1024'
    fill='currentColor'
    stroke='currentColor'
    // strokeWidth='10'
    className={props.className}
    xmlns='http://www.w3.org/2000/svg'
  >
    <path d='M959.018 208.158c0.23-2.721 0.34-5.45 0.34-8.172 0-74.93-60.96-135.89-135.89-135.89-1.54 0-3.036 0.06-6.522 0.213l-611.757-0.043c-1.768-0.085-3.563-0.17-5.424-0.17-74.812 0-135.67 60.84-135.67 135.712l0.188 10.952h-0.306l0.391 594.972-0.162 20.382c0 74.03 60.22 134.25 134.24 134.25 1.668 0 7.007-0.239 7.1-0.239l608.934 0.085c2.985 0.357 6.216 0.468 9.55 0.468 35.815 0 69.514-13.954 94.879-39.302 25.373-25.34 39.344-58.987 39.344-94.794l-0.145-12.015h0.918l-0.008-606.41z m-757.655 693.82l-2.585-0.203c-42.524 0-76.146-34.863-76.537-79.309V332.671H900.79l0.46 485.186-0.885 2.865c-0.535 1.837-0.8 3.58-0.8 5.17 0 40.382-31.555 73.766-71.852 76.002l-10.816 0.621v-0.527l-615.533-0.01zM900.78 274.424H122.3l-0.375-65.934 0.85-2.924c0.52-1.82 0.782-3.63 0.782-5.247 0-42.236 34.727-76.665 78.179-76.809l0.45-0.068 618.177 0.018 2.662 0.203c42.329 0 76.767 34.439 76.767 76.768 0 1.326 0.196 2.687 0.655 4.532l0.332 0.884v68.577z' />
    <path d='M697.67 471.435c-7.882 0-15.314 3.078-20.918 8.682l-223.43 223.439L346.599 596.84c-5.544-5.603-12.95-8.69-20.842-8.69s-15.323 3.078-20.918 8.665c-5.578 5.518-8.674 12.9-8.7 20.79-0.017 7.908 3.07 15.357 8.69 20.994l127.55 127.558c5.57 5.56 13.01 8.622 20.943 8.622 7.925 0 15.364-3.06 20.934-8.63l244.247-244.247c5.578-5.511 8.674-12.883 8.7-20.783 0.017-7.942-3.079-15.408-8.682-20.986-5.552-5.612-12.958-8.698-20.85-8.698z' />
  </svg>
);
//홈화면 footer 아이콘 - 단건배송
export const ShoppingOneTimeDeliveryIcon = (props) => (
  <svg
    viewBox='0 0 1024 1024'
    fill='currentColor'
    stroke='currentColor'
    // strokeWidth='10'
    className={props.className}
    xmlns='http://www.w3.org/2000/svg'
  >
    <path d='M91.448447 896c-50.086957 0-91.428571-40.546584-91.428571-91.428571V91.428571C0.019876 41.341615 40.56646 0 91.448447 0h671.006211c50.086957 0 91.428571 40.546584 91.428572 91.428571v337.093168l-3.180124-0.795031c-13.515528-3.975155-26.236025-5.565217-40.546584-5.565217h-0.795031l-0.795031-2.385093h-2.385094V91.428571c0-23.055901-20.670807-43.726708-43.726708-43.726708H91.448447c-23.055901 0-43.726708 20.670807-43.726708 43.726708v713.142858c0 23.055901 20.670807 43.726708 43.726708 43.726708h352.198758l0.795031 0.795031c8.745342 11.925466 3.975155 20.670807 0.795031 27.031056-3.180124 5.565217-4.770186 9.540373 0.795031 15.10559l4.770186 4.770186H91.448447z' />
    <path d='M143.125466 174.906832c-8.745342 0-15.900621-11.130435-15.900621-24.645962 0-13.515528 7.15528-24.645963 15.900621-24.645963h270.310559c8.745342 0 15.900621 11.130435 15.900621 24.645963 0 13.515528-7.15528 24.645963-15.900621 24.645962h-270.310559z' />
    <path d='M413.436025 128h-270.310559c-7.15528 0-13.515528 9.540373-13.515528 22.26087s6.360248 22.26087 13.515528 22.260869h270.310559c7.15528 0 13.515528-9.540373 13.515528-22.260869s-5.565217-22.26087-13.515528-22.26087zM139.945342 302.111801c-7.15528 0-12.720497-10.335404-12.720497-24.645962s5.565217-24.645963 12.720497-24.645963h193.987577c7.15528 0 12.720497 10.335404 12.720497 24.645963s-5.565217 24.645963-12.720497 24.645962H139.945342z' />
    <path d='M333.932919 255.204969H139.945342c-5.565217 0-9.540373 9.540373-9.540373 22.26087s3.975155 22.26087 9.540373 22.260869h193.987577c5.565217 0 9.540373-9.540373 9.540373-22.260869s-4.770186-22.26087-9.540373-22.26087zM734.628571 1024c-27.826087 0-58.037267-1.590062-96.993788-4.770186-56.447205-4.770186-108.124224-31.006211-158.211181-79.503106L253.634783 718.708075c-52.47205-50.881988-54.857143-117.664596-7.950311-168.546584 19.875776-20.670807 50.881988-33.391304 84.273292-33.391305 33.391304 0 63.602484 12.720497 82.68323 34.981367 0.795031 0.795031 2.385093 2.385093 5.565217 3.975155 0.795031 0.795031 2.385093 1.590062 3.180124 2.385093V451.57764v-52.47205c0-40.546584 0-81.888199 0.795031-122.434783 0.795031-60.42236 47.701863-106.534161 109.714286-106.534161h0.795031c59.627329 0 104.944099 43.726708 108.124224 103.354037 0.795031 13.515528 0.795031 27.826087 0 42.136646v18.285714h11.925466c41.341615 0 73.142857 14.310559 96.198757 44.52174 0.795031 1.590062 5.565217 3.180124 11.925466 3.180124 2.385093 0 4.770186 0 6.360249-0.795031 7.15528-0.795031 14.310559-1.590062 20.670807-1.590062 31.801242 0 59.627329 12.720497 83.478261 38.956521 3.975155 3.975155 12.720497 7.15528 20.670807 7.15528h3.180125c5.565217-0.795031 11.925466-1.590062 17.490683-1.590062 59.627329 0 107.329193 42.136646 108.124224 96.993789 2.385093 100.968944 3.975155 200.347826-7.15528 298.931677-13.515528 119.254658-77.118012 182.857143-201.142857 198.757764-23.055901 3.975155-49.291925 5.565217-77.913044 5.565217zM325.982609 562.086957c-16.695652 0-32.596273 6.360248-44.521739 17.490683-14.310559 14.310559-22.26087 31.006211-22.26087 49.291925 0 19.080745 8.745342 38.161491 24.645963 54.062112l30.21118 30.21118c65.987578 65.192547 134.360248 131.975155 202.732919 197.962733 33.391304 31.801242 71.552795 52.47205 113.689441 60.42236 32.596273 6.360248 65.192547 9.540373 96.993789 9.540373 28.621118 0 57.242236-2.385093 85.068323-7.950311 100.968944-18.285714 147.080745-66.782609 156.621118-160.596273 8.745342-89.838509 7.950311-182.062112 6.360248-271.10559v-14.310559c-0.795031-32.596273-23.850932-54.857143-56.447205-54.857143-8.745342 0-16.695652 1.590062-25.440993 4.770187V601.043478c0 11.130435 0 32.596273-22.26087 32.596274h-0.795031c-7.15528 0-12.720497-1.590062-15.900621-5.565218-6.360248-6.360248-7.15528-18.285714-7.15528-27.826087v-4.770186c0-36.571429 0.795031-73.937888 0-111.304348-0.795031-32.596273-23.850932-55.652174-55.652174-55.652174-7.950311 0-15.900621 1.590062-23.0559 3.975155v128.795031c0 11.130435-2.385093 19.875776-7.950311 25.440994-3.975155 3.975155-9.540373 6.360248-16.695652 6.360249h-0.795031c-21.465839-0.795031-21.465839-23.055901-21.465838-31.006211v-52.47205-66.782609c0-15.10559-6.360248-31.006211-18.285715-42.931677-11.130435-11.130435-26.236025-17.490683-41.341615-17.490683-6.360248 0-13.515528 0.795031-19.875776 3.180124V442.832298c0 27.031056 0 55.652174-1.590062 83.478261-0.795031 7.15528-7.15528 12.720497-13.515528 18.285714-2.385093 2.385093-5.565217 4.770186-7.950311 7.15528l-2.385093 2.385093-1.590062-3.975155c-1.590062-2.385093-3.975155-4.770186-6.360248-6.360249-4.770186-5.565217-10.335404-11.130435-13.515528-17.490683-2.385093-4.770186-1.590062-10.335404-1.590062-15.10559v-6.360249-69.167701c0-50.881988 0-103.354037-0.795032-155.031056 0-38.161491-24.645963-63.602484-60.42236-64.397516-38.956522 0-65.192547 27.826087-65.192546 68.372671v374.459627l-10.335404 6.360249-0.795031-1.590062c-7.15528-7.950311-15.10559-15.900621-22.26087-23.850932-16.695652-17.490683-34.186335-36.571429-51.677018-54.062112-15.900621-15.10559-35.776398-23.850932-56.447205-23.850931z' />
  </svg>
);

//홈화면 footer 아이콘 - 마이페이지
export const ShoppingMypageIcon = (props) => (
  <svg
    viewBox='0 0 1024 1024'
    fill='currentColor'
    stroke='currentColor'
    strokeWidth='10'
    className={props.className}
    xmlns='http://www.w3.org/2000/svg'
  >
    <path d='M309.52 494.12c-1.94 0-3.47 0.28-4.67 0.76 1.63-0.49 3.37-0.76 5.16-0.76h-0.49z m535.61 213.4c0.05-0.99 0.18-1.96 0.39-2.9-0.23 0.43-0.35 1.35-0.39 2.9z m35.73-394.23c0.01-0.04 0.01-0.09 0.01-0.13v-0.46c0 0.2 0 0.4-0.01 0.59z m-35.75-0.06c0 0.04 0 0.08 0.01 0.12-0.01-0.21-0.01-0.43-0.01-0.65v0.53z m21.563 536.2a348 348 0 0 0-32.69-107.48c-3.26-6.62-6.71-13.13-10.37-19.51a0.21 0.21 0 0 0-0.04-0.06c-15.86-26.86-35.32-51.8-58-74.06l-0.01-0.01c-4.93-4.84-10.01-9.56-15.24-14.14-37.29-32.68-80.34-56.91-126.25-71.65 8.31-4.6 16.35-9.76 24.07-15.47 8.79-6.48 17.16-13.68 25.03-21.55 41.39-41.39 64.19-96.43 64.19-154.97 0-58.54-22.8-113.58-64.19-154.97-40.64-40.64-94.44-63.35-151.78-64.17-0.91-0.01-1.82-0.02-2.73-0.02-0.91 0-1.82 0.01-2.73 0.02-57.34 0.82-111.14 23.53-151.78 64.17-41.39 41.39-64.19 96.43-64.19 154.97 0 58.54 22.8 113.58 64.19 154.97 7.87 7.87 16.24 15.07 25.03 21.55 7.72 5.71 15.76 10.87 24.07 15.47-45.91 14.74-88.96 38.97-126.25 71.65-5.23 4.58-10.31 9.3-15.24 14.14-22.7 22.28-42.18 47.24-58.05 74.13-3.66 6.38-7.11 12.89-10.37 19.51a348 348 0 0 0-32.69 107.48c-1.61 12 6.81 23.03 18.8 24.64 0.99 0.13 1.98 0.2 2.95 0.2 0.89 0 1.76-0.05 2.63-0.16 8.67-1.89 15.67-8.96 17.03-18.25 10.1-69.32 43.14-132.31 90.63-180.28 56.36-56.95 133.07-92.74 215.97-92.88h0.47c82.72 0.28 159.25 36.04 215.5 92.88 47.49 47.97 80.53 110.96 90.63 180.28 1.36 9.27 8.33 16.33 16.98 18.24 0.02 0 0.03 0.01 0.05 0.01 0.87 0.11 1.74 0.16 2.63 0.16 0.97 0 1.96-0.07 2.95-0.2 11.99-1.61 20.41-12.64 18.8-24.64z m-348.48-303.57c-0.44 0-0.88 0-1.32-0.01-81.8-0.6-154.73-57.43-174.66-133.66-0.22-0.83-0.44-1.67-0.64-2.51-3.12-12.6-4.78-25.7-4.78-39.15s1.66-26.7 4.78-39.52c0.2-0.86 0.42-1.71 0.64-2.56 20.04-78.14 93.65-140.25 175.98-140.25h0.94c82.33 0 155.94 62.11 175.98 140.25 0.22 0.85 0.44 1.7 0.64 2.56 3.12 12.82 4.78 26.07 4.78 39.52 0 13.45-1.66 26.55-4.78 39.15-0.2 0.84-0.42 1.68-0.64 2.51-19.93 76.23-92.86 133.06-174.66 133.66-0.75 0.01-1.5 0.01-2.26 0.01z' />
  </svg>
);

//홈화면 footer 아이콘 - 장바구니
export const ShoppingCartIcon = (props) => (
  <svg
    viewBox='0 0 1024 1024'
    fill='currentColor'
    stroke='currentColor'
    // strokeWidth='10'
    className={props.className}
    xmlns='http://www.w3.org/2000/svg'
  >
    <path d='M298.4 486.4c0-13.6 11.2-24.8 24-24.8 13.6 0 24 11.2 24 24.8v72.8c0 13.6-11.2 24.8-24 24.8-13.6 0-24-11.2-24-24.8v-72.8z m-48.8 0v72.8c0 40.8 32.8 73.6 72.8 73.6 40.8 0 72.8-32.8 72.8-73.6v-72.8c0-40.8-32.8-73.6-72.8-73.6s-72.8 32.8-72.8 73.6zM680 486.4c0-13.6 11.2-24.8 24-24.8 13.6 0 24 11.2 24 24.8v72.8c0 13.6-11.2 24.8-24 24.8-13.6 0-24-11.2-24-24.8v-72.8z m-48.8 0v72.8c0 40.8 32.8 73.6 72.8 73.6 40.8 0 72.8-32.8 72.8-73.6v-72.8c0-40.8-32.8-73.6-72.8-73.6s-72.8 32.8-72.8 73.6z' />
    <path d='M343.2 438.4V227.2c0-94.4 76.8-170.4 170.4-170.4 94.4 0 170.4 76.8 170.4 170.4v211.2h48.8V227.2C732.8 106.4 635.2 8 513.6 8 392.8 8 294.4 106.4 294.4 227.2v211.2h48.8z' />
    <path d='M912 1013.6H115.2c-32 0-62.4-14.4-83.2-39.2-20.8-24.8-28.8-57.6-22.4-88.8v-0.8L128 389.6C139.2 340 183.2 304 233.6 304h560c50.4 0 94.4 36 104.8 85.6l118.4 496.8c6.4 32-1.6 64-22.4 88.8-20 24.8-49.6 38.4-82.4 38.4zM56.8 895.2c-3.2 17.6 0.8 35.2 12 48.8 11.2 13.6 28 21.6 45.6 21.6H912c17.6 0 34.4-8 45.6-21.6 11.2-13.6 16-31.2 12-48.8l-118.4-496c-5.6-27.2-29.6-47.2-57.6-47.2h-560c-28 0-52.8 20-57.6 47.2v0.8L56.8 895.2z' />
  </svg>
);

export const CheckIcon = (props) => (
  <svg
    // className='w-5 h-5 text-green-500 mr-2'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    viewBox='0 0 24 24'
    className={props.className}
  >
    <path d='M5 13l4 4L19 7'></path>
  </svg>
);

export const OrderApproveAllIcon = (props) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={props.className}
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      {' '}
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V4C21 2.34315 19.6569 1 18 1H10ZM11 3H18C18.5523 3 19 3.44772 19 4V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3ZM9 7H6.41421L9 4.41421V7ZM16.7682 12.6402C17.1218 12.2159 17.0645 11.5853 16.6402 11.2318C16.2159 10.8782 15.5853 10.9355 15.2318 11.3598L10.9328 16.5186L8.70711 14.2929C8.31658 13.9024 7.68342 13.9024 7.29289 14.2929C6.90237 14.6834 6.90237 15.3166 7.29289 15.7071L10.2929 18.7071C10.4916 18.9058 10.7646 19.0117 11.0453 18.999C11.326 18.9862 11.5884 18.856 11.7682 18.6402L16.7682 12.6402Z'
        fill='currentColor'
      ></path>{' '}
    </g>
  </svg>
  //   <svg
  //     fill='currentColor'
  //     viewBox='0 0 32 32'
  //     xmlns='http://www.w3.org/2000/svg'
  //     className={props.className}
  //   >
  //     <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
  //     <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
  //     <g id='SVGRepo_iconCarrier'>
  //       <title></title>
  //       <path d='M26.61,2H10.74a2.9,2.9,0,0,0-.6.07A7.14,7.14,0,0,0,9.21,2,6.62,6.62,0,0,0,7.94,15.12V27.2a2.81,2.81,0,0,0,2.8,2.8H26.61a2.8,2.8,0,0,0,2.8-2.8V4.8A2.8,2.8,0,0,0,26.61,2ZM4.46,8.62a4.76,4.76,0,1,1,4.75,4.76A4.75,4.75,0,0,1,4.46,8.62ZM27.54,27.2a.93.93,0,0,1-.93.93H10.74a.93.93,0,0,1-.93-.93v-12a6.56,6.56,0,0,0,4.14-2,1,1,0,0,0,.24,0h9a.87.87,0,1,0,0-1.74h-8a6.6,6.6,0,0,0-1.34-7.67h12.8a.93.93,0,0,1,.93.93Z'></path>
  //       <path d='M12.2,6.41a.92.92,0,0,0-1.32,0L8.44,8.86,7.54,8A.93.93,0,1,0,6.22,9.28l1.56,1.56a.93.93,0,0,0,.66.27,1,1,0,0,0,.66-.27l3.1-3.11A.92.92,0,0,0,12.2,6.41Z'></path>
  //       <path d='M23.16,15.13h-9a.87.87,0,0,0,0,1.74h9a.87.87,0,1,0,0-1.74Z'></path>
  //       <path d='M23.16,18.72h-9a.87.87,0,1,0,0,1.74h9a.87.87,0,0,0,0-1.74Z'></path>
  //     </g>
  //   </svg>
);

export const OrderCancelAllIcon = (props) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={props.className}
  >
    <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
    <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
    <g id='SVGRepo_iconCarrier'>
      {' '}
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V4C21 2.34315 19.6569 1 18 1H10ZM11 3H18C18.5523 3 19 3.44772 19 4V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3ZM9 7H6.41421L9 4.41421V7ZM12 13.5858L9.70711 11.2929C9.31658 10.9024 8.68342 10.9024 8.29289 11.2929C7.90237 11.6834 7.90237 12.3166 8.29289 12.7071L10.5858 15L8.29289 17.2929C7.90237 17.6834 7.90237 18.3166 8.29289 18.7071C8.68342 19.0976 9.31658 19.0976 9.70711 18.7071L12 16.4142L14.2929 18.7071C14.6834 19.0976 15.3166 19.0976 15.7071 18.7071C16.0976 18.3166 16.0976 17.6834 15.7071 17.2929L13.4142 15L15.7071 12.7071C16.0976 12.3166 16.0976 11.6834 15.7071 11.2929C15.3166 10.9024 14.6834 10.9024 14.2929 11.2929L12 13.5858Z'
        fill='currentColor'
      ></path>{' '}
    </g>
  </svg>
  //   <svg
  //     fill='currentColor'
  //     viewBox='0 0 32 32'
  //     xmlns='http://www.w3.org/2000/svg'
  //     className={props.className}
  //   >
  //     <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
  //     <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
  //     <g id='SVGRepo_iconCarrier'>
  //       <title></title>
  //       <path d='M26.61,2H10.74a2.9,2.9,0,0,0-.6.07A7.14,7.14,0,0,0,9.21,2,6.62,6.62,0,0,0,7.94,15.12V27.2a2.81,2.81,0,0,0,2.8,2.8H26.61a2.8,2.8,0,0,0,2.8-2.8V4.8A2.8,2.8,0,0,0,26.61,2ZM4.46,8.62a4.76,4.76,0,1,1,4.75,4.76A4.75,4.75,0,0,1,4.46,8.62ZM27.54,27.2a.93.93,0,0,1-.93.93H10.74a.93.93,0,0,1-.93-.93v-12a6.56,6.56,0,0,0,4.14-2,1,1,0,0,0,.24,0h9a.87.87,0,1,0,0-1.74h-8a6.6,6.6,0,0,0-1.34-7.67h12.8a.93.93,0,0,1,.93.93Z'></path>
  //       <path d='M10.42,11.15a.94.94,0,0,0,1.32,0,.94.94,0,0,0,0-1.32L10.53,8.62l1.21-1.2a.94.94,0,0,0,0-1.32.92.92,0,0,0-1.32,0L9.21,7.3,8,6.1a.92.92,0,0,0-1.32,0,.94.94,0,0,0,0,1.32l1.21,1.2L6.68,9.83a.94.94,0,0,0,0,1.32,1,1,0,0,0,.66.27A.93.93,0,0,0,8,11.15L9.21,9.94Z'></path>
  //       <path d='M23.16,15.13h-9a.87.87,0,0,0,0,1.74h9a.87.87,0,1,0,0-1.74Z'></path>
  //       <path d='M23.16,18.72h-9a.87.87,0,1,0,0,1.74h9a.87.87,0,0,0,0-1.74Z'></path>
  //     </g>
  //   </svg>
);

export const LoadingIcon = (props) => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' className={props.className}>
    <rect
      fill='currentColor'
      stroke='currentColor'
      strokeWidth='15'
      width='30'
      height='30'
      x='25'
      y='50'
    >
      <animate
        attributeName='y'
        calcMode='spline'
        dur='2'
        values='50;120;50;'
        keySplines='.5 0 .5 1;.5 0 .5 1'
        repeatCount='indefinite'
        begin='-.4'
      ></animate>
    </rect>
    <rect
      fill='currentColor'
      stroke='currentColor'
      strokeWidth='15'
      width='30'
      height='30'
      x='85'
      y='50'
    >
      <animate
        attributeName='y'
        calcMode='spline'
        dur='2'
        values='50;120;50;'
        keySplines='.5 0 .5 1;.5 0 .5 1'
        repeatCount='indefinite'
        begin='-.2'
      ></animate>
    </rect>
    <rect
      fill='currentColor'
      stroke='currentColor'
      strokeWidth='15'
      width='30'
      height='30'
      x='145'
      y='50'
    >
      <animate
        attributeName='y'
        calcMode='spline'
        dur='2'
        values='50;120;50;'
        keySplines='.5 0 .5 1;.5 0 .5 1'
        repeatCount='indefinite'
        begin='0'
      ></animate>
    </rect>
  </svg>
);
