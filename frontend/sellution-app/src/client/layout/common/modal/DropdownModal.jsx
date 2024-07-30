import { CheckIcon } from '@/client/utility/assets/Icons';

const DropdownModal = ({ modalPosition }) => {
  return (
    <div
      className='fixed bg-white p-3 rounded-md shadow-lg z-50 text-sm border border-gray-200'
      style={{
        top: `${modalPosition.top}px`,
        right: `${modalPosition.right}px`,
      }}
    >
      <div className='flex items-center'>
        <CheckIcon className='w-5 h-5 text-green-500 mr-2' />
        <p className='text-gray-700 font-medium'>링크가 복사되었습니다.</p>
      </div>
    </div>
  );
};

export default DropdownModal;
