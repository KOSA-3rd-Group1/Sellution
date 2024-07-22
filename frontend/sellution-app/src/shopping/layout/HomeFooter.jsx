import { Link } from 'react-router-dom';
import useClientName from '../business/layout/useClientName';
import {
  HomeIcon,
  SubscriptionDeliveryIcon,
  OneTimeDeliveryIcon,
  MypageIcon,
  CartIcon,
} from '../utility/assets/Icons';

const HomeFooter = () => {
  const { clientName } = useClientName();
  return (
    <nav className='fixed bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-lg h-16 bg-white flex shadow-footer p-1.5'>
      <Link
        to={`/shopping/${clientName}/home`}
        className='flex-1 bg-white flex flex-col justify-center items-center'
      >
        <HomeIcon className='w-7 h-7 fill-current text-brandOrange stroke-brandOrange stroke-[10]' />
        <p className='text-brandOrange text-xs font-bold pt-1'>홈</p>
      </Link>
      <Link
        to={`/shopping/${clientName}/subscription`}
        className='flex-1 bg-white flex flex-col justify-center items-center'
      >
        <SubscriptionDeliveryIcon className='w-7 h-7 fill-current text-[#F37021] stroke-[#F37021] stroke-[10]' />
        <p className='text-brandOrange text-xs font-bold pt-1'>정기배송</p>
      </Link>
      <Link
        to={`/shopping/${clientName}/onetime`}
        className='flex-1 bg-white flex flex-col justify-center items-center'
      >
        <OneTimeDeliveryIcon className='w-7 h-7 fill-current text-brandOrange stroke-brandOrange stroke-[10]' />
        <p className='text-brandOrange text-xs font-bold pt-1'>단건주문</p>
      </Link>
      <Link
        to={`/shopping/${clientName}/my`}
        className='flex-1 bg-white flex flex-col justify-center items-center relative'
      >
        <MypageIcon className='w-7 h-7 fill-current text-brandOrange stroke-brandOrange stroke-[10]' />
        <p className='text-brandOrange text-xs font-bold pt-1'>마이페이지</p>
      </Link>
      <Link
        to={`/shopping/${clientName}/subscription/cart`}
        className='flex-1 bg-white flex flex-col justify-center items-center relative'
      >
        <CartIcon className='w-7 h-7 fill-current text-brandOrange stroke-brandOrange stroke-[10]' />
        <p className='text-brandOrange text-xs font-bold pt-1'>장바구니</p>
        {/* <span className='absolute top-[3px] right-[19px] bg-red-500 text-white rounded-full px-[6px] py-[2px] text-xs'>
        1
      </span> */}
      </Link>
    </nav>
  );
};

export default HomeFooter;
