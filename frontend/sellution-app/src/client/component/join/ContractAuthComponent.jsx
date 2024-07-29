import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ContractAuthComponent = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 현재는 그냥 ID가 비어있는 경우만 체크
    if (id.trim() === '') {
      setError('아이디 또는 비밀번호를 확인해주세요.');
    } else {
      setError('');
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>계약 고객 인증</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='id' className='block text-sm font-medium text-gray-700 mb-1'>
              아이디
            </label>
            <input
              type='text'
              id='id'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500'
              placeholder='아이디'
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className='mb-6'>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
              비밀번호 입력
            </label>
            <input
              type='password'
              id='password'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500'
              placeholder='비밀번호(영문, 숫자, 특수문자 조합 8자리 이상)'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? (
            <p className='text-red-500 text-sm mb-4'>{error}</p>
          ) : (
            <p className='text-sm text-gray-500 mb-4'>
              * 계약 시 알림을 통해 받은 아이디와 비밀번호를 입력해 주세요.
            </p>
          )}
          <Link
            to='/join/sms-auth'
            className='block w-full bg-orange-500 text-white text-center py-3 rounded-md hover:bg-orange-600 transition duration-300'
            //onClick={handleSubmit}
          >
            다음
          </Link>
          <button
            type='button'
            className='block w-full bg-black text-white text-center py-3 rounded-md mt-3 hover:bg-gray-800 transition duration-300'
          >
            취소
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContractAuthComponent;
