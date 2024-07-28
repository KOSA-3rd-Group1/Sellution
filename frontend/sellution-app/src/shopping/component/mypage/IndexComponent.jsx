import { useEffect, useState } from 'react';
import {
  AddCustomerIcon,
  DeliveryAddressIcon,
  PaymentIcon,
  CouponIcon,
  OrderDetailIcon,
  ProfileIcon,
  SimplePasswordIcon,
} from '@/shopping/utility/assets/Icons.jsx';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MenuHeaderNav from './../../layout/MenuHeaderNav';
import HomeFooter from './../../layout/HomeFooter';
import useUserInfoStore from '@/shopping/store/stores/useUserInfoStore';
import { RightChevronIcon } from '../../utility/assets/Icons';

const IndexComponent = () => {
  const customerId = useUserInfoStore((state) => state.id);
  const [customerInfo, setCustomerInfo] = useState({ name: '', customerType: '' });

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/customers/mypage/${customerId}`,
        );

        setCustomerInfo(response.data);
      } catch (error) {
        console.error('Error fetching customer info:', error);
      }
    };

    fetchCustomerInfo();
  }, [customerId]);

  const getCustomerTypeText = (type) => {
    switch (type) {
      case 'NEW':
        return '신규회원';
      case 'NORMAL':
        return '일반회원';
      case 'DORMANT':
        return '휴면회원';
      default:
        return '';
    }
  };

  return (
    <>
      <MenuHeaderNav title={'마이페이지'} />
      <div className='space-y-8 px-4'>
        <div className='w-full px-2 py-6'>
          <div className='bg-brandOrange-light rounded-lg p-4 mb-6'>
            <div className='flex items-center'>
              <AddCustomerIcon className='w-10 h-10 mr-6' />
              <p className=' text-sm'>
                <span className='font-bold'>{customerInfo.name}</span>님은{' '}
                <span className='font-bold'>{getCustomerTypeText(customerInfo.customerType)}</span>
                입니다.
              </p>
            </div>
          </div>

          {[
            {
              component: <DeliveryAddressIcon className='w-6 h-6 mr-3 text-gray-400' />,
              text: '배송지 관리',
              link: `address`,
            },
            {
              component: <PaymentIcon className='w-6 h-6 mr-3 text-gray-400' />,
              text: '결제수단 관리',
              link: `payment`,
            },
            {
              component: <CouponIcon className='w-6 h-6 mr-3 text-gray-400' />,
              text: '쿠폰함',
              link: `coupon`,
            },
            {
              component: <OrderDetailIcon className='w-6 h-6 mr-3 text-gray-400' />,
              text: '주문내역 조회',
              link: `order`,
            },
            {
              component: <ProfileIcon className='w-6 h-6 mr-3 text-gray-400' />,
              text: '회원정보수정',
              link: `profile`,
            },
            {
              component: <SimplePasswordIcon className='w-6 h-6 mr-3 text-gray-400' />,
              text: '간편비밀번호 설정',
              link: `auth/edit`,
            },
          ].map((item, index) => (
            <Link key={index} to={item.link} className='block'>
              <div className='flex items-center justify-between py-4 border-b'>
                <div className='flex items-center'>
                  {item.component}
                  <span className='text-sm'>{item.text}</span>
                </div>
                <RightChevronIcon className={'w-4 h-4 text-gray-400'} />
              </div>
            </Link>
          ))}
        </div>
      </div>
      <HomeFooter />
    </>
  );
};

export default IndexComponent;
