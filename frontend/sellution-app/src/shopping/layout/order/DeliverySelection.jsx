const DeliverySelection = ({ addresses, selectedAddress, handleAddressChange }) => {
  const formatPhoneNumber = (value) => {
    const cleaned = ('' + value).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return value;
  };
  return (
    <div className='mb-6 bg-white py-4 w-[90%]'>
      <div className='flex justify-between items-center mb-2'>
        <span className='block py-2 font-bold'>
          배송지 {selectedAddress && `(${selectedAddress.addressName})`}
        </span>
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
            <span className='text-brandOrange mr-2'>*</span>주소: {selectedAddress.streetAddress}{' '}
            {selectedAddress.addressDetail}
          </div>
        </div>
      ) : (
        <div className='text-gray-500'>등록된 배송지가 없습니다. 배송지를 추가해주세요.</div>
      )}
      <select className='w-full mt-2 p-2 border rounded'>
        <option>배송요청사항 선택</option>
      </select>
    </div>
  );
};
export default DeliverySelection;
