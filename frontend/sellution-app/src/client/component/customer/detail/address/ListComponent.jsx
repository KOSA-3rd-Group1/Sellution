import { Link } from 'react-router-dom';

const ListComponent = () => {
  return (
    <div>
      <div className='text-lg'>배송지 목록 화면</div>
      <Link to='/customer/detail/address/detail' className='w-fit h-5 bg-blue-400'>
        배송지 상세 이동 테스트
      </Link>
      <Link to='/customer/detail/address/add' className='w-fit h-5 bg-red-400'>
        배송지 등록 테스트
      </Link>
    </div>
  );
};

export default ListComponent;
