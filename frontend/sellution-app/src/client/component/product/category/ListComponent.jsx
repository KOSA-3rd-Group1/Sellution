import { Link } from 'react-router-dom';

const ListComponent = () => {
  return (
    <div>
      <div className='text-lg'>카테고리 목록 화면</div>
      <Link to='/product/category-detail' className='w-fit h-5 bg-blue-400'>
        카테고리 상세 이동 테스트
      </Link>
      <Link to='/product/category-add' className='w-fit h-5 bg-red-400'>
        카테고리 등록 테스트
      </Link>
    </div>
  );
};

export default ListComponent;
