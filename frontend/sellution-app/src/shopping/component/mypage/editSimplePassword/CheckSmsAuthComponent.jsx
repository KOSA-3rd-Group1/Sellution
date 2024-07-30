import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MenuHeaderNav from "@/shopping/layout/MenuHeaderNav.jsx";

const CheckSmsAuthComponent = () => {
  const { clientName, customerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const handleRequestAuth = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/customers/${customerId}/send-auth-code`,
        { name, phoneNumber: phone },
      );
      console.log('Received response:', response.data);
      setStep(2);
      setTimeLeft(300);
      setIsTimerRunning(true);
      setIsVerified(false);
      setAuthCode('');
    } catch (error) {
      console.error('SMS 인증 요청 실패:', error);
      alert(error.response?.data?.message || '정보가 일치하지 않습니다. 다시 확인해주세요.');
    }
  };

  const handleVerify = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/customers/${customerId}/verify-auth-code`,
        { authCode },
      );
      console.log('Verification response:', response.data);
      setIsVerified(true);
      setIsTimerRunning(false);
    } catch (error) {
      console.error('SMS 인증 확인 실패:', error);
      alert(error.response?.data?.message || '인증번호가 일치하지 않습니다.');
      setAuthCode('');
    }
  };

  const handleConfirm = () => {
    navigate(`/shopping/${clientName}/my/${customerId}/auth/edit`, {
      state: {
        returnTo: location.state?.returnTo,
        orderData: location.state?.orderData
      }
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col  ">
      <MenuHeaderNav title='휴대폰 인증' />
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h1 className='text-2xl font-bold text-center mb-6'>휴대폰 인증</h1>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                <span className='text-brandOrange mr-1'>*</span>이름
              </label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full p-2 border rounded focus:ring-2 focus:ring-brandOrange focus:border-transparent'
                disabled={step !== 1}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                <span className='text-brandOrange mr-1'>*</span>휴대폰 번호
              </label>
              <div className='flex'>
                <input
                  type='tel'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className='flex-grow p-2 border rounded-l focus:ring-2 focus:ring-brandOrange focus:border-transparent'
                  placeholder='010********'
                  disabled={step !== 1}
                />
                <button
                  onClick={handleRequestAuth}
                  className='bg-brandOrange text-white px-4 py-2 rounded-r hover:bg-orange-600 transition duration-300'
                >
                  {step === 1 ? '인증번호 발급' : '인증번호 재발급'}
                </button>
              </div>
            </div>

            {step >= 2 && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  <span className='text-brandOrange mr-1'>*</span>인증번호
                </label>
                <div className='flex'>
                  <input
                    type='text'
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    className='flex-grow p-2 border rounded-l focus:ring-2 focus:ring-brandOrange focus:border-transparent'
                    placeholder='* * * * * *'
                    disabled={isVerified}
                  />
                  <button
                    onClick={handleVerify}
                    className='bg-brandOrange text-white px-4 py-2 rounded-r hover:bg-orange-600 transition duration-300'
                    disabled={isVerified}
                  >
                    인증
                  </button>
                </div>
                {isTimerRunning && !isVerified && (
                  <p className='text-sm text-gray-500 mt-1'>남은 시간: {formatTime(timeLeft)}</p>
                )}
              </div>
            )}
            {isVerified && (
              <div className='flex flex-col items-center mt-4'>
                <div className='flex items-center text-green-500 mb-4'>
                  <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                  인증 성공
                </div>
                <button
                  onClick={handleConfirm}
                  className='bg-brandOrange text-white px-6 py-2 rounded hover:bg-orange-600 transition duration-300'
                >
                  확인
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckSmsAuthComponent;