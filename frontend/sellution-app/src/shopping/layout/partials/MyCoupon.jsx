const MyCoupon = ({
  couponDiscountRate,
  targetCustomerType,
  couponName,
  eventStartDate,
  eventEndDate,
  state,
}) => (
  <div className='bg-white p-4 mb-4 border border-solid border-[1.5px] shadow'>
    <div className='flex justify-between items-center mb-2'>
      <span className='text-xl font-bold text-brandOrange'>{couponDiscountRate}%</span>
      <span className='text-gray-500 text-sm'>{`${calculateRemainingDays(eventEndDate)} 남음`}</span>
    </div>
    <p className='text-gray-800 mb-1'>{couponName}</p>
    <p className='text-gray-600 text-xs'>{`행사기간: ${eventStartDate} ~ ${eventEndDate}`}</p>
    <p className='text-gray-500 text-sm'></p>
    {state === 'ONGOING' && (
      <button className='mt-2 text-brandOrange text-sm'>
        {getCustomerTypeText(targetCustomerType)}
      </button>
    )}
  </div>
);

const calculateRemainingDays = (endDate) => {
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = Math.abs(end - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays}일`;
};
const getCustomerTypeText = (type) => {
  switch (type) {
    case 'ALL':
      return '전 회원 대상';
    case 'NEW':
      return '신규회원 대상';
    case 'DORMANT':
      return '휴면회원 대상';
    case 'NORMAL':
      return '일반회원 대상';
    default:
      return type; // 기본적으로 원래 텍스트를 반환
  }
};

export default MyCoupon;
