import NavbarComponent from '@/client/layout/partials/NavbarComponent';
import SidebarCompoent from '@/client/layout/partials/SidebarComponent';

const BasicLayout = ({ children }) => {
  return (
    <div className='w-dvw h-dvh flex flex-col'>
      <div className='w-[100%] h-[64px]'>
        <NavbarComponent />
      </div>
      <div className='w-full flex flex-auto'>
        <div className='w-0 lg:w-[250px] flex-shrink-0'>
          <SidebarCompoent />
        </div>
        <main className='flex-auto bg-green-50'>{children}</main>
      </div>
    </div>
  );
};

export default BasicLayout;
