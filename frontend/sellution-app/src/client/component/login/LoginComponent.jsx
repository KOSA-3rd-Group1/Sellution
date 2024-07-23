import { useLogin } from '@/client/business/login/useLogin';
import { useAuth } from '@/client/business/common/useAuth';
import { LogoIcon } from '@/client/utility/assets/LoginIcons';
import { EyeOnIcon, EyeOffIcon } from '@/client/utility/assets/Icons';

const LoginComponent = () => {
  const { login } = useAuth();
  const {
    username,
    password,
    showPassword,
    error,
    isLoading,
    setUsername,
    setPassword,
    togglePasswordVisibility,
    handleSubmit,
  } = useLogin({ login });

  return (
    <div className='w-full min-h-screen bg-gray-100 flex items-center justify-center p-4 flex-1'>
      <div className='bg-white shadow-md rounded-lg w-full max-w-md h-[500px] p-8 flex flex-col justify-between'>
        <div className='space-y-8'>
          <div className='text-center'>
            <LogoIcon className='mx-auto h-16 w-auto' />
          </div>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label htmlFor='username' className='block text-sm font-medium text-gray-700 mb-2'>
                아이디
              </label>
              <input
                id='username'
                name='username'
                type='text'
                autoComplete='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                placeholder='아이디를 입력하세요'
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            {error && <div className='text-red-500 text-sm mt-2'>{error}</div>}
            <div className='pt-4'>
              <button
                type='submit'
                className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 ease-in-out transform hover:scale-102'
                disabled={isLoading}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </div>
          </form>
        </div>
        <div className='w-full text-center text-sm mt-8 flex justify-center items-center'>
          <div className='font-medium text-orange-600 hover:text-orange-500'>아이디 찾기</div>
          <div className='divider divider-horizontal'></div>
          <div className='font-medium text-orange-600 hover:text-orange-500'>비밀번호 찾기</div>
          <div className='divider divider-horizontal'></div>
          <div className='font-medium text-orange-600 hover:text-orange-500'>아이디 생성</div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
