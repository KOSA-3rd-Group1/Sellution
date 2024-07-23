import React, { useState } from 'react'; // eslint-disable-line no-unused-vars
import axios from 'axios';

const AddComponent = () => {
  const [addressName, setAddressName] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const DisplayStatus = {
    N: 'N',
    Y: 'Y',
  };
  const [isDefaultAddress, setIsDefaultAddress] = useState(DisplayStatus.N);

  const handleComplete = (data) => {
    setZipcode(data.zonecode);
    setStreetAddress(data.address);
    setAddressDetail('');
  };

  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: handleComplete,
    }).open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const addressData = {
      customerId: 1, // 실제 사용 시 로그인한 사용자의 ID로 대체
      addressName,
      name,
      phoneNumber,
      zipcode,
      streetAddress,
      addressDetail,
      isDefaultAddress: isDefaultAddress ? DisplayStatus.Y : DisplayStatus.N,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/addresses`,
        addressData, // This is the request payload
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Address saved:', response.data);
      // 성공 메시지 표시 또는 리디렉션 등의 추가 작업
    } catch (error) {
      console.error('Error saving address:', error);
      // 에러 메시지 표시
    }
  };

  return (
    <div className='flex justify-center h-screen'>
      <div className='container-box relative w-full max-w-lg h-full flex justify-center pt-14 pb-14'>
        <div className='w-full scroll-box overflow-auto flex-grow p-4'>
          <h1 className='text-xl font-bold mb-4 text-center'>배송지 등록</h1>
          <form className='space-y-4' onSubmit={handleSubmit}>
            <div className='flex items-center'>
              <label className='block text-sm font-medium w-24'>
                <span className='text-brandOrange'>*</span> 배송지명
              </label>
              <input
                type='text'
                value={addressName}
                onChange={(e) => setAddressName(e.target.value)}
                className='flex-grow border rounded-md p-2'
                required
              />
            </div>
            <div className='flex items-center'>
              <label className='block text-sm font-medium w-24'>
                <span className='text-brandOrange'>*</span> 수령인
              </label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='flex-grow border rounded-md p-2'
                required
              />
            </div>
            <div className='flex items-center'>
              <label className='block text-sm font-medium w-24'>
                <span className='text-brandOrange'>*</span> 휴대폰
              </label>
              <input
                type='tel'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className='flex-grow border rounded-md p-2'
                required
              />
            </div>
            <div className='flex items-center'>
              <label className='block text-sm font-medium w-24'>
                <span className='text-brandOrange'>*</span> 우편번호
              </label>
              <input
                type='text'
                value={zipcode}
                className='flex-grow border rounded-md p-2 bg-gray-100'
                readOnly
                required
              />
              <button
                type='button'
                className='ml-2 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white px-2 py-1 text-sm'
                onClick={handlePostcode}
              >
                우편번호 찾기
              </button>
            </div>
            <div className='flex items-center'>
              <label className='block text-sm font-medium w-24'>
                <span className='text-brandOrange'>*</span> 주소지
              </label>
              <input
                type='text'
                value={streetAddress}
                className='flex-grow border rounded-md p-2 bg-gray-100'
                readOnly
                required
              />
            </div>
            <div className='flex items-center'>
              <label className='block text-sm font-medium w-24'>
                <span className='text-brandOrange'>*</span> 상세주소
              </label>
              <input
                type='text'
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                className='flex-grow border rounded-md p-2'
                required
              />
            </div>
            <div className='flex items-center mt-4'>
              <input
                type='checkbox'
                id='defaultAddress'
                checked={isDefaultAddress === DisplayStatus.Y}
                onChange={(e) =>
                  setIsDefaultAddress(e.target.checked ? DisplayStatus.Y : DisplayStatus.N)
                }
                className='mr-2'
              />
              <label htmlFor='defaultAddress' className='text-sm'>
                기본 배송지로 설정
              </label>
            </div>
            <div className='mt-6'>
              <button
                type='submit'
                className='w-full bg-brandOrange text-white py-2 rounded-md hover:bg-orange-600'
              >
                저장하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  //return <div>주문 과정 중 배송지 등록 페이지</div>;
};

export default AddComponent;
