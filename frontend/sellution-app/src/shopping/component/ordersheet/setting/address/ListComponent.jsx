import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MenuHeaderNav from '../../../../layout/MenuHeaderNav';
import OneButtonFooterLayout from '../../../../layout/OneButtonFooterLayout';
import ReusableOneButtonModal from '@/shopping/layout/partials/ReusableOneButtonModal';
import ReusableTwoButtonModal from '@/shopping/layout/partials/ReusableTwoButtonModal';

const ListComponent = () => {
  const [addresses, setAddresses] = useState([]);
  const { clientName, customerId } = useParams();
  const navigate = useNavigate();

  const [showDefaultAddressModal, setShowDefaultAddressModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

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

  const formatPhoneNumber = (value) => {
    const cleaned = ('' + value).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return value;
  };

  const handleDelete = (address) => {
    if (address.isDefaultAddress === DisplayStatus.Y) {
      setShowDefaultAddressModal(true);
    } else {
      setAddressToDelete(address);
      setShowDeleteConfirmModal(true);
    }
  };

  const confirmDelete = async () => {
    if (addressToDelete) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/addresses/${addressToDelete.addressId}`,
        );
        fetchAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
    setShowDeleteConfirmModal(false);
    setAddressToDelete(null);
  };

  const handleSelectAddress = (address) => {
    // 주소 객체에서 필요한 정보만 추출
    const addressToStore = {
      addressId: address.addressId,
      addressName: address.addressName,
      name: address.name,
      phoneNumber: address.phoneNumber,
      streetAddress: address.streetAddress,
      addressDetail: address.addressDetail,
      isDefaultAddress: address.isDefaultAddress,
    };

    localStorage.setItem('selectedAddress', JSON.stringify(addressToStore));
    navigate(`/shopping/${clientName}/subscription/order/${customerId}`);
  };

  return (
    <div className='w-full p-4'>
      <MenuHeaderNav title={'배송지 목록'} />
      <div className='w-[100%] mx-auto'>
        {addresses.length === 0 ? (
          <div className='w-full h-full flex justify-center items-center'>
            <div className='text-gray-500 py-3 text-center text-lg'>등록된 배송지가 없습니다</div>
          </div>
        ) : (
          addresses.map((address, index) => (
            <div key={index} className='bg-white rounded-lg shadow-md p-4 mb-4'>
              <div className='flex justify-between items-center mb-2'>
                <div className='flex items-center'>
                  <span className='font-semibold'>{address.addressName}</span>
                  {address.isDefaultAddress === DisplayStatus.Y && (
                    <span className='text-primary border border-primary rounded px-2 py-1 text-xs ml-2'>
                      기본 배송지
                    </span>
                  )}
                </div>
                <button
                  className='bg-neutral text-primary px-3 py-1 rounded-md text-sm hover:bg-primary hover:text-white hover:border-primary'
                  onClick={() => handleSelectAddress(address)}
                >
                  선택
                </button>
              </div>
              <hr className='border-t border-gray-300 my-3' />
              <div className='text-sm text-gray-600 space-y-1'>
                <div className='flex justify-between'>
                  <span className='flex items-center'>
                    <span className='text-primary'>*</span>
                    <span className='font-bold ml-1'>수령인</span>
                  </span>
                  <span>{address.name}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='flex items-center'>
                    <span className='text-primary'>*</span>
                    <span className='font-bold ml-1'>연락처</span>
                  </span>
                  <span>{formatPhoneNumber(address.phoneNumber)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='flex items-center'>
                    <span className='text-primary'>*</span>
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
                  className='text-primary hover:text-secondary text-sm'
                >
                  수정
                </Link>
                <button
                  className='text-primary hover:text-secondary text-sm'
                  onClick={() => handleDelete(address)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <OneButtonFooterLayout
        footerText={'배송지 추가'}
        onClick={() => {
          navigate(`add`);
        }}
      />
      <ReusableOneButtonModal
        isVisible={showDefaultAddressModal}
        onClose={() => setShowDefaultAddressModal(false)}
        title='알림'
        message='다른 배송지를 기본배송지로 설정 후 삭제해주세요.'
        buttonText='확인'
        onButtonClick={() => setShowDefaultAddressModal(false)}
      />

      <ReusableTwoButtonModal
        isVisible={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        title='확인'
        message='정말로 이 배송지를 삭제하시겠습니까?'
        leftButtonText='취소'
        rightButtonText='삭제'
        onLeftButtonClick={() => setShowDeleteConfirmModal(false)}
        onRightButtonClick={confirmDelete}
      />
    </div>
  );
};

export default ListComponent;
