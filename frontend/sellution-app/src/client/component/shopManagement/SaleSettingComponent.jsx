import FooterComponent from '@/client/layout/partials/FooterComponent';

const SaleSettingComponent = () => {
  const dummyEvent = () => {
    alert('더미 이벤트 발생');
  };

  return (
    <div className='w-full h-full flex flex-col justify-between'>
      <section className='flex-auto bg-green-200'>
        <div>쇼핑몰 판매 설정 화면</div>
      </section>
      <FooterComponent
        btn1={{ label: '취소', event: dummyEvent }}
        btn2={{ label: '변경사항 적용', event: dummyEvent }}
      />
    </div>
  );
};

export default SaleSettingComponent;
