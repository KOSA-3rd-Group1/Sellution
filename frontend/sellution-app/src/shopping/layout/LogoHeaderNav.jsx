import { Link } from 'react-router-dom';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';

const LogoHeaderNav = () => {
  const clientName = useCompanyInfoStore((state) => state.name);
  const logoImageUrl = useCompanyInfoStore((state) => state.logoImageUrl);
  return (
    <header className='fixed top-0 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-lg h-16 bg-white shadow-md'>
      <Link
        to={`/shopping/${clientName}/home`}
        className='h-full w-full flex justify-center items-center py-3'
      >
        <img
          src={logoImageUrl || '/image/shoppingmall_logo.png'}
          alt='Shoppingmall Logo'
          className='h-full'
        />
      </Link>
    </header>
  );
};

export default LogoHeaderNav;
