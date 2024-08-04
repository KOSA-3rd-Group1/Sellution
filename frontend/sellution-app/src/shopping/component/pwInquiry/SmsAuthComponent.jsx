import LogoHeaderNav from '@/shopping/layout/LogoHeaderNav';
import HomeFooter from '@/shopping/layout/HomeFooter';

import { useMove } from '@/shopping/business/common/useMove';
import { useSmsAuth } from '@/shopping/business/pwInquiry/useSmsAuth';

const SmsAuthComponent = () => {
  const { moveDefault, moveDefaultSearch } = useMove();
  const {
    data,
    step,
    timeLeft,
    isTimerRunning,
    isVerified,
    handleChangeInputValue,
    handleRequestAuth,
    handleVerify,
    moveNext,
    moveBack,
  } = useSmsAuth({ moveDefault, moveDefaultSearch });

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <LogoHeaderNav logoImageUrl={null} />
      <div className='relative w-full h-full bg-white'>
        <div className='absolute w-full h-fit top-[10%]  flex items-start justify-center p-4 flex-1'>
          <div className='relative w-full max-w-md min-h-[620px] p-8 bg-white rounded-lg shadow-md'>
            <h2 className='text-xl font-bold mb-6 text-center'>비밀번호 찾기 인증</h2>
            <div className='mb-4'>
              <label htmlFor='userId' className='block text-sm font-medium text-gray-700 mb-1'>
                아이디
              </label>
              <input
                type='text'
                id='username'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                placeholder='아이디를 입력하세요'
                value={data.username}
                onChange={(e) => handleChangeInputValue('username', e.target.value)}
              />
            </div>
            <div className='mb-4'>
              <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                이름
              </label>
              <input
                type='text'
                id='name'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                placeholder='성명 입력'
                value={data?.name || ''}
                onChange={(e) => handleChangeInputValue('name', e.target.value)}
              />
            </div>
            <div className='mb-4'>
              <label htmlFor='phoneNumber' className='block text-sm font-medium text-gray-700 mb-1'>
                휴대폰 번호
              </label>
              <div className='flex'>
                <input
                  type='tel'
                  id='phoneNumber'
                  className='flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary'
                  placeholder='숫자만 입력'
                  value={data?.phoneNumber || ''}
                  onChange={(e) => handleChangeInputValue('phoneNumber', e.target.value)}
                  maxLength={15}
                />
                <button
                  type='button'
                  onClick={handleRequestAuth}
                  className='bg-primary text-white px-4 py-2 rounded-r-md hover:bg-secondary transition duration-300 text-xs'
                >
                  인증번호 전송
                </button>
              </div>
            </div>
            {step >= 2 && (
              <div className='mb-6'>
                <label
                  htmlFor='authNumber'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  인증 번호
                </label>
                <div className='flex'>
                  <input
                    type='text'
                    id='authNumber'
                    className='flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary'
                    placeholder='인증번호 6자리 입력'
                    value={data?.authNumber || ''}
                    onChange={(e) => handleChangeInputValue('authNumber', e.target.value)}
                    disabled={isVerified}
                  />
                  <button
                    type='button'
                    onClick={handleVerify}
                    className='bg-primary text-white px-4 py-2 rounded-r-md hover:bg-secondary transition duration-300 text-xs'
                    disabled={isVerified}
                  >
                    인증번호 확인
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

            <div className='absolute bottom-10 w-[calc(100%-64px)]'>
              <button
                className={`w-full text-center py-3 rounded-md transition duration-300 ${
                  isVerified
                    ? 'bg-primary text-white hover:bg-secondary'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={(e) => moveNext(e)}
              >
                다음
              </button>
              <button
                type='button'
                className='block w-full bg-black text-white text-center py-3 rounded-md mt-3 hover:bg-gray-800 transition duration-300'
                onClick={(e) => moveBack(e)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
      <HomeFooter></HomeFooter>
    </>
  );
};

export default SmsAuthComponent;
