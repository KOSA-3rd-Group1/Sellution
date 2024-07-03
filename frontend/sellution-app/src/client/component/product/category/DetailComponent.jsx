import { Link } from 'react-router-dom';

const DetailComponent = () => {
  return (
    <div>
      <div className='text-lg'>카테고리 상세 화면</div>
      <Link to='/product/category-list' className='w-fit h-5 bg-yellow-400'>
        취소
      </Link>
    </div>
  );
};

export default DetailComponent;
