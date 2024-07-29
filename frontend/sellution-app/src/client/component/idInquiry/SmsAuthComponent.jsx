import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const IdInquirySmsAuthComponent = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearTimeout(timer);
  }, [isTimerRunning, timeLeft]);

  const handleRequestAuth = () => {
    if (name && phone) {
      setStep(2);
      setTimeLeft(180);
      setIsTimerRunning(true);
    }
  };

  const handleVerify = () => {
    if (authCode === '123456') {
      setIsVerified(true);
      setIsTimerRunning(false);
    } else {
      alert('잘못된 인증번호입니다. 다시 시도해주세요.');
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>아이디 찾기 인증</h2>
        <form>
          <div className='mb-4'>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
              이름
            </label>
            <input
              type='text'
              id='name'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500'
              placeholder='이름을 입력하세요'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-1'>
              전화번호
            </label>
            <div className='flex'>
              <input
                type='tel'
                id='phone'
                className='flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500'
                placeholder='전화번호를 입력하세요'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button
                type='button'
                onClick={handleRequestAuth}
                className='bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-orange-600 transition duration-300'
              >
                인증코드 발송
              </button>
            </div>
          </div>
          {step >= 2 && (
            <div className='mb-6'>
              <label htmlFor='authCode' className='block text-sm font-medium text-gray-700 mb-1'>
                인증번호
              </label>
              <div className='flex'>
                <input
                  type='text'
                  id='authCode'
                  className='flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500'
                  placeholder='인증번호 6자리 입력'
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  disabled={isVerified}
                />
                <button
                  type='button'
                  onClick={handleVerify}
                  className='bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-orange-600 transition duration-300'
                  disabled={isVerified}
                >
                  확인
                </button>
              </div>
              {isTimerRunning && !isVerified && (
                <p className='text-sm text-red-500 mt-1'>{formatTime(timeLeft)}</p>
              )}
            </div>
          )}
          {isVerified && (
            <div className='flex items-center text-green-500 mb-4'>
              <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              <p className='text-green-500 text-sm mb-0'>인증이 완료되었습니다.</p>
            </div>
          )}

          <Link
            to='/idInquiry/view'
            className={`block w-full text-center py-3 rounded-md transition duration-300 ${
              isVerified
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={(e) => !isVerified && e.preventDefault()}
          >
            다음
          </Link>
        </form>
      </div>
    </div>
  );
};

export default IdInquirySmsAuthComponent;
