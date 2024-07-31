import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MenuHeaderNav from '@/shopping/layout/MenuHeaderNav.jsx';
import HomeFooter from '../../layout/HomeFooter';

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  });
  const [idAvailable, setIdAvailable] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [authStep, setAuthStep] = useState(0);
  const [authCode, setAuthCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    let timer;
    if (authStep === 2 && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setAuthStep(0);
    }
    return () => clearInterval(timer);
  }, [authStep, timeLeft]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'confirmPassword') {
      setPasswordMatch(value === formData.password);
    }
  };

  const checkIdAvailability = async () => {
    try {
      // 이거 그냥 막 넣은거야..ㅎ.
      const response = await axios.post('/check-id', { id: formData.id });
      setIdAvailable(response.data.available);
    } catch (error) {
      console.error('ID 중복 확인 실패:', error);
      setIdAvailable(false);
    }
  };

  const handleRequestAuth = async () => {
    try {
      // 이거 그냥 막 넣은거야..ㅎ.
      await axios.post('/api/send-auth-code', { phone: formData.phone });
      setAuthStep(2);
      setTimeLeft(300);
    } catch (error) {
      console.error('SMS 인증 요청 실패:', error);
      alert('SMS 인증 요청에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleVerifyAuth = async () => {
    try {
      // 이거 그냥 막 넣은거야..ㅎ.
      const response = await axios.post('/api/verify-auth-code', {
        phone: formData.phone,
        code: authCode,
      });
      if (response.data.verified) {
        setPhoneVerified(true);
        setAuthStep(3);
      } else {
        alert('인증번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('인증 확인 실패:', error);
      alert('인증 확인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (idAvailable && passwordMatch && phoneVerified && smsConsent) {
      console.log('회원가입 처리:', formData);
      navigate('/join'); // 회원가입 성공 후 이동할 페이지
    } else {
      alert('모든 필수 항목을 완료해주세요.');
    }
  };

  return (
    <div className='justify-center items-center'>
      <MenuHeaderNav title={'회원가입'} />
      <form onSubmit={handleSubmit} className='max-w-md mx-auto p-4 space-y-4'>
        <div className='space-y-2'>
          <label className='block text-orange-500 font-semibold'>
            * 아이디
            {idAvailable === true && (
              <span className='ml-2 text-green-500 text-sm'>사용 가능한 아이디입니다.</span>
            )}
            {idAvailable === false && (
              <span className='ml-2 text-red-500 text-sm'>사용할 수 없는 아이디입니다.</span>
            )}
          </label>
          <div className='flex items-center space-x-2'>
            <input
              type='text'
              name='id'
              value={formData.id}
              onChange={handleChange}
              placeholder='아이디 입력(6-20자)'
              className='flex-grow border rounded-l px-3 py-2 text-sm'
            />
            <button
              type='button'
              onClick={checkIdAvailability}
              className='bg-orange-500 text-white rounded px-4 py-2 text-sm'
            >
              중복확인
            </button>
          </div>
        </div>

        <div className='space-y-2'>
          <label className='block text-orange-500 font-semibold'>* 비밀번호</label>
          <input
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='비밀번호 입력(문자, 숫자, 특수문자 포함 8-20자)'
            className='w-full border rounded px-3 py-2 text-sm'
          />
        </div>

        <div className='space-y-2'>
          <label className='block text-orange-500 font-semibold'>* 비밀번호 확인</label>
          <input
            type='password'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder='비밀번호 재입력'
            className='w-full border rounded px-3 py-2 text-sm'
          />
          {passwordMatch === false && (
            <p className='text-xs text-red-500'>비밀번호가 일치하지 않습니다.</p>
          )}
          {passwordMatch === true && (
            <p className='text-xs text-green-500'>비밀번호가 일치합니다.</p>
          )}
        </div>

        <div className='space-y-2'>
          <label className='block text-orange-500 font-semibold'>* 이름</label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='이름을 입력하세요.'
            className='w-full border rounded px-3 py-2 text-sm'
          />
        </div>

        <div className='space-y-2'>
          <label className='block text-orange-500 font-semibold'>* 전화번호</label>
          <div className='flex items-center space-x-2'>
            <input
              type='tel'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              placeholder="휴대폰 번호 입력('-'제외 11자리 입력)"
              className='flex-grow border rounded px-3 py-2 text-sm'
              disabled={authStep > 0}
            />
            <button
              type='button'
              onClick={handleRequestAuth}
              className='bg-gray-200 text-gray-700 rounded px-4 py-2 text-sm  hover:bg-brandOrange hover:text-white '
              disabled={authStep > 0}
            >
              휴대폰 인증
            </button>
          </div>
        </div>

        {authStep >= 2 && (
          <div className='space-y-2'>
            <label className='block text-orange-500 font-semibold'>인증번호</label>
            <div className='flex items-center space-x-2'>
              <input
                type='text'
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                placeholder='인증번호 6자리 입력'
                className='flex-grow border rounded px-3 py-2 text-sm'
              />
              <button
                type='button'
                onClick={handleVerifyAuth}
                className='bg-orange-500 text-white rounded px-4 py-2 text-sm'
              >
                확인
              </button>
            </div>
            {timeLeft > 0 && (
              <p className='text-xs text-gray-500'>
                남은 시간: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </p>
            )}
          </div>
        )}

        {phoneVerified && <p className='text-green-500 text-sm'>휴대폰 인증이 완료되었습니다.</p>}

        <div className='flex items-center space-x-2'>
          <input
            type='checkbox'
            id='sms-consent'
            checked={smsConsent}
            onChange={(e) => setSmsConsent(e.target.checked)}
            className='rounded text-orange-500'
          />
          <label htmlFor='sms-consent' className='text-sm'>
            SMS 동의 여부 (필수)
          </label>
        </div>

        <button
          type='submit'
          className='w-full bg-orange-500 text-white rounded py-3 text-lg font-semibold'
          disabled={!(idAvailable && passwordMatch && phoneVerified && smsConsent)}
        >
          가입하기
        </button>
      </form>
      <HomeFooter></HomeFooter>
    </div>
  );
};

export default SignupForm;
