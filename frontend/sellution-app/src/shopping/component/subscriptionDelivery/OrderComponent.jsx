import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { TrashIcon } from '@/client/utility/assets/Icons.jsx';

const OrderComponent = () => {
  const [selectedDays, setSelectedDays] = useState(['MON', 'WED', 'FRI']);
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { clientName, customerId } = useParams();

  // 첫 번째 useEffect: 컴포넌트 마운트 시 주소 가져오기
  useEffect(() => {
    console.log('OrderComponent mounted');
    fetchAddresses();
    return () => {
      console.log('OrderComponent unmounted');
    };
  }, [customerId]);

  // 두 번째 useEffect: 저장된 주소 설정하기
  useEffect(() => {
    console.log('Checking for saved address');
    const savedAddress = localStorage.getItem('selectedAddress');
    if (savedAddress) {
      console.log('Found saved address:', savedAddress);
      setSelectedAddress(JSON.parse(savedAddress));
      localStorage.removeItem('selectedAddress');
    }
  }, [addresses]);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/addresses/customer/${customerId}`,
      );
      setAddresses(response.data);
      const savedAddress = localStorage.getItem('selectedAddress');
      if (savedAddress) {
        console.log('Setting saved address from fetchAddresses:', savedAddress);
        setSelectedAddress(JSON.parse(savedAddress));
        localStorage.removeItem('selectedAddress');
      } else {
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
    navigate(`/shopping/${clientName}/ordersheet/setting/address/${customerId}`);
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
    <div className='container mx-auto max-w-lg p-4 bg-gray-100 h-screen overflow-y-auto'>
      <div className='space-y-4'>
        <h1 className='text-xl font-bold border-b pb-2 mb-4'>주문 / 결제</h1>

        <div className='mb-6 bg-white rounded-lg shadow-md p-4'>
          <div className='flex justify-between items-center mb-2'>
            <h2 className='text-lg font-semibold mb-2'>
              배송지 {selectedAddress && `(${selectedAddress.addressName})`}
            </h2>
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

        {/* 정기 배송 설정 섹션 */}
        <div className='mb-6 bg-white rounded-lg shadow-md p-4'>
          <h2 className='text-lg font-semibold mb-4'>정기 배송 설정</h2>

          <div className='mb-4'>
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

        <div className='mb-6 bg-white rounded-lg shadow-md p-4'>
          <h2 className='text-lg font-semibold mb-2'>할인쿠폰</h2>
          <select className='w-full p-2 border rounded'>
            <option>신규회원 10% 할인 쿠폰</option>
          </select>
        </div>

        <div className='mb-6 bg-white rounded-lg shadow-md p-4'>
          <h2 className='text-lg font-semibold mb-4'>결제 예상 금액</h2>
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

        <div className='bg-white rounded-lg shadow-md p-4'>
          <h2 className='text-lg font-semibold mb-4'>결제 정보</h2>
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
    </div>
  );
};

export default OrderComponent;
