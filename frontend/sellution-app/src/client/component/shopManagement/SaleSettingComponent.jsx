import FooterComponent from '@/client/layout/partials/FooterComponent';
import { InfoInput } from '@/client/layout/common/Input';
import { useCustomerPaymentDetail } from '@/client/business/customer/detail/payment/useCustomerPaymentDetail';

const SaleSettingComponent = () => {
  const dummyEvent = () => {
    alert('더미 이벤트 발생');
  };
  const { data, moveList, handleDeleteData } = useCustomerPaymentDetail();

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] p-2 flex flex-col overflow-y-auto'>
        <div className='w-full min-h-14 h-14 max-h-14 text-lg font-semibold flex items-center'>
          <div>결제 수단 상세 정보 수정이 필요한 페이지</div>
        </div>
        <div className='flex flex-col gap-10 px-4'>
          <div className='w-1/2'>
            <div className='w-full min-h-20 h-20 max-h-20 text-base font-semibold flex items-center'>
              <div>기본 정보</div>
            </div>
            <ul className=' w-full min-w-fit flex flex-col text-sm border-t-2'>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>결제 수단</div>
                <div className='flex-1 min-w-64'>
                  <InfoInput value={data.paymentMethod || ''} disabled textDefault={true} />
                </div>
              </li>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>결제 수단 등록일</div>
                <div className='flex-1 min-w-64'>
                  <InfoInput value={data.createdAt || ''} readOnly />
                </div>
              </li>
            </ul>
          </div>
          <div className='w-1/2'>
            <div className='w-full min-h-20 h-20 max-h-20 text-base font-semibold flex items-center'>
              <div>자동 결제 CMS</div>
            </div>
            <ul className=' w-full min-w-fit flex flex-col text-sm border-t-2'>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>은행</div>
                <div className='flex-1 min-w-64'>
                  <InfoInput value={data.bank || ''} readOnly />
                </div>
              </li>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>예금주명</div>
                <div className='flex-1 min-w-64'>
                  <InfoInput value={data.name || ''} readOnly />
                </div>
              </li>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>계좌번호</div>
                <div className='flex-1 min-w-64'>
                  <InfoInput value={data.accountNumber || ''} readOnly />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <FooterComponent
        // btn1={{ label: '결제 수단 삭제', event: handleDeleteData }}
        btn2={{ label: '결제 수단 삭제', event: handleDeleteData }}
        back={{ label: '목록으로', event: moveList }}
      />
    </div>
  );
};

export default SaleSettingComponent;
