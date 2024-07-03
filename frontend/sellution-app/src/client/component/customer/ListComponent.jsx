import { Link } from 'react-router-dom';

const ListComponent = () => {
  return (
    <div>
      <div className='text-lg'>회원 목록 화면</div>
      <Link to='/customer/detail' className='w-fit h-5 bg-blue-400'>
        회원 상세 이동 테스트
      </Link>
      <Link to='/customer/add' className='w-fit h-5 bg-red-400'>
        회원 등록 테스트
      </Link>
    </div>
  );
};

export default ListComponent;
