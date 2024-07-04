import { Link } from 'react-router-dom';

const NavbarComponent = () => {
  return (
    <nav className='w-full h-full bg-navbarBackground'>
      <div className='px-3 py-3 lg:px-5'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center justify-start'>
            <button
              id='toggleSidebarMobile'
              aria-expanded='true'
              aria-controls='sidebar'
              className='lg:hidden mr-2 text-gray-500 hover:text-gray-400 cursor-pointer p-2 hover:bg-gray-800 focus:bg-gray-800 focus:ring-2 focus:ring-gray-700 rounded'
            >
              <svg
                id='toggleSidebarMobileHamburger'
                className='w-6 h-6'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                  clipRule='evenodd'
                ></path>
              </svg>
              <svg
                id='toggleSidebarMobileClose'
                className='w-6 h-6 hidden'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                ></path>
              </svg>
            </button>
            <Link to={'/home'} className='text-xl font-bold flex items-center lg:ml-2.5'>
              <span className='text-white whitespace-nowrap'>Sellution</span>
            </Link>
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2 flex-shrink-0'>
              <div className='w-3 row-center-position'>
                <svg fill='#ffffff' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'>
                  <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                  <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                  <g id='SVGRepo_iconCarrier'>
                    <path d='M8.06.56A8.05 8.05 0 0 0 1.24 4.2V1.55H0V5a1.16 1.16 0 0 0 1.15 1.14h3.44V4.9H2.27a6.79 6.79 0 0 1 5.79-3.1 6.48 6.48 0 0 1 6.7 6.2 6.48 6.48 0 0 1-6.7 6.2A6.48 6.48 0 0 1 1.36 8H.12a7.71 7.71 0 0 0 7.94 7.44A7.71 7.71 0 0 0 16 8 7.71 7.71 0 0 0 8.06.56z'></path>
                    <path d='M7.44 4.28v4.34h3.6V7.38H8.68v-3.1H7.44z'></path>
                  </g>
                </svg>
              </div>
              <div className='row-center-position text-xs text-white'>23:55</div>
              <div className='w-4 row-center-position'>
                <svg
                  fill='#ffffff'
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
              </div>
            </div>
            <button className='w-9 h-9 p-2 bg-gray-500 hover:bg-gray-400 focus:ring-2 focus:ring-gray-200 rounded-lg'>
              <svg fill='#ffffff' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'>
                <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
                <g id='SVGRepo_iconCarrier'>
                  <path d='m13.58 11.6-1.33-2.18V6.33A4.36 4.36 0 0 0 10 2.26a2.45 2.45 0 0 0 0-.38A1.94 1.94 0 0 0 8 0a1.94 1.94 0 0 0-2 1.88 1.64 1.64 0 0 0 0 .38 4.36 4.36 0 0 0-2.25 4.07v3.09L2.42 11.6a1.25 1.25 0 0 0 1.06 1.9h1.77A2.68 2.68 0 0 0 8 16a2.68 2.68 0 0 0 2.75-2.5h1.77a1.25 1.25 0 0 0 1.06-1.9zM7.25 1.88A.7.7 0 0 1 8 1.25a.7.7 0 0 1 .75.63 6 6 0 0 0-.75 0 5.9 5.9 0 0 0-.75 0zM8 14.75a1.44 1.44 0 0 1-1.5-1.25h3A1.44 1.44 0 0 1 8 14.75zm-4.52-2.5 1.34-2.17.18-.31V6.33a4 4 0 0 1 .6-2.12A2.68 2.68 0 0 1 8 3.12a2.68 2.68 0 0 1 2.4 1.09 4 4 0 0 1 .6 2.12v3.44l.18.31 1.34 2.17z'></path>
                </g>
              </svg>
            </button>
            <button className='w-[150px] h-9 text-white bg-gray-500 hover:bg-gray-400 focus:ring-2 focus:ring-gray-200 rounded-lg text-xs items-center'>
              테스트 관리자
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
