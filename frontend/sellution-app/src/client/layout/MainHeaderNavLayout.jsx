import { NavLink, Outlet } from 'react-router-dom';

const MainHeaderNavLayout = (props) => {
  return (
    <>
      <nav>
        {props.nav.map(([path, label], index) => (
          <NavLink
            key={index}
            to={`${path}`} // 절대 경로로 설정
            className={({ isActive }) =>
              isActive
                ? 'text-brandOrange bg-brandOrange-light'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </>
  );
};

export default MainHeaderNavLayout;
