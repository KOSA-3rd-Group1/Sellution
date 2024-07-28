import { Link } from 'react-router-dom';

const BeginComponent = () => {
  return (
    <div>
      <div>회원가입 시 사용자 정보 입력</div>
      <Link to='/login' className='bg-brandOrange'>
        로그인으로 가기
      </Link>
    </div>
  );
};

export default BeginComponent;
