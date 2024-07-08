import { NavLink, Outlet } from 'react-router-dom';

const MainHeaderNavLayout = ({ navMenus, isEnd }) => {
  return (
    <div className='w-full h-full flex flex-col'>
      <nav className='h-12 pt-4 flex align-bottom text-base'>
        {navMenus.map((navMenu, index) => (
          <NavLink
            key={index}
            to={`${navMenu.link}`}
            className={({ isActive }) =>
              ` px-2 ${
                isActive
                  ? ' border-b-4 border-brandOrange'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100 border-b-4'
              }`
            }
            end={isEnd}
          >
            {navMenu.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
};

export default MainHeaderNavLayout;
