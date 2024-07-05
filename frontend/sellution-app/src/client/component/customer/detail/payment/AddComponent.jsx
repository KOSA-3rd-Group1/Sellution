import { useNavigate, useParams } from 'react-router-dom';
import FooterComponent from '@/client/layout/partials/FooterComponent';

const AddComponent = () => {
  const { customerId } = useParams();

  const navigate = useNavigate();
  const moveList = () => {
    navigate({
      pathname: `/customer/${customerId}/payment`,
    });
  };
  const dummyEvent = () => {
    alert('더미 이벤트 발생');
  };

  return (
    <div className='w-full h-full flex flex-col justify-between'>
      <section className='flex-auto bg-green-200'>
        <div className='text-lg'>결제 수단 등록 화면</div>
        <div>회원 ID : {customerId}</div>
      </section>
      <FooterComponent
        btn1={{ label: '취소', event: moveList }}
        btn2={{ label: '결제수단 등록', event: dummyEvent }}
      />
    </div>
  );
};

export default AddComponent;
