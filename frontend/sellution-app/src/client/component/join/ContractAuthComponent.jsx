import { useMove } from '@/client/business/common/useMove';
import { useContractAuth } from '@/client/business/join/useContractAuth';
import { EyeOnIcon, EyeOffIcon } from '@/client/utility/assets/Icons';

const ContractAuthComponent = () => {
  const { moveDefault } = useMove();
  const {
    data,
    showPassword,
    error,
    isLoading,
    togglePasswordVisibility,
    handleChangeInputValue,
    handleSubmit,
  } = useContractAuth({ moveDefault });

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='relative min-w-[470px] w-full max-w-md min-h-[540px] p-8 bg-white rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>계약 고객 인증</h2>
        <div className='mb-4'>
          <label htmlFor='id' className='block text-sm font-medium text-gray-700 mb-1'>
            아이디
          </label>
          <input
            type='text'
            id='id'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500'
            placeholder='아이디'
            value={data.contractAuthId || ''}
            onChange={(e) => handleChangeInputValue('contractAuthId', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
            비밀번호
          </label>
          <div className='relative'>
            <input
              id='password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              autoComplete='current-password'
              value={data.contractAuthPassword || ''}
              onChange={(e) => handleChangeInputValue('contractAuthPassword', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
              placeholder='비밀번호를 입력하세요'
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5'
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeOnIcon className='h-5 w-5 text-gray-500' />
              ) : (
                <EyeOffIcon className='h-5 w-5 text-gray-500' />
              )}
            </button>
          </div>
        </div>
        {error && <div className='text-red-500 text-sm my-5'>{error}</div>}
        <div className='absolute bottom-10 w-[calc(100%-64px)]'>
          <div className='pt-4'>
            <button
              type='submit'
              className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 ease-in-out transform hover:scale-102'
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? '다음...' : '다음'}
            </button>
          </div>
          <button
            type='button'
            className='block w-full bg-black text-white text-center py-3 rounded-md mt-3 hover:bg-gray-800 transition duration-300'
            onClick={() => moveDefault('/login')}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractAuthComponent;
