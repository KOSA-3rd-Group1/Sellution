import { NavLink } from 'react-router-dom';

export const SidebarBtn = ({ to, Icon, content }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `w-full text-base font-normal rounded-lg transition duration-75 flex items-center p-2 ${isActive ? 'text-brandOrange bg-brandOrange-light' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`
    }
  >
    <Icon className='w-5 h-5 flex-shrink-0 group-focus:text-brandOrange transition duration-75' />
    <span className='ml-4'>{content}</span>
  </NavLink>
);
