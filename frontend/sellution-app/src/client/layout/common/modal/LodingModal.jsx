const LoadingModal = ({ isOpen, message = '로딩 중...' }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 z-[100]'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full'>
        <div className='p-6'>
          <div className='flex flex-col items-center my-4'>
            <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-6'></div>
            <h3 className='text-base font-semibold text-gray-900'>{message}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
