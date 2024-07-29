import { Outlet } from 'react-router-dom';
import useClientName from '../business/layout/useClientName';
const BasicLayout = () => {
  const { clientName } = useClientName();
  return (
    <div className='flex justify-center h-screen' data-theme={'CustomRoseTheme'}>
      <div
        className={`container-box relative w-full max-w-lg h-full flex flex-col ${location.pathname === `/shopping/${clientName}/home` ? 'pt-16' : 'pt-14'} pb-14`}
      >
        {/* <Header toggleCategoryMenu={toggleCategoryMenu} isCategoryVisible={isCategoryVisible} /> */}
        <div className={`w-full h-full scroll-box overflow-auto flex-grow`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BasicLayout;
