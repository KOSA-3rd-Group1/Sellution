import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MenuHeaderNav from '@/shopping/layout/MenuHeaderNav.jsx';
import ReusableOneButtonModal from '@/shopping/layout/partials/ReusableOneButtonModal';

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

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      setModalMessage(
        error.response?.data?.message || '정보가 일치하지 않습니다. 다시 확인해주세요.',
      );
      setShowModal(true);
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
      setShowSuccessModal(true);
    } catch (error) {
      console.error('SMS 인증 확인 실패:', error);
      setModalMessage(error.response?.data?.message || '인증번호가 일치하지 않습니다.');
      setShowModal(true);
      setAuthCode('');
    }
  };

  const handleConfirm = () => {
    navigate(`/shopping/${clientName}/my/${customerId}/auth/edit`, {
      state: {
        returnTo: location.state?.returnTo,
        orderData: location.state?.orderData,
      },
    });
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate(`/shopping/${clientName}/my/${customerId}/auth/edit`, {
      state: {
        returnTo: location.state?.returnTo,
        orderData: location.state?.orderData,
      },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <MenuHeaderNav title='간편 비밀번호 설정' />
      <div className='flex-grow flex items-center justify-center bg-white px-4'>
        <div className='w-full max-w-md'>
          <div className='bg-white rounded-lg shadow-md p-8'>
            <h2 className='text-xl font-bold mb-6 text-center'>휴대폰 인증</h2>
            <div className='mb-4'>
              <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                <span className='text-primary mr-1'>*</span>이름
              </label>
              <input
                type='text'
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                placeholder='성명 입력'
                disabled={step !== 1}
              />
            </div>
            <div className='mb-4'>
              <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-1'>
                <span className='text-primary mr-1'>*</span>휴대폰 번호
              </label>
              <div className='flex'>
                <input
                  type='tel'
                  id='phone'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className='flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary'
                  placeholder="휴대폰 번호 입력('-'제외 11자리 입력)"
                  disabled={step !== 1}
                />
                <button
                  onClick={handleRequestAuth}
                  className='bg-primary text-white px-4 py-2 rounded-r-md hover:bg-secondary transition duration-300 text-xs'
                >
                  {step === 1 ? '인증번호 발급' : '인증번호 재발급'}
                </button>
              </div>
            </div>

            {step >= 2 && (
              <div className='mb-6'>
                <label htmlFor='authCode' className='block text-sm font-medium text-gray-700 mb-1'>
                  <span className='text-primary mr-1'>*</span>인증번호
                </label>
                <div className='flex'>
                  <input
                    type='text'
                    id='authCode'
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    className='flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary'
                    placeholder='인증번호 6자리 입력'
                    disabled={isVerified}
                  />
                  <button
                    onClick={handleVerify}
                    className='bg-primary text-white px-4 py-2 rounded-r-md hover:bg-secondary transition duration-300 text-xs'
                    disabled={isVerified}
                  >
                    인증
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

            <div className='mt-6'>
              <button
                onClick={handleBack}
                className='block w-full bg-black text-white text-center py-3 rounded-md mt-3 hover:bg-gray-800 transition duration-300'
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
      <ReusableOneButtonModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        title='알림'
        message={modalMessage}
        buttonText='확인'
        onButtonClick={() => setShowModal(false)}
      />
      <ReusableOneButtonModal
        isVisible={showSuccessModal}
        onClose={handleSuccessModalClose}
        title='인증 성공'
        message='인증이 성공적으로 완료되었습니다.'
        buttonText='확인'
        onButtonClick={handleSuccessModalClose}
      />
    </div>
  );
};

export default CheckSmsAuthComponent;
