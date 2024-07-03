import { Link } from 'react-router-dom';

const AddComponent = () => {
  return (
    <div>
      <div className='text-lg'>결제 수단 등록 화면</div>
      <Link to='/customer/detail/payment/list' className='w-fit h-5 bg-green-400'>
        취소
      </Link>
    </div>
  );
};

export default AddComponent;
