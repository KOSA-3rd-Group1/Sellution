import NavbarComponent from '@/client/layout/partials/NavbarComponent';
import SidebarCompoent from '@/client/layout/partials/SidebarComponent';
import { Outlet } from 'react-router-dom';
import useSidebarStore from '../store/stores/useSidebarStore';
import useUserInfoStore from '../store/stores/useUserInfoStore';

const BasicLayout = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  const { name, contractCompanyName } = useUserInfoStore((state) => ({
    name: state.name,
    contractCompanyName: state.contractCompanyName,
  }));

  return (
    <div className='w-dvw h-dvh flex flex-col overflow-auto'>
      <div className='w-full h-16 z-50'>
        <NavbarComponent
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          userName={name}
        />
      </div>
      <div className='w-full flex-auto flex'>
        <div
          className={`w-[250px] h-[calc(100%-64px)] lg:h-full absolute lg:relative ${isSidebarOpen ? 'block' : 'hidden'} lg:block flex-shrink-0 z-50`}
        >
          <SidebarCompoent companyName={contractCompanyName} />
        </div>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className='fixed inset-0 bg-black bg-opacity-50 lg:hidden z-[49]'
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
