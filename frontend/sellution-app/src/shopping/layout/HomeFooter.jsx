import { Link } from 'react-router-dom';
import {
  HomeIcon,
  SubscriptionDeliveryIcon,
  OneTimeDeliveryIcon,
  MypageIcon,
  CartIcon,
} from '../utility/assets/Icons';
import useAuthStore from '@/shopping/store/stores/useAuthStore';
import useUserInfoStore from '@/shopping/store/stores/useUserInfoStore';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';
import useSubscriptionCartStore from './../store/stores/useSubscriptionCartStore';
import useOnetimeCartStore from './../store/stores/useOnetimeCartStore';

const HomeFooter = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  console.log(accessToken);
  const clientName = useCompanyInfoStore((state) => state.name);
  const customerId = useUserInfoStore((state) => state.id);
  const subscriptionCartCount = useSubscriptionCartStore((state) => state.subscriptionCart.length);
  const onetimeCartCount = useOnetimeCartStore((state) => state.onetimeCart.length);
  const totalCount = subscriptionCartCount + onetimeCartCount;
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
        <SubscriptionDeliveryIcon className='w-7 h-7 fill-current text-brandOrange stroke-brandOrange stroke-[10]' />
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
        to={
          accessToken === null || accessToken === ''
            ? `/shopping/${clientName}/login`
            : `/shopping/${clientName}/my/${customerId}`
        }
        className='flex-1 bg-white flex flex-col justify-center items-center relative'
      >
        <MypageIcon className='w-7 h-7 fill-current text-brandOrange stroke-brandOrange stroke-[10]' />
        <p className='text-brandOrange text-xs font-bold pt-1'>마이페이지</p>
      </Link>
      <Link
        to={
          accessToken === null || accessToken === ''
            ? `/shopping/${clientName}/login?redirectUrl=${encodeURIComponent(window.location.pathname)}`
            : `/shopping/${clientName}/subscription/cart`
        }
        className='flex-1 bg-white flex flex-col justify-center items-center'
      >
        <div className='relative inline-block'>
          <CartIcon className='w-7 h-7 fill-current text-brandOrange stroke-brandOrange stroke-[10]' />
          {totalCount > 0 && (
            <span className='absolute -top-1 -right-2 bg-red-500 text-white rounded-full px-[6px] py-[2px] text-xs min-w-[20px] h-[20px] flex items-center justify-center'>
              {totalCount}
            </span>
          )}
        </div>
        <p className='text-brandOrange text-xs font-bold pt-1'>장바구니</p>
      </Link>
    </nav>
  );
};

export default HomeFooter;
