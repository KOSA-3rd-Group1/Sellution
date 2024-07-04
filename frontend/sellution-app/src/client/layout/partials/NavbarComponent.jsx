import { Link } from 'react-router-dom';
import {
  HambergerIcon,
  HambergerCloseIcon,
  NotificationIcon,
  PlusCircleIcon,
  ClockIcon,
} from '@/client/utility/assets/Icons';

const NavbarComponent = (props) => {
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
            <button className='w-[150px] h-9 mr-3 lg:mr-1 text-xs bg-gray-500 hover:bg-gray-400 focus:ring-2 focus:ring-gray-200 rounded-lg'>
              {props.userName}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
