import { useMove } from '@/client/business/common/useMove';
import { useBegin } from '@/client/business/join/useBegin';

const BeginComponent = () => {
  const { moveDefault } = useMove();
  const {
    signupInfo,
    data,
    usernameConfirm,
    usernameConfirmErrorMessage,
    passwordMatch,
    handleChangeInputValue,
    handleCheckIdDuplicat,
    handleSubmit,
  } = useBegin({
    moveDefault,
  });

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100 p-4'>
      <div className='relative min-w-[600px] w-[600px] max-w-[600px] bg-white p-8 rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>아이디 생성</h2>

        <div className='bg-gray-100 p-4 rounded-md mb-6 text-base'>
          <p className='font-bold mb-2'>* 회원가입 안내</p>
          <ul className='text-sm pl-2 pt-1 list-disc list-inside'>
            <li>서비스를 이용하실 때 사용하실 아이디와 비밀번호로 가입해주세요.</li>
            <li>본인 인증에 사용된 정보는 본인의 식별 외 용도로 사용됩니다.</li>
          </ul>
        </div>

        <div className='grid grid-cols-2 gap-4 mb-6'>
          <div className='h-24 flex flex-col justify-evenly px-4 bg-gray-100 rounded-md text-sm'>
            <div className='flex justify-between gap-2'>
              <p className='min-w-fit font-bold flex-1'>회사명</p>
              <p className='min-w-fit flex-[2] text-right'>{`${signupInfo.contractCompanyName}`}</p>
            </div>
            <div className='flex justify-between gap-2'>
              <p className='min-w-fit font-bold flex-1'>사업자 번호</p>
              <p className='min-w-fit flex-[2] text-right'>{`${signupInfo.businessRegistrationNumber}`}</p>
            </div>
          </div>
          <div className='h-24 flex flex-col justify-evenly px-4 bg-gray-100 rounded-md text-sm'>
            <div className='flex justify-between gap-2'>
              <p className='min-w-fit font-bold flex-1'>사용자명</p>
              <p className='min-w-fit flex-[2] text-right'>{`${signupInfo.name}`}</p>
            </div>
            <div className='flex justify-between gap-2'>
              <p className='min-w-fit font-bold flex-1'>전화번호</p>
              <p className='min-w-fit flex-[2] text-right'>{`${signupInfo.phoneNumber}`}</p>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='col-span-1'></div>
          <div className='col-span-2 mb-2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>아이디</label>
            <div className='flex'>
              <input
                type='text'
                value={data.username || ''}
                onChange={(e) => handleChangeInputValue('username', e.target.value)}
                className='flex-grow p-2 border rounded-l-md text-sm'
                placeholder='영문자와 숫자 포함, 6자에서 20자 사이로 입력해 주세요.'
              />
              <button
                type='button'
                className='bg-orange-500 text-white px-4 py-2 rounded-r-md'
                onClick={handleCheckIdDuplicat}
              >
                중복 확인
              </button>
            </div>
            {data.username !== '' && usernameConfirm !== null && (
              <p
                className={`text-sm mt-1 pl-1 ${usernameConfirm ? 'text-green-500' : 'text-red-500'}`}
              >
                {usernameConfirm ? '사용가능한 아이디입니다.' : `${usernameConfirmErrorMessage}`}
              </p>
            )}
          </div>

          <div className='col-span-2 mb-2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>비밀번호</label>
            <input
              type='password'
              value={data.password}
              onChange={(e) => handleChangeInputValue('password', e.target.value)}
              className='w-full p-2 border rounded-md text-sm'
              placeholder='영문자, 숫자, 특수문자를 포함 8자에서 16자 사이로 입력해 주세요.'
            />
          </div>

          <div className='col-span-2 mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>비밀번호 확인</label>
            <input
              type='password'
              value={data.confirmPassword}
              onChange={(e) => handleChangeInputValue('confirmPassword', e.target.value)}
              className='w-full p-2 border rounded-md text-sm'
              placeholder='비밀번호를 다시 입력해주세요.'
            />
            {data.password !== '' && data.confirmPassword !== '' && passwordMatch !== null && (
              <p className={`text-sm mt-1 ${passwordMatch ? 'text-green-500' : 'text-red-500'}`}>
                {passwordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
              </p>
            )}
          </div>

          <div className='col-span-2'>
            <button
              className='w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300 mb-2'
              disabled={!passwordMatch && !usernameConfirm}
              onClick={handleSubmit}
            >
              아이디 생성 완료
            </button>

            <button
              className='block w-full text-center bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300'
              onClick={() => moveDefault('/login')}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeginComponent;
