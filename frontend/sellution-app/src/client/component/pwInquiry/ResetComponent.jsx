import { Link } from 'react-router-dom';

const ResetComponent = () => {
  return (
    <div>
      <div>비밀번호 재설정</div>
      <div>비밀번호 입력 필요</div>
      <div>비밀번호 재확인 입력 필요</div>
      <Link to='/login' className='bg-brandOrange'>
        로그인으로 가기
      </Link>
    </div>
  );
};

export default ResetComponent;
