import { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import LogoHeaderNav from '@/shopping/layout/LogoHeaderNav';
import HomeFooter from '@/shopping/layout/HomeFooter';

const ViewComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clientName } = useParams();

  useEffect(() => {
    if (!location.state || !location.state.username) {
      navigate(`/shopping/${clientName}/login`, { replace: true });
    }
  }, [location.state, navigate]);

  if (!location.state || !location.state.username) {
    return null; // 리다이렉트 중에는 아무것도 렌더링하지 않음
  }
  const foundUserId = location.state.username;

  return (
    <>
      <LogoHeaderNav logoImageUrl={null} />
      <div className='relative w-full h-full bg-white'>
        <div className='absolute w-full h-fit top-[10%]  flex items-start justify-center p-4 flex-1'>
          <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
            <h2 className='text-xl font-bold mb-6 text-center'>내 아이디 확인</h2>

            <div className='mb-6'>
              <p className='text-center text-gray-600 mb-2'>회원님의 아이디는 다음과 같습니다:</p>
            </div>

            <div className='bg-gray-100 p-4 rounded-md mb-6'>
              <div className='text-sm text-gray-600'>
                <p className='text-center text-xl font-bold text-primary my-4'>{foundUserId}</p>
              </div>
            </div>

            <Link
              to={`/shopping/${clientName}/login`}
              className='block w-full bg-primary text-white text-center py-3 rounded-md hover:bg-secondary transition duration-300'
            >
              로그인으로 가기
            </Link>

            <div className='mt-4 text-center'>
              <Link
                to={`/shopping/${clientName}/pwInquiry/sms-auth`}
                className='text-sm text-gray-600 hover:text-primary'
              >
                비밀번호를 잊으셨나요?
              </Link>
            </div>
          </div>
        </div>
      </div>
      <HomeFooter></HomeFooter>
    </>
  );
};

export default ViewComponent;
