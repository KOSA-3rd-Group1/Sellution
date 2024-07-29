import { Link, useLocation, useNavigate } from 'react-router-dom';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';
import { HomeIcon, LeftArrowIcon } from '../utility/assets/Icons';

const MenuHeaderNav = ({ title }) => {
  const clientName = useCompanyInfoStore((state) => state.name);
  const navigate = useNavigate();
  const handleBack = () => {
    if (
      location.pathname === `/shopping/${clientName}/onetime/cart` ||
      location.pathname === `/shopping/${clientName}/subscription/cart`
    ) {
      navigate(`/shopping/${clientName}/home`);
    } else {
      navigate(-1);
    }
  };
  return (
    <header className='fixed top-0 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-lg h-14 flex justify-between items-center bg-white px-2 shadow-md'>
      <div className='flex items-center space-x-4'>
        <button className='header-icon header-prev' onClick={handleBack}>
          <LeftArrowIcon className={'w-6 h-6 stroke-current text-gray-600'} />
        </button>
      </div>
      <span className='menu-title absolute left-1/2 transform -translate-x-1/2 font-bold text-lg'>
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

export default MenuHeaderNav;
