import React, { useEffect, useState } from 'react'; // eslint-disable-line no-unused-vars
import MenuHeaderNav from '../../layout/MenuHeaderNav';
import HomeFooter from '../../layout/HomeFooter';

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
import useClientName from '../../business/layout/useClientName';

const IndexComponent = () => {
  const [customerInfo, setCustomerInfo] = useState({ name: '', customerType: '' });
  const { clientName } = useClientName();

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/mypage`, {
          params: { username: 'user1' },
        });

        setCustomerInfo(response.data);
      } catch (error) {
        console.error('Error fetching customer info:', error);
      }
    };

    fetchCustomerInfo();
  }, []);

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
      <div className='w-full scroll-box overflow-auto flex-grow'>
        <div className='w-full px-2 py-6'>
          <div className='bg-[#fff0eb] rounded-lg p-4 mb-6'>
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
              link: '/shopping/testcompany/my/address',
            },
            {
              component: <PaymentIcon className='w-6 h-6 mr-3 text-gray-400' />,
              text: '결제수단 관리',
            },
            {
              component: <CouponIcon className='w-6 h-6 mr-3 text-gray-400' />,
              text: '쿠폰함',
              link: `/shopping/${clientName}/my/coupon`,
            },
            {
              component: <OrderDetailIcon className='w-6 h-6 mr-3 text-gray-400' />,
              text: '주문내역 조회',
            },
            {
              component: <ProfileIcon className='w-6 h-6 mr-3 text-gray-400' />,
              text: '회원정보수정',
            },
            {
              component: <SimplePasswordIcon className='w-6 h-6 mr-3 text-gray-400' />,
              text: '간편비밀번호 설정',
            },
          ].map((item, index) => (
            <Link key={index} to={item.link} className='block'>
              <div key={index} className='flex items-center justify-between py-4 border-b'>
                <div className='flex items-center'>
                  {item.component}
                  <span className='text-sm'>{item.text}</span>
                </div>
                <svg
                  className='w-4 h-4 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M9 5l7 7-7 7'
                  ></path>
                </svg>
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
