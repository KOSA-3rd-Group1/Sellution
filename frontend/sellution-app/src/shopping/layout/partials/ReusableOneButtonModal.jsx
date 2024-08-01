import React from 'react';

const ReusableOneButtonModal = ({
  isVisible,
  onClose,
  title,
  message,
  buttonText,
  onButtonClick,
  titleClassName = 'bg-primary text-white',
  buttonClassName = 'bg-white border border-neutral hover:bg-neutral',
}) => {
  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10'>
      <div className='bg-white rounded-lg w-80 shadow-lg'>
        <div className={`font-bold text-center rounded-t-lg py-2 ${titleClassName}`}>{title}</div>
        <div className='px-4 py-6 text-center'>
          <p className='text-sm'>{message}</p>
        </div>
        <div className='flex justify-center pb-4'>
          <button
            onClick={onButtonClick}
            className={`rounded-md py-2 px-4 shadow-md text-sm ${buttonClassName}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReusableOneButtonModal;
