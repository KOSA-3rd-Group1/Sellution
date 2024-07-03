import { Link } from 'react-router-dom';

const ListComponent = () => {
  return (
    <div>
      <div className='text-lg'>주문 목록 화면</div>
      <Link to='/order/detail' className='w-fit h-5 bg-blue-400'>
        주문 상세 이동 테스트
      </Link>
    </div>
  );
};

export default ListComponent;
