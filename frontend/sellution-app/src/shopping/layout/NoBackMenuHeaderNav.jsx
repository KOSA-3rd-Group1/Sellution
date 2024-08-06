import { Link } from 'react-router-dom';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';
import { HomeIcon } from '../utility/assets/Icons';

const NoBackMenuHeaderNav = ({ title }) => {
  const clientName = useCompanyInfoStore((state) => state.name);

  return (
    <header className='w-full fixed top-0 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-lg h-14 flex justify-between items-center bg-white px-2 shadow-md'>
      <div className='flex items-center space-x-4'></div>
      <span className='menu-title absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-center w-[55%]'>
        {title}
      </span>
      <Link to={`/shopping/${clientName}/home`}>
        <div className='header-icon header-gohome'>
          <HomeIcon className={'w-6 h-6 fill-current text-gray-600'} />
        </div>
      </Link>
    </header>
  );
};

export default NoBackMenuHeaderNav;
