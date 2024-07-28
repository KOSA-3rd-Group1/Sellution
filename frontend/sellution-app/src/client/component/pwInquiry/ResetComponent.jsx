import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ResetComponent = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(null);

  useEffect(() => {
    if (password && confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    } else {
      setPasswordMatch(null);
    }
  }, [password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      console.log('비밀번호 변경 완료');
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>비밀번호 재설정</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
              새 비밀번호
            </label>
            <input
              type='password'
              id='password'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500'
              placeholder='새 비밀번호를 입력하세요'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className='mb-6'>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              비밀번호 재확인
            </label>
            <input
              type='password'
              id='confirmPassword'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500'
              placeholder='비밀번호를 다시 입력하세요'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordMatch !== null && (
              <p className={`text-sm mt-1 ${passwordMatch ? 'text-green-500' : 'text-red-500'}`}>
                {passwordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
              </p>
            )}
          </div>
          {/* 여기 비밀번호 입력하고 바로 로그인하러 가기하면 저장되는 느낌이 안들거 같아서 비밀번호 변경 완료하기 버튼 넣어놨고, 비밀번호가 일치하지 않으면 못 넘어가게 해놨어! 준석오빠 입맛대로 버튼은 바꾸면 될 것 같아! */}
          <button
            type='submit'
            className='w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300 mb-4'
            disabled={!passwordMatch}
          >
            비밀번호 변경 완료
          </button>
        </form>
        <Link
          to='/login'
          className='block w-full text-center bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300'
        >
          로그인으로 가기
        </Link>
      </div>
    </div>
  );
};

export default ResetComponent;
