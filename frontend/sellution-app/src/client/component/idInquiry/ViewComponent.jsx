import { Link } from 'react-router-dom';

const ViewComponent = () => {
  return (
    <div>
      <div>내 아이디 확인</div>
      <Link to='/login' className='bg-brandOrange'>
        로그인으로 가기
      </Link>
    </div>
  );
};

export default ViewComponent;
