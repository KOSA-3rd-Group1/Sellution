import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Link 추가
import MenuHeaderNav from '../../../../layout/MenuHeaderNav';
import OneButtonFooterLayout from '../../../../layout/OneButtonFooterLayout';
import LogoHeaderNav from '@/shopping/layout/LogoHeaderNav';
import useUserInfoStore from '@/shopping/store/stores/useUserInfoStore';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';
import ReusableOneButtonModal from '@/shopping/layout/partials/ReusableOneButtonModal';

const AddComponent = () => {
  const navigate = useNavigate();
  const clientName = useCompanyInfoStore((state) => state.name);
  const customerId = useUserInfoStore((state) => state.id);
  const [addressName, setAddressName] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [error, setError] = useState(''); // 오류 메시지 상태 추가
  const [isSaved, setIsSaved] = useState(false); // 저장 상태 추가
  const [isModalVisible, setIsModalVisible] = useState(false); //모달

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
      customerId: parseInt(customerId), // 로그인한 사용자의 ID로 대체
      addressName,
      name,
      phoneNumber,
      zipcode,
      streetAddress,
      addressDetail,
      isDefaultAddress: isDefaultAddress,
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
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error saving address:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('주소 저장 중 오류가 발생했습니다.');
      }
    }
  };
  const handleModalClose = () => {
    setIsModalVisible(false);
    navigate(`/shopping/${clientName}/my/${customerId}/address`);
  };

  return (
    <div className='w-full h-full flex items-start my-10 justify-center'>
      <MenuHeaderNav title={'배송지 등록'} />
      {error && (
        <div
          className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4'
          role='alert'
        >
          <span className='block sm:inline'>{error}</span>
        </div>
      )}
      <form className='space-y-4 w-[90%]'>
        <div className='flex items-center'>
          <label className='block text-sm font-medium w-24'>
            <span className='text-primary'>*</span> 배송지명
          </label>
          <input
            type='text'
            value={addressName}
            onChange={(e) => setAddressName(e.target.value)}
            className='flex-grow border rounded-md p-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
            required
          />
        </div>
        <div className='flex items-center'>
          <label className='block text-sm font-medium w-24'>
            <span className='text-primary'>*</span> 수령인
          </label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='flex-grow border rounded-md p-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
            required
          />
        </div>
        <div className='flex items-center'>
          <label className='block text-sm font-medium w-24'>
            <span className='text-primary'>*</span> 휴대폰
          </label>
          <input
            type='tel'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className='flex-grow border rounded-md p-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
            placeholder="휴대폰 번호 입력('-'제외 11자리 입력)"
            required
          />
        </div>
        <div className='flex items-center'>
          <label className='block text-sm font-medium w-24'>
            <span className='text-primary'>*</span> 우편번호
          </label>
          <input
            type='text'
            value={zipcode}
            className='flex-grow border rounded-md p-2 bg-gray-100 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
            readOnly
            required
          />
          <button
            type='button'
            className='ml-2 rounded border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2 text-[0.8rem]'
            onClick={handlePostcode}
          >
            우편번호 찾기
          </button>
        </div>
        <div className='flex items-center'>
          <label className='block text-sm font-medium w-24'>
            <span className='text-primary'>*</span> 주소지
          </label>
          <input
            type='text'
            value={streetAddress}
            className='flex-grow border rounded-md p-2 bg-gray-100 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
            readOnly
            required
          />
        </div>
        <div className='flex items-center'>
          <label className='block text-sm font-medium w-24'>
            <span className='text-primary'>*</span> 상세주소
          </label>
          <input
            type='text'
            value={addressDetail}
            onChange={(e) => setAddressDetail(e.target.value)}
            className='flex-grow border rounded-md p-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
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
        {/* <div className='mt-6'>
          <button
            type='submit'
            className='w-full bg-brandOrange text-white py-2 rounded-md hover:bg-orange-600'
          >
            저장하기
          </button>
        </div> */}
      </form>
      <OneButtonFooterLayout footerText={'저장하기'} onClick={handleSubmit} />
      <ReusableOneButtonModal
        isVisible={isModalVisible}
        onClose={handleModalClose}
        title='알림'
        message='주소가 성공적으로 저장되었습니다!'
        buttonText='확인'
        onButtonClick={handleModalClose}
      />
    </div>
  );
};

export default AddComponent;
