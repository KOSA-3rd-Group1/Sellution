import { DeleteIcon } from '../utility/assets/Icons';

const EventModal = ({ isOpen, onClose, onClick, onCloseForToday }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50'>
      <div className='bg-white p-8 w-[85%] max-w-md rounded-2xl shadow-2xl relative'>
        <button
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-300'
          onClick={onClose}
        >
          <DeleteIcon className={'h-6 w-6'} />
        </button>
        <div className='text-center'>
          <h1 className='text-[1.2rem] font-bold mb-4 text-primary'>
            전 상품 최대 무제한 21% 쿠폰
          </h1>
          <p className='text-gray-600 mb-6 text-[0.9rem]'>중복 쿠폰으로 추가 할인 받아보세요.</p>
          <div className='flex justify-center space-x-4'>
            <button
              className='text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-300 text-[0.8rem]'
              onClick={onCloseForToday}
            >
              오늘 하루 그만보기
            </button>
            <button
              className='bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary ransition duration-300 text-[0.8rem]'
              onClick={onClick}
            >
              이벤트 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EventModal;
