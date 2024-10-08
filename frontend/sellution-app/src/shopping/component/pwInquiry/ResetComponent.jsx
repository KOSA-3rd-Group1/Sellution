import LogoHeaderNav from '@/shopping/layout/LogoHeaderNav';
import HomeFooter from '@/shopping/layout/HomeFooter';

import { useMove } from '@/shopping/business/common/useMove';
import { useReset } from '@/shopping/business/pwInquiry/useReset';

const ResetComponent = () => {
  const { queryParams, moveDefault } = useMove();
  const { data, passwordMatch, handleChangeInputValue, handleSubmit, moveBack } = useReset({
    queryParams,
    moveDefault,
  });
  return (
    <>
      <LogoHeaderNav logoImageUrl={null} />
      <div className='relative w-full h-full bg-white'>
        <div className='absolute w-full h-fit top-[10%]  flex items-start justify-center p-4 flex-1'>
          <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
            <form>
              <h2 className='text-xl font-bold mb-6 text-center'>비밀번호 재설정</h2>
              <div className='mb-4'>
                <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
                  새 비밀번호
                </label>
                <input
                  type='password'
                  id='password'
                  className='w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                  placeholder='영문자, 숫자, 특수문자를 포함 8자에서 16자 사이로 입력'
                  value={data.password || ''}
                  onChange={(e) => handleChangeInputValue('password', e.target.value)}
                  autoComplete='new-password'
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
                  className='w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                  placeholder='비밀번호를 다시 입력하세요'
                  value={data.confirmPassword || ''}
                  onChange={(e) => handleChangeInputValue('confirmPassword', e.target.value)}
                  autoComplete='new-password'
                  required
                />
                {passwordMatch !== null && (
                  <p
                    className={`text-sm mt-1 ${passwordMatch ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {passwordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                  </p>
                )}
              </div>
              <button
                type='submit'
                className='w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition duration-300 mb-4'
                disabled={!passwordMatch}
                onClick={(e) => handleSubmit(e)}
              >
                비밀번호 변경 완료
              </button>
            </form>
            <button
              className='block w-full text-center bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300'
              onClick={(e) => moveBack(e)}
            >
              로그인으로 가기
            </button>
          </div>
        </div>
      </div>
      <HomeFooter></HomeFooter>
    </>
  );
};

export default ResetComponent;
