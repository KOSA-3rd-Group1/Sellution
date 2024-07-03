import { Link } from 'react-router-dom';

const DetailComponent = () => {
  return (
    <div>
      <div className='text-lg'>주문 상세 화면</div>
      <Link to='/customer/detail/order/list' className='w-fit h-5 bg-yellow-400'>
        취소
      </Link>
    </div>
  );
};

export default DetailComponent;
