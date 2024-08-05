import { LoadingIcon } from '@/client/utility/assets/Icons';
import { useLoading } from '@/client/business/loading/useLoading';

const LoadingComponent = () => {
  const showLoading = useLoading(300);

  if (!showLoading) {
    return null;
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='text-center'>
        <LoadingIcon className='h-12 w-12 animate-spin text-blue-500 mx-auto mb-4' />
        <h2 className='text-2xl font-semibold text-gray-700'>로딩 중...</h2>
        <p className='text-gray-500 mt-2'>잠시만 기다려 주세요.</p>
      </div>
    </div>
  );
};

export default LoadingComponent;
