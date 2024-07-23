import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const ListComponent = () => {
  const [addresses, setAddresses] = useState([]);
  const { customerId } = useParams();

  useEffect(() => {
    fetchAddresses();
  }, [customerId]);

  const DisplayStatus = {
    N: 'N',
    Y: 'Y',
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/addresses/customer/${customerId}`,
      );
      // 기본 배송지를 맨 위로 정렬
      const sortedAddresses = response.data.sort((a, b) =>
        b.isDefaultAddress.localeCompare(a.isDefaultAddress),
      );
      setAddresses(sortedAddresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleDelete = async (address) => {
    console.log('Address to delete:', address);
    if (address.isDefaultAddress === DisplayStatus.Y) {
      console.log('This is the default address:', address.isDefaultAddress);
      alert('다른 배송지를 기본배송지로 설정 후 삭제해주세요.');
      return;
    }

    if (window.confirm('정말로 이 배송지를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/addresses/${address.addressId}`);
        fetchAddresses(); // 삭제 후 목록 새로고침
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  return (
    // <div>
    //   <div className='flex justify-center h-screen'>
    //     <div className='container-box relative w-full max-w-lg h-full flex justify-center pt-14 pb-14'>
    <div className='w-full scroll-box overflow-auto flex-grow p-4'>
      <h1 className='text-xl font-bold mb-4 text-center'>배송지 목록</h1>
      <div className='mt-4 w-[100%] mx-auto mb-3'>
        <Link
          to='add'
          className='block w-full text-center bg-brandOrange text-white py-2 rounded-md hover:bg-orange-600'
        >
          새 배송지 추가
        </Link>
      </div>

      <div className='w-[100%] mx-auto'>
        {addresses.map((address, index) => (
          <div key={index} className='bg-white rounded-lg shadow-md p-4 mb-4'>
            <div className='flex justify-between items-center mb-2'>
              <div className='flex items-center'>
                <span className='font-semibold'>{address.addressName}</span>
                {address.isDefaultAddress === DisplayStatus.Y && (
                  <span className='text-brandOrange border border-brandOrange rounded px-2 py-1 text-xs ml-2'>
                    기본 배송지
                  </span>
                )}
              </div>
              <button className='bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm'>
                선택
              </button>
            </div>
            <hr className='border-t border-gray-300 my-3' />
            <div className='text-sm text-gray-600 space-y-1'>
              <div className='flex justify-between'>
                <span className='flex items-center'>
                  <span className='text-orange-500'>*</span>
                  <span className='font-bold ml-1'>수령인</span>
                </span>
                <span>{address.name}</span>
              </div>
              <div className='flex justify-between'>
                <span className='flex items-center'>
                  <span className='text-orange-500'>*</span>
                  <span className='font-bold ml-1'>연락처</span>
                </span>
                <span>{address.phoneNumber}</span>
              </div>
              <div className='flex justify-between'>
                <span className='flex items-center'>
                  <span className='text-orange-500'>*</span>
                  <span className='font-bold ml-1'>주소</span>
                </span>
                <span>
                  {address.streetAddress} {address.addressDetail}
                </span>
              </div>
            </div>
            <div className='mt-3 flex justify-end space-x-2'>
              <Link
                to={`${address.addressId}`}
                className='text-gray-500 hover:text-gray-700 text-sm'
              >
                수정
              </Link>
              <button
                className='text-gray-500 hover:text-gray-700 text-sm mr-3'
                onClick={() => handleDelete(address)}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ListComponent;
