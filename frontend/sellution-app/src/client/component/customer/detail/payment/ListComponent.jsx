import { Link } from 'react-router-dom';

const ListComponent = () => {
  return (
    <div>
      <div className='text-lg'>결제 수단 목록 화면</div>
      <Link to='/customer/detail/payment/detail' className='w-fit h-5 bg-blue-400'>
        결제 수단 상세 이동 테스트
      </Link>
      <Link to='/customer/detail/payment/add' className='w-fit h-5 bg-red-400'>
        결제 수단 등록 테스트
      </Link>
    </div>
  );
};

export default ListComponent;
