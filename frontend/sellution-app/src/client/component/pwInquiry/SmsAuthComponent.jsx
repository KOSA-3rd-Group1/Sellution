import { Link } from 'react-router-dom';

const SmsAuthComponent = () => {
  return (
    <div>
      <div>비밀번호 찾기 인증</div>
      <div>이름 입력 필요</div>
      <div>아이디 입력 필요</div>
      <div>전화번호 입력 및 인증코드 발송 버튼 필요</div>
      <div>인증번호 입력 필요</div>
      <Link to='/pwInquiry/reset' className='bg-brandOrange'>
        다음
      </Link>
    </div>
  );
};

export default SmsAuthComponent;
