import { useState } from 'react';

const CouponSelection = ({ handleCouponChange, coupons, selectedCoupon }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (coupon) => {
    handleCouponChange({ target: { value: coupon.id } });
    setIsOpen(false);
  };

  return (
    <div className='mb-6 bg-white py-4 w-[90%]'>
      <span className='block py-2 mb-2 font-bold'>할인쿠폰</span>
      <div className='relative'>
        <div
          className='w-full p-2 border border-gray-300 rounded cursor-pointer bg-white'
          onClick={handleDropdownClick}
        >
          {selectedCoupon ? selectedCoupon.couponName : '쿠폰 선택'}
        </div>
        {isOpen && (
          <div className='absolute z-10 w-full bg-white border border-gray-300 rounded mt-1'>
            <ul className='max-h-40 overflow-auto'>
              <li
                className='p-2 cursor-pointer hover:bg-gray-200'
                onClick={() => handleOptionClick({ id: '', couponName: '쿠폰 선택' })}
              >
                쿠폰 선택
              </li>
              {Array.isArray(coupons) &&
                coupons.map((coupon) => (
                  <li
                    key={coupon.id}
                    className='p-2 cursor-pointer hover:bg-gray-200'
                    onClick={() => handleOptionClick(coupon)}
                  >
                    {coupon.couponName}
                  </li>
                ))}
            </ul>
          </div>
        )}
        <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
          <svg
            className='w-4 h-4 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M19 9l-7 7-7-7'
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CouponSelection;
