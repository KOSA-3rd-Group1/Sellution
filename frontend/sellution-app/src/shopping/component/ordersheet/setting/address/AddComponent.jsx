import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import axios from 'axios';
import { Link, useParams } from 'react-router-dom'; // Link 추가

const AddComponent = () => {
  const { clientName, customerId } = useParams();
  const [addressName, setAddressName] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [error, setError] = useState(''); // 오류 메시지 상태 추가
  const [isSaved, setIsSaved] = useState(false); // 저장 상태 추가
  const DisplayStatus = {
    N: 'N',
    Y: 'Y',
  };
  const [isDefaultAddress, setIsDefaultAddress] = useState(DisplayStatus.N);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000); // 5초 후에 오류 메시지를 지움

      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
    }
  }, [error]);

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

    // 전화번호 유효성 검사 추가
    const phoneNumberPattern = /^\d{10,11}$/;
    if (!phoneNumberPattern.test(phoneNumber)) {
      setError('유효하지 않은 전화 번호 형식입니다. 10-11자리 숫자로 입력해주세요.');
      return;
    }

    const addressData = {
      customerId: parseInt(customerId), // 실제 사용 시 로그인한 사용자의 ID로 대체
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
        addressData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Address saved:', response.data);
      setError(''); // 성공 시 오류 메시지 초기화
      setIsSaved(true); // 저장 상태 업데이트
    } catch (error) {
      console.error('Error saving address:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('주소 저장 중 오류가 발생했습니다.');
      }
    }
  };

  if (isSaved) {
    return (
      <div className='flex justify-center h-screen'>
        <div className='container-box relative w-full max-w-lg h-full flex justify-center pt-14 pb-14'>
          <div className='w-full scroll-box overflow-auto flex-grow p-4'>
            <h1 className='text-xl font-bold mb-4 text-center'>
              주소가 성공적으로 저장되었습니다!
            </h1>
            <Link
              to={`/shopping/${clientName}/my/${customerId}/address`}
              className='block w-full text-center bg-brandOrange text-white py-2 rounded-md hover:bg-orange-600'
            >
              배송지 목록으로 이동
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex justify-center h-screen'>
      <div className='container-box relative w-full max-w-lg h-full flex justify-center pt-14 pb-14'>
        <div className='w-full scroll-box overflow-auto flex-grow p-4'>
          <h1 className='text-xl font-bold mb-4 text-center'>배송지 등록</h1>
          {error && (
            <div
              className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4'
              role='alert'
            >
              <span className='block sm:inline'>{error}</span>
            </div>
          )}
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
                placeholder='010********'
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
                className='ml-2 rounded border border-brandOrange text-brandOrange hover:bg-brandOrange hover:text-white px-4 py-2 text-sm'
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
};

export default AddComponent;
