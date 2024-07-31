import { Link } from 'react-router-dom';
import { useNavbar } from '@/client/business/layout/useNavbar';
import {
  HambergerIcon,
  HambergerCloseIcon,
  NotificationIcon,
  PlusCircleIcon,
  ClockIcon,
} from '@/client/utility/assets/Icons';

const NavbarComponent = (props) => {
  const { isOpen, dropdownRef, toggleDropdown, selectLogoutBtn } = useNavbar();

  return (
    <nav className='w-full h-full flex justify-between items-center bg-navbarBackground'>
      <div className='px-3 py-3 lg:px-5 flex-1'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center justify-start'>
            <button
              onClick={props.toggleSidebar}
              className='lg:hidden mr-2 p-2 text-gray-500 hover:text-gray-400 hover:bg-gray-800 focus:bg-gray-800 focus:ring-2 focus:ring-gray-700 rounded cursor-pointer'
            >
              <HambergerIcon className={`w-6 h-6 ${props.isSidebarOpen ? 'hidden' : ''}`} />
              <HambergerCloseIcon className={`w-6 h-6 ${props.isSidebarOpen ? '' : 'hidden'}`} />
            </button>
            <Link to={'/home'} className='flex items-center lg:ml-2.5 text-xl font-bold'>
              <span className='text-white whitespace-nowrap'>Sellution</span>
            </Link>
          </div>
          <div className='flex items-center gap-4 text-white'>
            <div className='flex items-center gap-2 flex-shrink-0'>
              <div className='w-3 row-center-position'>
                <ClockIcon />
              </div>
              <div className='row-center-position text-xs'>23:55</div>
              <div className='w-4 row-center-position'>
                <PlusCircleIcon />
              </div>
            </div>
            <button className='w-9 h-9 p-2 bg-gray-500 hover:bg-gray-400 focus:ring-2 focus:ring-gray-200 rounded-lg'>
              <NotificationIcon />
            </button>
            <div className='relative w-[150px] h-9 mr-3 lg:mr-1' ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className='w-full h-full px-2 truncate text-xs bg-gray-500 hover:bg-gray-400 focus:ring-2 focus:ring-gray-200 rounded-lg'
              >
                {props.userName}
              </button>
              {isOpen && (
                <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg text-center'>
                  <ul className='py-1 overflow-auto text-xs rounded-md max-h-60 focus:outline-none sm:text-xs'>
                    <li
                      onClick={() => selectLogoutBtn()}
                      className='flex justify-center items-center px-4 py-2 text-gray-900 cursor-pointer bg-gray-200 hover:bg-gray-300'
                    >
                      <span className='text-gray-700 font-semibold'>로그아웃</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
