import React, { useState } from 'react';

const CheckSmsAuthComponent = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [authCode, setAuthCode] = useState('');

  const handleRequestAuth = () => {
    // 인증번호 요청 로직
    setStep(2);
  };

  const handleVerify = () => {
    // 인증번호 확인 로직
    setStep(3);
  };

  return (
    <div className='flex justify-center h-screen'>
      <div className='container-box relative w-full max-w-lg h-full flex justify-center pt-14 pb-14'>
        <div className='w-full scroll-box overflow-auto flex-grow p-4'>
          <h1 className='text-xl font-bold text-center mb-8'>휴대폰 인증</h1>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                <span className='text-orange-500 mr-1'>*</span>이름
              </label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full p-2 border rounded'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                <span className='text-orange-500 mr-1'>*</span>휴대폰 번호
              </label>
              <div className='flex'>
                <input
                  type='tel'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className='flex-grow p-2 border rounded-l'
                  placeholder='010********'
                />
                <button
                  onClick={handleRequestAuth}
                  className='bg-orange-500 text-white px-4 py-2 rounded-r'
                >
                  인증번호 발급
                </button>
              </div>
            </div>
            {step >= 2 && (
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  <span className='text-orange-500 mr-1'>*</span>인증번호
                </label>
                <div className='flex'>
                  <input
                    type='text'
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    className='flex-grow p-2 border rounded-l'
                    placeholder='123456'
                  />
                  <button
                    onClick={handleVerify}
                    className='bg-orange-500 text-white px-4 py-2 rounded-r'
                  >
                    인증
                  </button>
                </div>
                {step === 2 && <p className='text-sm text-gray-500 mt-1'>남은 시간: 05:00</p>}
              </div>
            )}
            {step === 3 && (
              <div className='flex items-center text-green-500'>
                <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
                인증 성공
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckSmsAuthComponent;
