import useCoupon from '../../business/layout/partials/useCoupon';
import { DownloadIcon } from '../../utility/assets/Icons';

const Coupon = ({ discount, description, condition, eventId }) => {
  const { handleDownload } = useCoupon();
  return (
    <div className='bg-black mb-6 relative overflow-hidden w-[85%]'>
      <div className='p-4'>
        <p className='text-sm mb-1 text-white'>{description}</p>
        <div className='flex justify-between items-center'>
          <p className='text-4xl font-bold mb-2 text-white'>{discount}%</p>
          <div
            className='relative z-10 cursor-pointer w-20 h-14 flex items-center justify-end group'
            onClick={() => handleDownload(eventId)}
          >
            <button className='w-10 h-10 transition-transform duration-200 group-hover:scale-90'>
              <DownloadIcon className='w-full h-full' />
            </button>
          </div>
        </div>
        <p className='text-xs text-gray-100'>{condition}</p>
      </div>

      <div className='absolute inset-y-0 right-1/4 flex items-center pointer-events-none'>
        <div className='w-px bg-gray-200' style={{ height: '60%' }}></div>
      </div>
      <div className='absolute top-0 right-1/4 w-4 h-4 bg-white rounded-full -mr-2 -translate-y-1/2 pointer-events-none'></div>
      <div className='absolute bottom-0 right-1/4 w-4 h-4 bg-white rounded-full -mr-2 translate-y-1/2 pointer-events-none'></div>
    </div>
  );
};
export default Coupon;
