import { useEffect, useRef } from 'react';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  XIcon,
} from '@/client/utility/assets/ModalIcons';
import { ModalBtn } from '@/client/layout/common/Button';

const AlertModal = ({ isOpen, onClose, type, title, message, onConfirm }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const alertConfig = {
    warning: {
      icon: AlertTriangleIcon,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    success: {
      icon: CheckCircleIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    error: {
      icon: XCircleIcon,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
  };

  const { icon: Icon, color, bgColor, borderColor } = alertConfig[type];

  return (
    <div className='fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-0 z-[100]'>
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl max-w-md w-full ${bgColor} ${borderColor} border`}
      >
        <div className='p-6'>
          <div className='flex items-center mb-4'>
            <Icon className={`${color} w-6 h-6 mr-3`} />
            <h3 className={`text-lg font-semibold ${color}`}>{title}</h3>
          </div>
          <p className='text-gray-600 mb-6'>{message}</p>
          <div className='flex justify-end space-x-2'>
            {type === 'warning' ? (
              <>
                <ModalBtn
                  onClick={onClose}
                  variant='danger'
                  className='text-gray-600 border-gray-300 hover:bg-gray-100 w-14 h-8'
                >
                  취소
                </ModalBtn>
                <ModalBtn
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  variant={'warning'}
                  className='w-14 h-8'
                >
                  계속
                </ModalBtn>
              </>
            ) : (
              <ModalBtn
                onClick={onClose}
                variant={type === 'success' ? 'success' : 'danger'}
                className='flex items-center w-16 h-8'
              >
                <XIcon className='mr-2 w-4 h-4' />
                닫기
              </ModalBtn>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
