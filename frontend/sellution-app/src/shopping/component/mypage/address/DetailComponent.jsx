import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import MenuHeaderNav from '../../../layout/MenuHeaderNav';
import OneButtonFooterLayout from '../../../layout/OneButtonFooterLayout';
import ReusableOneButtonModal from '@/shopping/layout/partials/ReusableOneButtonModal';

const DetailComponent = () => {
  const { clientName, customerId, addressId } = useParams();
  const navigate = useNavigate();

  const DisplayStatus = {
    N: 'N',
    Y: 'Y',
  };

  const [address, setAddress] = useState({
    addressName: '',
    name: '',
    phoneNumber: '',
    zipcode: '',
    streetAddress: '',
    addressDetail: '',
    isDefaultAddress: DisplayStatus.N,
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/addresses/${addressId}`,
          { params: { customerId } },
        );
        setAddress(response.data);
      } catch (error) {
        console.error('Error fetching address:', error);
        setShowErrorModal(true);
      }
    };

    fetchAddress();
  }, [addressId, customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setAddress((prev) => ({ ...prev, isDefaultAddress: e.target.checked ? 'Y' : 'N' }));
  };

  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setAddress((prev) => ({
          ...prev,
          zipcode: data.zonecode,
          streetAddress: data.address,
          addressDetail: '',
        }));
      },
    }).open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/addresses/${addressId}`, {
        ...address,
        customerId,
      });
      setShowSuccessModal(true);
      //navigate(`/shopping/${clientName}/my/${customerId}/address`);
    } catch (error) {
      console.error('Error updating address:', error);
      setShowErrorModal(true);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate(`/shopping/${clientName}/my/${customerId}/address`);
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
  };

  return (
    <div className='w-full flex justify-center h-full items-center'>
      <MenuHeaderNav title={'배송지 수정'} />
      <div className='w-[90%]'>
        {/* <h1 className='text-xl font-bold mb-4 text-center'>배송지 수정</h1> */}
        <form className='space-y-4'>
          <div className='flex items-center'>
            <label className='block text-sm font-medium w-24'>
              <span className='text-primary'>*</span> 배송지명
            </label>
            <input
              type='text'
              name='addressName'
              value={address.addressName}
              onChange={handleChange}
              className='flex-grow border rounded-md p-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
            />
          </div>
          <div className='flex items-center'>
            <label className='block text-sm font-medium w-24'>
              <span className='text-primary'>*</span> 수령인
            </label>
            <input
              type='text'
              name='name'
              value={address.name}
              onChange={handleChange}
              className='flex-grow border rounded-md p-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
            />
          </div>
          <div className='flex items-center'>
            <label className='block text-sm font-medium w-24'>
              <span className='text-primary'>*</span> 휴대폰
            </label>
            <input
              type='tel'
              name='phoneNumber'
              value={address.phoneNumber}
              onChange={handleChange}
              className='flex-grow border rounded-md p-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
            />
          </div>
          <div className='flex items-center'>
            <label className='block text-sm font-medium w-24'>
              <span className='text-primary'>*</span> 우편번호
            </label>
            <input
              type='text'
              name='zipcode'
              value={address.zipcode}
              onChange={handleChange}
              className='flex-grow border rounded-md p-2 bg-gray-100 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              readOnly
            />
            <button
              type='button'
              className='ml-2 rounded border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2 text-sm'
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
              name='streetAddress'
              value={address.streetAddress}
              onChange={handleChange}
              className='flex-grow border rounded-md p-2 bg-gray-100 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
              readOnly
            />
          </div>
          <div className='flex items-center'>
            <label className='block text-sm font-medium w-24'>
              <span className='text-primary'>*</span> 상세주소
            </label>
            <input
              type='text'
              name='addressDetail'
              value={address.addressDetail}
              onChange={handleChange}
              className='flex-grow border rounded-md p-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
            />
          </div>
          <div className='flex items-center mt-4'>
            <input
              type='checkbox'
              id='defaultAddress'
              checked={address.isDefaultAddress === DisplayStatus.Y}
              onChange={handleCheckboxChange}
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
      </div>
      <OneButtonFooterLayout footerText={'저장하기'} onClick={handleSubmit} />
      <OneButtonFooterLayout footerText={'저장하기'} onClick={handleSubmit} />

      <ReusableOneButtonModal
        isVisible={showSuccessModal}
        onClose={handleSuccessModalClose}
        title='성공'
        message='주소가 성공적으로 수정되었습니다.'
        buttonText='확인'
        onButtonClick={handleSuccessModalClose}
      />

      <ReusableOneButtonModal
        isVisible={showErrorModal}
        onClose={handleErrorModalClose}
        title='오류'
        message='주소 수정 중 오류가 발생했습니다.'
        buttonText='확인'
        onButtonClick={handleErrorModalClose}
      />
    </div>
  );
};

export default DetailComponent;
