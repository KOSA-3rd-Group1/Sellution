import { Link } from 'react-router-dom';

const AddComponent = () => {
  return (
    <div>
      <div className='text-lg'>카테고리 등록 화면</div>
      <Link to='/product/category-list' className='w-fit h-5 bg-green-400'>
        취소
      </Link>
    </div>
  );
};

export default AddComponent;
