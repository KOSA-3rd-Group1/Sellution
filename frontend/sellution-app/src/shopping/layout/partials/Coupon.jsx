import useCoupon from '../../business/layout/partials/useCoupon';

const Coupon = ({ discount, description, condition, eventId }) => {
  const { handleDownload } = useCoupon();
  return (
    <div className='bg-black mb-6 relative overflow-hidden w-[85%]'>
      <div className='p-4'>
        <p className='text-sm mb-1 text-white'>{description}</p>
        <div className='flex justify-between'>
          <p className='text-4xl font-bold mb-2 text-white'>{discount}%</p>
          <button className='w-8 h-8 cursor-pointer' onClick={() => handleDownload(eventId)}>
            <svg viewBox='0 0 24 24' fill='white' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M12 16L11.6464 16.3536L12 16.7071L12.3536 16.3536L12 16ZM12.5 4C12.5 3.72386 12.2761 3.5 12 3.5C11.7239 3.5 11.5 3.72386 11.5 4L12.5 4ZM5.64645 10.3536L11.6464 16.3536L12.3536 15.6464L6.35355 9.64645L5.64645 10.3536ZM12.3536 16.3536L18.3536 10.3536L17.6464 9.64645L11.6464 15.6464L12.3536 16.3536ZM12.5 16L12.5 4L11.5 4L11.5 16L12.5 16Z'
                fill='white'
              ></path>
              <path d='M5 21H19' stroke='white'></path>
            </svg>
          </button>
        </div>
        <p className='text-xs text-gray-100'>{condition}</p>
      </div>

      <div className='absolute inset-y-0 right-1/4 flex items-center'>
        <div className='w-px bg-gray-200' style={{ height: '60%' }}></div>
      </div>
      <div className='absolute top-0 right-1/4 w-4 h-4 bg-gray-100 rounded-full -mr-2 transform -translate-y-1/2'></div>
      <div className='absolute top-100 right-1/4 w-4 h-4 bg-gray-100 rounded-full -mr-2 transform -translate-y-1/2'></div>
    </div>
  );
};
export default Coupon;
