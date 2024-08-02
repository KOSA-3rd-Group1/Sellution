import MenuHeaderNav from '@/shopping/layout/MenuHeaderNav.jsx';
import HomeFooter from '@/shopping/layout/HomeFooter';
import { useMove } from '@/shopping/business/common/useMove';
import { useSignUp } from '@/shopping/business/signUp/useSignUp';

const SignupForm = () => {
  const { moveDefault } = useMove();
  const {
    data,
    usernameConfirm, // 중복 아이디 확인
    usernameConfirmErrorMessage,
    passwordMatch, // 비밀번호 일치 여부
    step, // 휴대폰 인증 요청 단계
    isVerified, // 휴대폰 인증 여부
    timeLeft, // 인증 남은 시간
    isTimerRunning,
    handleChangeInputValue, // 변경 가능한 값 변경 핸들러
    handleCheckIdDuplicate, // 아이디 중봉 확인 요청
    handleRequestAuth, // 인증 번호 요청
    handleVerify, // 인증번호 비교 검사 요청
    handleSubmit, // 회원가입 요청
  } = useSignUp({ moveDefault });

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='justify-center items-center'>
      <MenuHeaderNav title={'회원가입'} />
      {/* <form onSubmit={handleSubmit} className='max-w-md mx-auto p-4 space-y-4'> */}
      <form className='max-w-md mx-auto p-4 space-y-4'>
        <div className='space-y-2'>
          <label className='block text-primary font-semibold'>* 아이디</label>
          <div className='flex items-center space-x-2'>
            <input
              type='text'
              name='id'
              value={data.username}
              onChange={(e) => handleChangeInputValue('username', e.target.value)}
              placeholder='아이디 입력(6-20자)'
              className='flex-grow border rounded px-3 py-2 text-sm'
            />
            <button
              type='button'
              onClick={handleCheckIdDuplicate}
              className='bg-primary text-white hover:bg-secondary rounded px-4 py-2 text-sm'
            >
              중복확인
            </button>
          </div>
          {data.username !== '' && usernameConfirm !== null && (
            <p className={`text-xs ml-2 ${usernameConfirm ? 'text-green-500' : 'text-red-500'}`}>
              {usernameConfirm ? '사용 가능한 아이디입니다.' : `${usernameConfirmErrorMessage}`}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <label className='block text-primary font-semibold'>* 비밀번호</label>
          <input
            type='password'
            name='password'
            value={data.password}
            onChange={(e) => handleChangeInputValue('password', e.target.value)}
            placeholder='비밀번호 입력(문자, 숫자, 특수문자 포함 8-20자)'
            className='w-full border rounded px-3 py-2 text-sm'
          />
        </div>

        <div className='space-y-2'>
          <label className='block text-primary font-semibold'>* 비밀번호 확인</label>
          <input
            type='password'
            name='confirmPassword'
            value={data.confirmPassword}
            onChange={(e) => handleChangeInputValue('confirmPassword', e.target.value)}
            placeholder='비밀번호 재입력'
            className='w-full border rounded px-3 py-2 text-sm'
          />
          {data.password !== '' && data.confirmPassword !== '' && passwordMatch !== null && (
            <p className={`text-xs mt-1 ml-2 ${passwordMatch ? 'text-green-500' : 'text-red-500'}`}>
              {passwordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <label className='block text-primary font-semibold'>* 이름</label>
          <input
            type='text'
            name='name'
            value={data.name}
            onChange={(e) => handleChangeInputValue('name', e.target.value)}
            placeholder='이름을 입력하세요.'
            className='w-full border rounded px-3 py-2 text-sm'
          />
        </div>

        <div className='space-y-2'>
          <label className='block text-primary font-semibold'>* 전화번호</label>
          <div className='flex items-center space-x-2'>
            <input
              type='tel'
              name='phoneNumber'
              value={data?.phoneNumber || ''}
              onChange={(e) => handleChangeInputValue('phoneNumber', e.target.value)}
              placeholder="휴대폰 번호 입력('-'제외 11자리 입력)"
              className='flex-grow border rounded px-3 py-2 text-sm'
              //   disabled={step > 0}
              //   disabled={authStep > 0}
            />
            <button
              type='button'
              onClick={handleRequestAuth}
              className='bg-primary hover:bg-secondary text-white px-4 py-2 text-sm rounded'
              //   className='bg-gray-200 text-gray-700 rounded px-4 py-2 text-sm  hover:bg-primary hover:text-white '
              //   disabled={step > 1}
              //   disabled={authStep > 0}
            >
              휴대폰 인증
            </button>
          </div>
        </div>

        {step >= 2 && (
          <div className='space-y-2'>
            <label className='block text-primary font-semibold'>인증번호</label>
            <div className='flex items-center space-x-2'>
              <input
                type='text'
                value={data.authNumber}
                onChange={(e) => handleChangeInputValue('authNumber', e.target.value)}
                placeholder='인증번호 6자리 입력'
                className='flex-grow border rounded px-3 py-2 text-sm'
              />
              <button
                type='button'
                onClick={handleVerify}
                className='bg-primary text-white rounded px-4 py-2 text-sm'
              >
                확인
              </button>
            </div>
            {isTimerRunning && !isVerified && (
              <p className='text-sm text-red-500 mt-1'>{formatTime(timeLeft)}</p>
            )}
          </div>
        )}

        {isVerified && <p className='text-green-500 text-xs ml-2'>휴대폰 인증이 완료되었습니다.</p>}

        <div className='flex items-center space-x-2'>
          <input
            type='checkbox'
            id='sms-consent'
            checked={data.smsConsent}
            onChange={(e) => handleChangeInputValue('smsConsent', e.target.checked)}
            className='rounded text-primary'
          />
          <label htmlFor='sms-consent' className='text-sm'>
            SMS 동의 여부 (필수)
          </label>
        </div>

        <button
          type='submit'
          className={`w-full rounded py-3 text-lg font-semibold ${
            usernameConfirm && passwordMatch && isVerified && data.smsConsent
              ? 'bg-primary hover:bg-secondary text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!(usernameConfirm && passwordMatch && isVerified && data.smsConsent)}
          onClick={(e) => handleSubmit(e)}
        >
          가입하기
        </button>
      </form>
      <HomeFooter></HomeFooter>
    </div>
  );
};

export default SignupForm;
