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
