const CouponSelection = ({ handleCouponChange, coupons, selectedCoupon }) => {
  return (
    <div className='mb-6 bg-white py-4 w-[90%]'>
      <span className='block py-2 mb-2 font-bold'>할인쿠폰</span>
      <div className='relative'>
        <select
          className='w-full p-2 border border-gray-300 rounded appearance-none'
          onChange={handleCouponChange}
          value={selectedCoupon}
        >
          <option value=''>쿠폰 선택</option>
          {Array.isArray(coupons) &&
            coupons.map((coupon) => (
              <option key={coupon.id} value={coupon.id}>
                {coupon.couponName}
              </option>
            ))}
        </select>
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
