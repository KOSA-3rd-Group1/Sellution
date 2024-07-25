import MenuHeaderNav from '../../layout/MenuHeaderNav';
import useOrderListStore from './../../store/stores/useOrderListStore';
import OneButtonFooterLayout from './../../layout/OneButtonFooterLayout';
import OrderListLayout from '../../layout/OrderListLayout';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { TrashIcon } from '@/client/utility/assets/Icons.jsx';
import useClientName from '../../business/layout/useClientName';
import axios from 'axios';
import {
  HanaBankIcon,
  IBKIcon,
  KakaoBankIcon,
  KookminBankIcon, NonghyupBankIcon, PostBankIcon,
  ShinhanBankIcon, TossBankIcon,
  WooriBankIcon
} from "@/client/utility/assets/BankIcons.jsx";

const OrderComponent = () => {
  const BANK_CODES = {
    '004': '국민은행',
    '090': '카카오뱅크',
    '088': '신한은행',
    '020': '우리은행',
    '003': '기업은행',
    '092': '토스뱅크',
    '071': '우체국은행',
    '011': '농협은행',
    '081': '하나은행'
  };
// 은행 코드와 은행 로고 매핑하는 객체
  const BANK_LOGO = {
    '004': KookminBankIcon,
    '090': KakaoBankIcon,
    '088': ShinhanBankIcon,
    '020': WooriBankIcon,
    '003': IBKIcon,
    '092': TossBankIcon,
    '071': PostBankIcon,
    '011': NonghyupBankIcon,
    '081': HanaBankIcon,
  };

// 은행 코드에 따른 배경색 매핑
  const BANK_COLORS = {
    '004': 'bg-yellow-400',
    '090': 'bg-yellow-300',
    '088': 'bg-sky-200',
    '020': 'bg-sky-300',
    '003': 'bg-sky-400',
    '092': 'bg-blue-400',
    '071': 'bg-orange-400',
    '011': 'bg-green-200',
    '081': 'bg-green-500'
  };

  const { orderList } = useOrderListStore();
  //목록 선택
  const listToShow = orderList;

  // 주소~ 정기배송 주문 추가사항
  const [selectedDays, setSelectedDays] = useState(['MON', 'WED', 'FRI']);
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { clientName, customerId } = useParams();
  const location = useLocation();

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!customerId) {
        console.error('customerId가 없습니다.');
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/accounts/customers/${customerId}`);
        const accounts = response.data.content.map(account => ({
          id: account.accountId,
          bank: BANK_CODES[account.bankCode] || '알 수 없는 은행',
          accountNumber: maskAccountNumber(account.accountNumber),
          bankCode: account.bankCode,
          isChecked: false
        }));
        setPaymentMethods(accounts);
      } catch (error) {
        console.error('계좌 정보를 가져오는 데 실패했습니다:', error);
      }
    };

    fetchAccounts();
  }, [customerId]);

  // 첫 번째 useEffect: 컴포넌트 마운트 시 주소 가져오기
  useEffect(() => {
    console.log('OrderComponent mounted');
    const fetchData = async () => {
      await fetchAddresses();
      checkForSavedAddress();
    };
    fetchData();
    return () => {
      console.log('OrderComponent unmounted');
    };
  }, [customerId]);

  useEffect(() => {
    if (location.state && location.state.selectedAddress) {
      console.log('Setting address from location state:', location.state.selectedAddress);
      setSelectedAddress(location.state.selectedAddress);
    }
  }, [location]);

  // 계좌번호 마스킹 함수
  const maskAccountNumber = (accountNumber) => {
    if (accountNumber.length <= 4) return accountNumber;
    return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  };


  const checkForSavedAddress = () => {
    console.log('Checking for saved address');
    const savedAddress = localStorage.getItem('selectedAddress');
    if (savedAddress) {
      console.log('Found saved address:', savedAddress);
      setSelectedAddress(JSON.parse(savedAddress));
      localStorage.removeItem('selectedAddress');
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/addresses/customer/${customerId}`,
      );
      setAddresses(response.data);
      if (!selectedAddress) {
        const defaultAddress = response.data.find((addr) => addr.isDefaultAddress === 'Y');
        setSelectedAddress(defaultAddress || null);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleAddressChange = () => {
    navigate(`/shopping/${clientName}/ordersheet/setting/address/${customerId}`, {
      state: { returnToOrder: true },
    });
  };

  const handleAddPaymentMethod = () => {
    navigate(`/shopping/${clientName}/my/${customerId}/payment/add`);
  };

  const [paymentMethods, setPaymentMethods] = useState([]);

  const handleCheckChange = (id) => {
    setPaymentMethods(
      paymentMethods.map((method) =>
        method.id === id
          ? { ...method, isChecked: true }
          : { ...method, isChecked: false }
      ),
    );
  };


  const handleDeleteAccount = async (id) => {
    if (window.confirm('해당 계좌를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/accounts/${id}`);
        setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
        alert('계좌가 성공적으로 삭제되었습니다.');
      } catch (error) {
        console.error('계좌 삭제에 실패했습니다:', error);
        alert('계좌 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const formatPhoneNumber = (value) => {
    const cleaned = ('' + value).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return value;
  };

  return (
    <>
      <MenuHeaderNav title={'주문 / 결제'} />
      <div className='flex flex-col items-center w-full'>
        <OrderListLayout listToShow={listToShow} />
        <div className='seperator w-full h-4 bg-gray-100'></div>
        {/*  */}
        <div className='mb-6 bg-white py-4 w-[90%]'>
          <div className='flex justify-between items-center mb-2'>
            <span className='block py-2 font-bold'>
              배송지 {selectedAddress && `(${selectedAddress.addressName})`}
            </span>
            <button
              onClick={handleAddressChange}
              className='text-gray-500 border border-gray-300 rounded px-2 py-1 text-sm'
            >
              {addresses.length > 0 ? '변경' : '추가'}
            </button>
          </div>
          {selectedAddress ? (
            <div className='space-y-2'>
              <div>
                <span className='text-brandOrange mr-2'>*</span>이름: {selectedAddress.name}
              </div>
              <div>
                <span className='text-brandOrange mr-2'>*</span>연락처:{' '}
                {formatPhoneNumber(selectedAddress.phoneNumber)}
              </div>
              <div>
                <span className='text-brandOrange mr-2'>*</span>주소:{' '}
                {selectedAddress.streetAddress} {selectedAddress.addressDetail}
              </div>
            </div>
          ) : (
            <div className='text-gray-500'>등록된 배송지가 없습니다. 배송지를 추가해주세요.</div>
          )}
          <select className='w-full mt-2 p-2 border rounded'>
            <option>배송요청사항 선택</option>
            <option>문앞에 두고 가주세요</option>
            <option>경비실에 맡겨 주세요</option>
            <option>직접 수령할게요</option>
          </select>
        </div>
        <div className='seperator w-full h-4 bg-gray-100'></div>

        <div className='seperator w-full h-4 bg-gray-100'></div>

        <div className='mb-6 bg-white py-4 w-[90%]'>
          <span className='block py-2 mb-2 font-bold'>할인쿠폰</span>
          <select className='w-full p-2 border rounded'>
            <option>신규회원 10% 할인 쿠폰</option>
          </select>
        </div>
        <div className='seperator w-full h-4 bg-gray-100'></div>

        <div className='mb-6 bg-white py-4 w-[90%]'>
          <span className='block py-2 mb-2 font-bold'>결제 예상 금액</span>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>총 상품 금액</span>
              <span>47,000원</span>
            </div>
            <div className='flex justify-between text-blue-500'>
              <span>쿠폰 할인</span>
              <span>- 4,700원</span>
            </div>
            <div className='flex justify-between text-gray-500'>
              <span>상품 할인</span>
              <span>0원</span>
            </div>
            <div className='flex justify-between font-bold mt-2 pt-2 border-t'>
              <span>총 결제 금액</span>
              <span className='text-brandOrange'>46,300원</span>
            </div>
          </div>
        </div>
        <div className='seperator w-full h-4 bg-gray-100'></div>

        <div className='bg-white py-4 w-[90%]'>
          <span className='block py-2 mb-2 font-bold'>결제 수단</span>

          <div className='overflow-x-auto'>
            <div className='flex space-x-4 pb-4'>
              {paymentMethods.map((method) => {
                const BankIcon = BANK_LOGO[method.bankCode] || (() => null);
                return (
                  <div
                    key={method.id}
                    className={`${BANK_COLORS[method.bankCode] || 'bg-gray-400'} rounded-lg p-4 flex flex-col justify-between shadow-md relative w-64 h-36 flex-shrink-0`}
                  >
                    <div className='flex items-center'>
                      <BankIcon className='w-8 h-8 mr-2' />
                      <div className='text-xs'>{method.bank}</div>
                    </div>
                    <div className='absolute bottom-4'>
                      <div className='font-semibold'>계좌번호</div>
                      <div>{method.accountNumber}</div>
                    </div>
                    <button
                      onClick={() => handleCheckChange(method.id)}
                      className='absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center'
                    >
                      {method.isChecked && <span className='text-brandOrange'>✓</span>}
                    </button>
                    <button
                      onClick={() => handleDeleteAccount(method.id)}
                      className='absolute bottom-4 right-4'
                    >
                      <TrashIcon className='w-6 h-6 text-gray-500' />
                    </button>
                  </div>
                );
              })}

              <button
                onClick={handleAddPaymentMethod}
                className='border border-gray-300 rounded-lg p-4 w-64 h-36 flex flex-col justify-center items-center shadow-md flex-shrink-0'
              >
                <span className='text-2xl mr-2'>+</span>
                결제 수단 추가
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*  */}
      <OneButtonFooterLayout footerText={'결제하기'} />
    </>
  );
};

export default OrderComponent;
