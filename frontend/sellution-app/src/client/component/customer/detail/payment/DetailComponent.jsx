import { useNavigate } from 'react-router-dom';
import FooterComponent from '@/client/layout/partials/FooterComponent';

const DetailComponent = () => {
  const navigate = useNavigate();
  const moveList = () => {
    navigate({
      pathname: '/customer/detail/payment/list',
    });
  };
  const dummyEvent = () => {
    alert('더미 이벤트 발생');
  };

  return (
    <div className='w-full h-full flex flex-col justify-between'>
      <section className='flex-auto bg-green-200'>
        <div className='text-lg'>결제 수단 상세 화면</div>
      </section>
      <FooterComponent
        btn1={{ label: '결제 수단 삭제', event: dummyEvent }}
        btn2={{ label: '변경사항 적용', event: dummyEvent }}
        back={{ label: '목록으로', event: moveList }}
      />
    </div>
  );
};

export default DetailComponent;
