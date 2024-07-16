import { useNavigate, useParams } from 'react-router-dom';
import FooterComponent from '@/client/layout/partials/FooterComponent';

const DetailComponent = () => {
  const { customerId, orderId } = useParams();

  const navigate = useNavigate();
  const moveList = () => {
    navigate({
      pathname: `/customer/${customerId}/order`,
    });
  };

  return (
    <div className='w-full h-full flex flex-col justify-between'>
      <section className='flex-auto bg-green-200'>
        <div className='text-lg'>주문 상세 화면</div>
        <div>회원 ID : {customerId}</div>
        <div>주문 ID : {orderId}</div>
      </section>
      <FooterComponent back={{ label: '목록으로', event: moveList }} />
    </div>
  );
};

export default DetailComponent;
