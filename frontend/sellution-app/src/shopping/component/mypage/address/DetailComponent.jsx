import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DetailComponent = () => {
  const { addressId } = useParams();

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

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/addresses/${addressId}`,
        );
        setAddress(response.data);
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    };

    fetchAddress();
  }, [addressId]);

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
        customerId: 1, // 실제 사용 시 로그인한 사용자의 ID로 대체해야 합니다
      });
      alert('주소가 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('Error updating address:', error);
      alert('주소 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className='flex justify-center h-screen'>
      <div className='container-box relative w-full max-w-lg h-full flex justify-center pt-14 pb-14'>
        <div className='w-full scroll-box overflow-auto flex-grow p-4'>
          <h1 className='text-xl font-bold mb-4 text-center'>배송지 수정</h1>
          <form className='space-y-4' onSubmit={handleSubmit}>
            <div className='flex items-center'>
              <label className='block text-sm font-medium w-24'>
                <span className='text-brandOrange'>*</span> 배송지명
              </label>
              <input
                type='text'
                name='addressName'
                value={address.addressName}
                onChange={handleChange}
                className='flex-grow border rounded-md p-2'
              />
            </div>
            <div className='flex items-center'>
              <label className='block text-sm font-medium w-24'>
                <span className='text-brandOrange'>*</span> 수령인
              </label>
              <input
                type='text'
                name='name'
                value={address.name}
                onChange={handleChange}
                className='flex-grow border rounded-md p-2'
              />
            </div>
            <div className='flex items-center'>
              <label className='block text-sm font-medium w-24'>
                <span className='text-brandOrange'>*</span> 휴대폰
              </label>
              <input
                type='tel'
                name='phoneNumber'
                value={address.phoneNumber}
                onChange={handleChange}
                className='flex-grow border rounded-md p-2'
              />
            </div>
            <div className='flex items-center'>
              <label className='block text-sm font-medium w-24'>
                <span className='text-brandOrange'>*</span> 우편번호
              </label>
              <input
                type='text'
                name='zipcode'
                value={address.zipcode}
                onChange={handleChange}
                className='flex-grow border rounded-md p-2 bg-gray-100'
                readOnly
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
                name='streetAddress'
                value={address.streetAddress}
                onChange={handleChange}
                className='flex-grow border rounded-md p-2 bg-gray-100'
                readOnly
              />
            </div>
            <div className='flex items-center'>
              <label className='block text-sm font-medium w-24'>
                <span className='text-brandOrange'>*</span> 상세주소
              </label>
              <input
                type='text'
                name='addressDetail'
                value={address.addressDetail}
                onChange={handleChange}
                className='flex-grow border rounded-md p-2'
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

export default DetailComponent;
