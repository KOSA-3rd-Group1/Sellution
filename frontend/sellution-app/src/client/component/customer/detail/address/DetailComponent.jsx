import { useNavigate, useParams } from 'react-router-dom';
import FooterComponent from '@/client/layout/partials/FooterComponent';

const DetailComponent = () => {
  const { customerId, addressId } = useParams();

  const navigate = useNavigate();
  const moveList = () => {
    navigate({
      pathname: `/customer/${customerId}/address`,
    });
  };
  const dummyEvent = () => {
    alert('더미 이벤트 발생');
  };

  return (
    <div className='w-full h-full flex flex-col justify-between'>
      <section className='flex-auto bg-green-200'>
        <div className='text-lg'>배송지 상세 화면</div>
        <div>회원 ID : {customerId}</div>
        <div>배송지 ID : {addressId}</div>
      </section>
      <FooterComponent
        btn1={{ label: '배송지 삭제', event: dummyEvent }}
        btn2={{ label: '변경사항 적용', event: dummyEvent }}
        back={{ label: '목록으로', event: moveList }}
      />
    </div>
  );
};

export default DetailComponent;
