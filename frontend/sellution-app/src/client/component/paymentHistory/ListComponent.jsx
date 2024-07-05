import { Link } from 'react-router-dom';

const ListComponent = () => {
  return (
    <div className='w-full h-full flex flex-col justify-between'>
      <section className='flex-auto bg-green-200'>
        <div className='text-lg'>결제 내역 목록 화면</div>
        <Link to='/payment-history/detail' className='w-fit h-5 bg-blue-400'>
          결제 내역 상세 이동 테스트 버튼
        </Link>
      </section>
    </div>
  );
};

export default ListComponent;
