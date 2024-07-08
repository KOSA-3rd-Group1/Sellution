import { Link, useNavigate } from 'react-router-dom';
import FooterComponent from '@/client/layout/partials/FooterComponent';

const ListComponent = () => {
  const navigate = useNavigate();
  const moveList = () => {
    navigate({
      pathname: '/customer',
    });
  };

  return (
    <div className='w-full h-full flex flex-col justify-between'>
      <section className='flex-auto bg-green-200'>
        <div className='text-lg'>결제 수단 목록 화면</div>
        <Link to='paymentId12345' className='w-fit h-5 bg-blue-400'>
          결제 수단 상세 이동 테스트 버튼
        </Link>
        <Link to='add' className='w-fit h-5 bg-red-400'>
          결제 수단 등록 테스트 버튼
        </Link>
      </section>
      <FooterComponent back={{ label: '목록으로', event: moveList }} />
    </div>
  );
};

export default ListComponent;
