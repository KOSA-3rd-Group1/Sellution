import { useState } from 'react';
import { useLogin } from '@/shopping/business/login/useLogin';
import { LogoIcon } from '@/client/utility/assets/LoginIcons';
import { EyeOnIcon, EyeOffIcon } from '@/client/utility/assets/Icons';

import LogoHeaderNav from '@/shopping/layout/LogoHeaderNav';
import HomeFooter from '@/shopping/layout/HomeFooter';
import { useMove } from '@/shopping/business/common/useMove';

const LoginComponent = () => {
  const { moveDefault } = useMove();
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
    moveIdInquiry,
    movePwInquiry,
    moveSignup,
  } = useLogin({ moveDefault });

  return (
    <>
      <LogoHeaderNav logoImageUrl={null} />
      {/* <div className='w-full bg-red-500'>
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
              <a
                href='#'
                className='text-gray-400 hover:text-gray-800 flex items-center gap-2 text-xs hover:text-gray-500'
              >
                <span>아이디/비밀번호 찾기</span>
                <span></span>
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
      </div> */}
      <div className='relative w-full h-full bg-white'>
        <div className='absolute w-full h-fit top-[10%]  flex items-start justify-center p-4 flex-1'>
          <div className='w-full max-w-md min-h-[400px] max-h-[600px] p-8 flex flex-col justify-between bg-white shadow-md rounded-lg'>
            <div className='space-y-8'>
              <form onSubmit={handleSubmit} className='pt-10 space-y-6'>
                <div>
                  <label
                    htmlFor='username'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    아이디
                  </label>
                  <input
                    id='username'
                    name='username'
                    type='text'
                    autoComplete='username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                    placeholder='아이디를 입력하세요'
                  />
                </div>
                <div>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
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
                      className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
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
                    className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 ease-in-out transform hover:scale-102'
                    disabled={isLoading}
                  >
                    {isLoading ? '로그인 중...' : '로그인'}
                  </button>
                </div>
              </form>
            </div>
            <div className='w-full text-center text-sm mt-8 flex justify-center items-center'>
              <button
                className='font-medium text-primary hover:text-brandOprimaryrange flex flex-wrap justify-center gap-1 cursor-pointer'
                onClick={(e) => moveIdInquiry(e)}
              >
                <span>아이디</span>
                <span>찾기</span>
              </button>
              <div className='divider divider-accent divider-horizontal'></div>
              <button
                className='font-medium text-primary hover:text-primary flex flex-wrap justify-center gap-1 '
                onClick={(e) => movePwInquiry(e)}
              >
                <span>비밀번호</span>
                <span>찾기</span>
              </button>
              <div className='divider divider-accent divider-horizontal'></div>
              <div
                className='font-medium text-primary hover:text-primary flex flex-wrap justify-center gap-1 cursor-pointer'
                onClick={(e) => moveSignup(e)}
              >
                <span>아이디</span>
                <span>생성</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HomeFooter></HomeFooter>
    </>
  );
};

export default LoginComponent;
