import { useEffect, useRef, useState } from 'react';
import { InfoIcon, XIcon } from '../../../utility/assets/ModalIcons';
import { ModalBtn } from '../Button';

const AutoCloseModal = ({ isOpen, onClose, title, message, duration = 5000 }) => {
  // const [progress, setProgress] = useState(100); // 100% -> 0%
  const [progress, setProgress] = useState(0);
  const modalRef = useRef();

  useEffect(() => {
    let interval;
    if (isOpen) {
      //   setProgress(100); // 100% -> 0%
      setProgress(0);

      interval = setInterval(() => {
        setProgress((prevProgress) => {
          //   if (prevProgress <= 0) { // 100% -> 0%
          if (prevProgress >= 100) {
            clearInterval(interval);
            onClose();
            // return 0; // 100% -> 0%
            return 100;
          }
          //   return prevProgress - 100 / (duration / 100); // 100% -> 0%
          return prevProgress + 100 / (duration / 100);
        });
      }, 100);
    }

    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose, duration]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-0 z-[100]'>
      <div
        ref={modalRef}
        className='bg-white rounded-lg shadow-xl max-w-md w-full border border-blue-200'
      >
        <div className='p-6'>
          <div className='flex items-center mb-4'>
            <InfoIcon className='text-blue-500 w-6 h-6 mr-3' />
            <h3 className='text-lg font-semibold text-blue-500'>{title}</h3>
          </div>
          <p className='text-gray-600 mb-6'>{message}</p>
          <div className='w-full bg-blue-200 rounded-full h-2.5 mb-4'>
            <div
              className='bg-blue-500 h-2.5 rounded-full transition-all duration-100 ease-linear'
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className='flex justify-between items-center'>
            <p className='text-sm text-gray-500'>This message will close automatically.</p>
            <ModalBtn
              onClick={onClose}
              variant='outline'
              className='w-16 h-8 flex items-center text-blue-500 border-blue-500 hover:bg-blue-100'
            >
              <XIcon className='w-4 h-4 mr-2' />
              닫기
            </ModalBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoCloseModal;
