import { useState } from 'react';
import { DownChevronIcon } from '../../utility/assets/Icons';

const DeliverySelection = ({ addresses, selectedAddress, handleAddressChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
  };
  console.log('selectedAddress', selectedAddress);
  const handleOptionClick = () => {
    // handleAddressChange 함수를 호출하거나 필요한 작업 수행
    setIsOpen(false);
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
    <div className='bg-white py-4 w-[90%]'>
      <div className='flex justify-between items-center'>
        <span className='block py-2 font-bold'>
          배송지 {selectedAddress && `(${selectedAddress.addressName})`}
        </span>
        <button
          onClick={handleAddressChange}
          className='text-gray-500 border border-gray-300 rounded px-2 py-1 text-sm hover:bg-gray-100'
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
            <span className='text-brandOrange mr-2'>*</span>주소: {selectedAddress.streetAddress}{' '}
            {selectedAddress.addressDetail}
          </div>
        </div>
      ) : (
        <div className='flex justify-center'>
          <div className='text-gray-500 py-5 text-sm'>등록된 배송지가 없습니다. 배송지를 추가해주세요.</div>
        </div>
      )}

    </div>
  );
};
export default DeliverySelection;

// <div className='relative mt-2'>
// <div
//   className='w-full p-2 border border-gray-300 rounded cursor-pointer bg-white'
//   onClick={handleDropdownClick}
// >
//   배송요청사항 선택
// </div>
// {isOpen && (
  // <div className='absolute z-10 w-full bg-white border border-gray-300 rounded mt-1'>
  //   <ul className='max-h-40 overflow-auto'>
  //     <li className='p-2 cursor-pointer hover:bg-gray-200' onClick={handleOptionClick}>
  //       배송요청사항 선택
  //     </li>
  //     {/* Add more options if necessary */}
  //   </ul>
  // </div>
// )}
// <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
//   <DownChevronIcon className={'w-4 h-4 text-gray-400'} />
// </div>
// </div>