import { Link } from 'react-router-dom';

const ListComponent = () => {
  return (
    <div>
      <div className='text-lg'>결제 내역 목록 화면</div>
      <Link to='/payment-history/detail' className='w-fit h-5 bg-blue-400'>
        결제 내역 상세 이동 테스트
      </Link>
    </div>
  );
};

export default ListComponent;
