import { Button } from '@/components/ui/button';
import { AlertTriangle, Home2, RefreshCw, ShoppingBag } from '../utility/assets/Icons';

const Error = () => {
    const getErrorDescription = ({ errorCode = '500', errorMessage = 'Internal Server Error' }) => {
        switch (code) {
          case '404':
            return "Oops! We couldn't find the page you're looking for.";
          case '500':
            return "We're sorry, but something went wrong on our end.";
          default:
            return "An unexpected error occurred. We're working to fix it!";
        }
      };
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8'>
      <div className='text-center'>
        <div className='inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-yellow-100'>
          <AlertTriangle className='w-8 h-8 text-yellow-500' />
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-2'>Error {errorCode}</h1>
        <p className='text-xl font-semibold text-gray-700 mb-4'>{errorMessage}</p>
        <p className='text-base text-gray-600 mb-8'>{getErrorDescription(errorCode)}</p>

        <div className='space-y-4 max-w-xs mx-auto'>
          <Button
            onClick={() => window.location.reload()}
            className='w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700'
          >
            <RefreshCw className='mr-2 h-4 w-4' /> Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant='outline'
            className='w-full flex items-center justify-center border-blue-600 text-blue-600 hover:bg-blue-50'
          >
            <Home2 className='mr-2 h-4 w-4' /> Go to Homepage
          </Button>
          <Button
            onClick={() => (window.location.href = '/products')}
            variant='outline'
            className='w-full flex items-center justify-center border-green-600 text-green-600 hover:bg-green-50'
          >
            <ShoppingBag className='mr-2 h-4 w-4' /> Continue Shopping
          </Button>
        </div>

        <p className='mt-8 text-sm text-gray-500'>
          Need help?{' '}
          <a href='/contact' className='text-blue-600 hover:underline'>
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
};
export default Error;
