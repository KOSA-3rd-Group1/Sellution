import { useState } from 'react';
const LoginComponent = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('로그인 시도:', { id, password });
    // 여기에 로그인 로직을 구현합니다
  };
  return (
    <div className='w-full flex justify-center'>
      <div className='w-[85%] p-6 bg-white rounded-lg shadow-md'>
        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <label htmlFor='id' className='block text-sm font-medium text-gray-700'>
              아이디
            </label>
            <input
              id='id'
              type='text'
              value={id}
              onChange={(e) => setId(e.target.value)}
              className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='아이디'
            />
          </div>
          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
              비밀번호
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='비밀번호'
            />
          </div>
          <div className='flex justify-between text-sm'>
            <a href='#' className='text-gray-400 hover:text-gray-800 flex items-center gap-2 text-xs hover:text-gray-500'>
              <span>아이디/비밀번호 찾기</span>
              <span>></span>
            </a>
          </div>
          <div className='flex space-x-2'>
            <button
              type='button'
              className='flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              회원가입
            </button>
            <button
              type='submit'
              className='flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
