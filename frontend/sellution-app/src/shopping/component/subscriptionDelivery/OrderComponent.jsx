import MenuHeaderNav from '../../layout/MenuHeaderNav';
import useOrderListStore from './../../store/stores/useOrderListStore';
import OneButtonFooterLayout from './../../layout/OneButtonFooterLayout';

import React, { useState } from 'react'; // eslint-disable-line no-unused-vars
import { useNavigate } from 'react-router-dom';
import { TrashIcon } from '@/client/utility/assets/Icons.jsx';

const OrderComponent = () => {
  const { orderList } = useOrderListStore();
  //목록 선택
  const listToShow = orderList;

  return (
    <>
      <MenuHeaderNav title={'주문 / 결제'} />
      <div className='flex flex-col items-center w-full'>
        <section className='w-[90%]'>
          <span className='block py-2 border-b font-bold'>주문 상품</span>
          {/* orderList start*/}
          <ul className='list-none p-0 m-0'>
            {listToShow.length === 0 ? (
              <li className='flex items-center justify-center py-4'>
                <span className='text-gray-600'>추가한 상품이 없습니다.</span>
              </li>
            ) : (
              listToShow.map((item, index) => (
                <li
                  key={index}
                  className='flex items-center border-b py-4'
                  style={{ height: 'calc((100vh - 10rem) / 5)' }}
                >
                  <div className='flex-1 flex justify-center items-center h-full'>
                    <div
                      className='h-full aspect-square rounded-lg bg-cover'
                      style={{ backgroundImage: `url('/image/nike2.png')` }}
                    ></div>
                  </div>
                  <div className='flex-2 px-2'>
                    <div className='flex flex-col justify-center h-full font-bold text-sm'>
                      <div>{item.name}</div>
                      <div className='flex items-center mt-4'>
                        <span className='text-gray-600 text-xs'>수량: {item.quantity} 팩</span>
                        <span className='mx-2 text-gray-600 text-xs'>|</span>
                        <span className='text-dark-orange text-xs'>{item.cost} 원</span>
                      </div>
                    </div>
                  </div>
                  <div className='flex-1'></div>
                </li>
              ))
            )}
          </ul>
          {/* orderList end */}
        </section>
      </div>
      <OneButtonFooterLayout footerText={'결제하기'} />
    </>
  );
  const [selectedDays, setSelectedDays] = useState(['MON', 'WED', 'FRI']);
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const navigate = useNavigate();

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleAddressAdd = () => {
    navigate('/shopping/page/ordersheet/setting/address/ListComponent');
  };

  const handleAddPaymentMethod = () => {
    navigate('@/shopping/page/ordersheet/setting/payment/AddComponent');
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

  return (
    // <body className='flex justify-center h-screen'>
    //   <div
    //     className={`container-box relative w-full max-w-lg h-full flex justify-center ${location.pathname === '/' ? 'pt-16' : 'pt-14'} ${location.pathname === '/sub-item/info' ? 'pb-0' : 'pb-14'}`}
    //   >
    //     <div className='w-full scroll-box overflow-auto flex-grow'>
    <div className='container mx-auto max-w-lg p-4 bg-gray-100 h-screen overflow-y-auto'>
      <div className='space-y-4'>
        <h1 className='text-xl font-bold border-b pb-2 mb-4'>주문 / 결제</h1>

        <div className='mb-6 bg-white rounded-lg shadow-md p-4'>
          <h2 className='text-lg font-semibold mb-2'>주문상품</h2>
          <div className='space-y-4'>
            {[1, 2].map((item) => (
              <div key={item} className='flex items-center space-x-4'>
                <img
                  src='/path-to-salad-image.jpg'
                  alt='케이준 샐러드'
                  className='w-20 h-20 object-cover rounded'
                />
                <div>
                  <h3 className='font-medium'>케이준 샐러드</h3>
                  <p className='text-sm text-gray-600'>수량: 2개</p>
                  <p className='text-brandOrange font-medium'>16,000원</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='mb-6 bg-white rounded-lg shadow-md p-4'>
          <div className='flex justify-between items-center mb-2'>
            <h2 className='text-lg font-semibold mb-2'>기본 배송지</h2>
            <button
              onClick={handleAddressAdd}
              className='text-gray-500 border border-gray-300 rounded px-2 py-1 text-sm'
            >
              추가
            </button>
          </div>
          <div className='space-y-2'>
            {['이름', '연락처', '주소', '요청사항'].map((field) => (
              <div key={field} className='flex items-center'>
                <span className='text-brandOrange mr-2'>*</span>
                <span>{field}</span>
              </div>
            ))}
          </div>
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
    // </body>
  );

  //<div>정기배송 주문 페이지</div>;
};

export default OrderComponent;
