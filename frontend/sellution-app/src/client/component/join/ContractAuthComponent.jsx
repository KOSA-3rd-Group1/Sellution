import { Link } from 'react-router-dom';

const ContractAuthComponent = () => {
  return (
    <div>
      <div>계약 회사 인증</div>
      <div>아이디 입력 필요</div>
      <div>비밀번호 입력 필요</div>
      <Link to='/join/sms-auth' className='bg-brandOrange'>
        다음
      </Link>
    </div>
  );
};

export default ContractAuthComponent;
