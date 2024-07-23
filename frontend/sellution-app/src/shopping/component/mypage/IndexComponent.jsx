import React, { useEffect, useState } from 'react';
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
import { Link, useParams } from 'react-router-dom';

const IndexComponent = () => {
  const { customerId } = useParams(); // useParams를 사용하여 customerId 가져오기
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
    <div className='container mx-auto max-w-lg p-4 bg-white h-screen flex flex-col justify-between'>
      <div className='space-y-8'>
        <div className='w-full scroll-box overflow-auto flex-grow'>
          <div className='w-full px-2 py-6'>
            <div className='bg-[#fff0eb] rounded-lg p-4 mb-6'>
              <div className='flex items-center'>
                <AddCustomerIcon className='w-10 h-10 mr-6' />
                <p className=' text-sm'>
                  <span className='font-bold'>{customerInfo.name}</span>님은{' '}
                  <span className='font-bold'>
                    {getCustomerTypeText(customerInfo.customerType)}
                  </span>
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
                link: `orders`,
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
      </div>
    </div>
  );
};

export default IndexComponent;
