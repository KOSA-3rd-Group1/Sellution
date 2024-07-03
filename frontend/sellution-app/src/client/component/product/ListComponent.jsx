import { Link } from 'react-router-dom';

const ListComponent = () => {
  return (
    <div>
      <div className='text-lg'>상품 목록 화면</div>
      <Link to='/product/detail' className='w-fit h-5 bg-blue-400'>
        상품 상세 이동 테스트
      </Link>
      <Link to='/product/add' className='w-fit h-5 bg-red-400'>
        상품 등록 테스트
      </Link>
    </div>
  );
};

export default ListComponent;
