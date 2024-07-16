import NavbarComponent from '@/client/layout/partials/NavbarComponent';
import SidebarCompoent from '@/client/layout/partials/SidebarComponent';
import { Outlet } from 'react-router-dom';
import useSidebarStore from '../store/stores/useSidebarStore';

const BasicLayout = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  const userName = '테스트 관리자';
  const companyName = '테스트 회사';

  return (
    <div className='w-dvw h-dvh flex flex-col overflow-auto'>
      <div className='w-full h-16 z-30'>
        <NavbarComponent
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          userName={userName}
        />
      </div>
      <div className='w-full flex-auto flex'>
        <div
          className={`w-[250px] h-[calc(100%-64px)] lg:h-full absolute lg:relative ${isSidebarOpen ? 'block' : 'hidden'} lg:block flex-shrink-0 z-30`}
        >
          <SidebarCompoent companyName={companyName} />
        </div>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className='fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20'
            onClick={toggleSidebar}
          ></div>
        )}

        <main className='relative h-full p-5 flex-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BasicLayout;
