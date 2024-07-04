import { NavLink, Outlet } from 'react-router-dom';

const MainHeaderNavLayout = ({ navMenus }) => {
  return (
    <>
      <nav>
        {navMenus.map((navMenu, index) => (
          <NavLink
            key={index}
            to={`${navMenu.link}`} // 절대 경로로 설정
            className={({ isActive }) =>
              isActive
                ? 'text-brandOrange bg-brandOrange-light'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }
          >
            {navMenu.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </>
  );
};

export default MainHeaderNavLayout;
