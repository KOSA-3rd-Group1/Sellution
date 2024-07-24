import MenuHeaderNav from '../../layout/MenuHeaderNav';
import useOrderListStore from './../../store/stores/useOrderListStore';
import OneButtonFooterLayout from './../../layout/OneButtonFooterLayout';
import OrderListLayout from '../../layout/OrderListLayout';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { TrashIcon } from '@/client/utility/assets/Icons.jsx';
import useClientName from '../../business/layout/useClientName';
import axios from 'axios';

const OrderComponent = () => {
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
    navigate(`/shopping/${clientName}/ordersheet/setting/payment`);
  };

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, bank: 'KB국민은행', accountNumber: '123*****987', isChecked: true },
  ]);

  const handleCheckChange = (id) => {
    setPaymentMethods(
      paymentMethods.map((method) =>
        method.id === id ? { ...method, isChecked: !method.isChecked } : method,
      ),
    );
  };

  const handleDeleteAccount = (id) => {
    if (window.confirm('해당 계좌를 삭제하시겠습니까?')) {
      setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
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
          </select>
        </div>
        <div className='seperator w-full h-4 bg-gray-100'></div>

        {/* 정기 배송 설정 섹션 */}
        <div className='mb-6 bg-white py-4 w-[90%] space-y-5'>
          <span className='block py-2 mb-2 font-bold'>정기 배송 설정</span>
          <div>
            <h3 className='text-brandOrange mb-2'>* 배송 요일</h3>
            <div className='flex justify-between'>
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    selectedDays.includes(day)
                      ? 'bg-orange-500 text-white'
                      : 'border border-gray-300 text-gray-500'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className='mb-4'>
            <h3 className='text-brandOrange mb-2'>* 배송 주기</h3>
            <select className='w-full p-2 border rounded'>
              <option>1주마다 배송</option>
              {/* 백엔드에서 받은 데이터로 옵션을 채우세요 */}
            </select>
          </div>

          <div className='mb-4'>
            <h3 className='text-brandOrange mb-2'>* 배송 횟수</h3>
            <select className='w-full p-2 border rounded'>
              <option>8회</option>
              {/* 백엔드에서 받은 데이터로 옵션을 채우세요 */}
            </select>
          </div>

          <div>
            <h3 className='text-brandOrange mb-2'>* 배송 시작일</h3>
            <input type='date' className='w-full p-2 border rounded' defaultValue='2024-06-24' />
          </div>
        </div>
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
            <div className='flex justify-between'>
              <span>배송비</span>
              <span>4,000원</span>
            </div>
            <div className='flex justify-between font-bold mt-2 pt-2 border-t'>
              <span>총 결제 금액</span>
              <span className='text-brandOrange'>46,300원</span>
            </div>
          </div>
        </div>
        <div className='seperator w-full h-4 bg-gray-100'></div>

        <div className='bg-white py-4 w-[90%]'>
          <span className='block py-2 mb-2 font-bold'>결제 정보</span>
          <div className='flex items-center mb-4'>
            <div className='text-brandOrange mr-2'> * </div>
            <span className='font-semibold'>CMS</span>
          </div>

          <div className='overflow-x-auto'>
            <div className='flex space-x-4 pb-4'>
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className='bg-yellow-400 rounded-lg p-4 flex flex-col justify-between shadow-md relative w-64 h-36 flex-shrink-0'
                >
                  <div>
                    <img src='/path-to-kb-logo.png' alt={method.bank} className='w-8 h-8 mb-2' />
                    <div className='absolute bottom-4'>
                      <div className='font-semibold'>계좌번호</div>
                      <div>{method.accountNumber}</div>
                    </div>
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
              ))}

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
