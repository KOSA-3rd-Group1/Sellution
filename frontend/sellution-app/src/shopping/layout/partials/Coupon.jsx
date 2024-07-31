import useCoupon from '../../business/layout/partials/useCoupon';
import { DownloadIcon } from '../../utility/assets/Icons';

const Coupon = ({ discount, description, condition, eventId }) => {
  const { handleDownload } = useCoupon();
  return (
    <div className='bg-black mb-6 relative overflow-hidden w-[85%]'>
      <div className='p-4'>
        <p className='text-sm mb-1 text-white'>{description}</p>
        <div className='flex justify-between'>
          <p className='text-4xl font-bold mb-2 text-white'>{discount}%</p>
          <button className='w-8 h-8 cursor-pointer' onClick={() => handleDownload(eventId)}>
            <DownloadIcon />
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
