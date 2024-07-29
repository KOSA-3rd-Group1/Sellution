import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';

const BeginComponent = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('관리자');
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
    if (passwordMatch) {
      console.log('회원가입 시도:', { userId, password, role });
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100 p-4'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-3xl relative'>
        <button className='absolute top-4 right-4 text-gray-500'>
          <IoClose className='w-6 h-6' />
        </button>
        <h2 className='text-2xl font-bold mb-6 text-center'>아이디 생성</h2>

        <div className='bg-gray-100 p-4 rounded-md mb-6 text-sm'>
          <p className='font-bold mb-2'>* 회원가입 안내</p>
          <ul className='list-disc list-inside'>
            <li>서비스를 이용하실 때 사용하실 아이디와 비밀번호로 가입해주세요.</li>
            <li>본인 인증에 사용된 정보는 본인의 식별 외 용도로 사용됩니다.</li>
          </ul>
        </div>

        <div className='grid grid-cols-2 gap-4 mb-6'>
          <div className='bg-gray-100 p-4 rounded-md text-sm'>
            <div className='flex justify-between'>
              <p className='font-bold'>회사명</p>
              <p>길동이네 정신과게</p>
            </div>
            <div className='flex justify-between'>
              <p className='font-bold'>사업자 번호</p>
              <p>123-456-78</p>
            </div>
          </div>
          <div className='bg-gray-100 p-4 rounded-md text-sm'>
            <div className='flex justify-between'>
              <p className='font-bold'>사용자명</p>
              <p>홍길동</p>
            </div>
            <div className='flex justify-between'>
              <p className='font-bold'>전화번호</p>
              <p>010-1234-5678</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4'>
          <div className='col-span-1'></div>
          <div className='col-span-1 mb-4'>
            <div className='flex items-center justify-end'>
              <label className='block text-sm font-medium text-gray-700 mb-1 mr-2'>업무권한</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className='p-2 border rounded-md w-24'
              >
                <option value='관리자'>관리자</option>
                <option value='사용자'>사용자</option>
              </select>
            </div>
          </div>

          <div className='col-span-2 mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>아이디</label>
            <div className='flex'>
              <input
                type='text'
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className='flex-grow p-2 border rounded-l-md'
                placeholder='아이디 입력'
              />
              <button type='button' className='bg-orange-500 text-white px-4 py-2 rounded-r-md'>
                중복 확인
              </button>
            </div>
          </div>

          <div className='col-span-2 mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>비밀번호</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 border rounded-md'
              placeholder='비밀번호 입력'
            />
          </div>

          <div className='col-span-2 mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>비밀번호 확인</label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full p-2 border rounded-md'
              placeholder='비밀번호 재입력'
            />
            {passwordMatch !== null && (
              <p className={`text-sm mt-1 ${passwordMatch ? 'text-green-500' : 'text-red-500'}`}>
                {passwordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
              </p>
            )}
          </div>

          <div className='col-span-2'>
            <button
              type='submit'
              className='w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300 mb-4'
              disabled={!passwordMatch}
            >
              아이디 생성 완료
            </button>

            <Link
              to='/login'
              className='block w-full text-center bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300'
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BeginComponent;
