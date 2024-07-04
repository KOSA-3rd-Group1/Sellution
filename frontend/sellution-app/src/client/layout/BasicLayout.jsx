import NavbarComponent from '@/client/layout/partials/NavbarComponent';
import SidebarCompoent from '@/client/layout/partials/SidebarComponent';
import { Outlet } from 'react-router-dom';

const BasicLayout = () => {
  return (
    <div className='w-dvw h-dvh flex flex-col overflow-hidden'>
      <div className='w-full h-16'>
        <NavbarComponent />
      </div>
      <div className='w-full flex flex-auto'>
        <div className='w-0 lg:w-[250px] flex-shrink-0'>
          <SidebarCompoent />
        </div>
        <main className='h-full p-5 flex-auto bg-green-50'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BasicLayout;
