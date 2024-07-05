import { useNavigate } from 'react-router-dom';
import FooterComponent from '@/client/layout/partials/FooterComponent';

const DetailComponent = () => {
  const navigate = useNavigate();
  const moveList = () => {
    navigate({
      pathname: '/payment-history/list',
    });
  };

  return (
    <div className='w-full h-full flex flex-col justify-between'>
      <section className='flex-auto bg-green-200'>
        <div className='text-lg'>결제 내역 상세 화면</div>
      </section>
      <FooterComponent back={{ label: '목록으로', event: moveList }} />
    </div>
  );
};

export default DetailComponent;
