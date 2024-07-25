import { Link } from 'react-router-dom';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';

const LogoHeaderNav = ({ logoImageUrl }) => {
  const clientName = useCompanyInfoStore((state) => state.name);
  return (
    <header className='fixed top-0 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-lg h-16 flex justify-center items-center bg-white shadow-md'>
      <Link to={`/shopping/${clientName}/home`}>
        <img src={logoImageUrl || '/image/shoppingmall_logo.png'} alt='Shoppingmall Logo' />
      </Link>
    </header>
  );
};

export default LogoHeaderNav;
