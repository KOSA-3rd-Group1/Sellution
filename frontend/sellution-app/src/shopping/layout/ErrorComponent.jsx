import { AlertTriangle, Home2, RefreshCw, ShoppingBag } from '../utility/assets/Icons';
import { ErrorButton } from './partials/ErrorButton';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';

const ErrorComponent = ({ errorCode = '500', errorMessage = 'Internal Server Error' }) => {
  const clientName = useCompanyInfoStore((state) => state.name);
  const getErrorDescription = (code) => {
    switch (code) {
      case '404':
        return "Oops! We couldn't find the page you're looking for.";
      case '500':
        return '500에러 입니다';
      default:
        return "An unexpected error occurred. We're working to fix it!";
    }
  };

  return (
    <div className='flex flex-col h-full justify-center items-center'>
      <div className='inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-yellow-100'>
        <AlertTriangle className='w-8 h-8 text-yellow-500' />
      </div>
      <h1 className='text-4xl font-bold text-gray-900 mb-2'>Error {errorCode}</h1>
      <p className='text-xl font-semibold text-gray-700 mb-4'>{errorMessage}</p>
      <p className='text-base text-gray-600 mb-8'>{getErrorDescription(errorCode)}</p>

      <div className='space-y-4 max-w-xs mx-auto'>
        <ErrorButton
          onClick={() => window.location.reload()}
          className='w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700'
        >
          <RefreshCw className='mr-2 h-4 w-4' /> Try Again
        </ErrorButton>
        <ErrorButton
          onClick={() => (window.location.href = `/shopping/${clientName}/home`)}
          variant='outline'
          className='w-full flex items-center justify-center border-blue-600 text-blue-600 hover:bg-blue-50'
        >
          <Home2 className='mr-2 h-4 w-4' /> Go to Homepage
        </ErrorButton>
        <ErrorButton
          onClick={() => (window.location.href = '/products')}
          variant='outline'
          className='w-full flex items-center justify-center border-green-600 text-green-600 hover:bg-green-50'
        >
          <ShoppingBag className='mr-2 h-4 w-4' /> Continue Shopping
        </ErrorButton>
      </div>

      <p className='mt-8 text-sm text-gray-500'>
        도움이 필요하신가요?{' '}
        <a href='/contact' className='text-blue-600 hover:underline'>
          Contact our support team
        </a>
      </p>
    </div>
  );
};

export default ErrorComponent;
