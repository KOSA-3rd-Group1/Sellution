import { Outlet } from 'react-router-dom';
const BasicLayout = () => {
  return (
    <div className='flex justify-center h-screen'>
      <div
        className={`container-box relative w-full max-w-lg h-full flex justify-center ${location.pathname === '/' ? 'pt-16' : 'pt-14'} ${location.pathname === '/sub-item/info' ? 'pb-0' : 'pb-14'}`}
      >
        {/* <Header toggleCategoryMenu={toggleCategoryMenu} isCategoryVisible={isCategoryVisible} /> */}
        {/* <div className={`w-full scroll-box ${isScrollDisabled ? 'overflow-hidden' : 'overflow-auto'} flex-grow`}> */}
        <Outlet />
        {/* </div> */}
      </div>
    </div>
  );
};

export default BasicLayout;
