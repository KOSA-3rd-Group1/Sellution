import { useNavigate } from 'react-router-dom';
import FooterComponent from '@/client/layout/partials/FooterComponent';

const AddComponent = () => {
  const navigate = useNavigate();
  const moveList = () => {
    navigate({
      pathname: '/customer/list',
    });
  };
  const dummyEvent = () => {
    alert('더미 이벤트 발생');
  };

  return (
    <div className='w-full h-full flex flex-col justify-between'>
      <section className='flex-auto bg-green-200'></section>
      <FooterComponent
        btn1={{ label: '취소', event: moveList }}
        btn2={{ label: '회원 등록', event: dummyEvent }}
      />
    </div>
  );
};

export default AddComponent;
