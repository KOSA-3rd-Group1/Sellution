import FooterComponent from '@/client/layout/partials/FooterComponent';
import { InfoInput } from '@/client/layout/common/Input';
import BankSelector from '@/client/layout/common/BankSelector';
import AlertModal from '@/client/layout/common/modal/AlertModal';
import AutoCloseModal from '@/client/layout/common/modal/AutoCloseModal';
import { useMove } from '@/client/business/common/useMove';
import { useModal } from '@/client/business/common/useModal';
import { useCustomerPaymentDetail } from '@/client/business/customer/detail/payment/useCustomerPaymentDetail';

const DetailComponent = () => {
  const { moveToPathname } = useMove();
  const {
    alertModalState,
    autoCloseModalState,
    openAlertModal,
    closeAlertModal,
    openAutoCloseModal,
    closeAutoCloseModal,
  } = useModal();
  const {
    data,
    bankCodeIndex,
    checkMoveList,
    checkDeleteContent,
    scuccessCloseAutoCloseModal,
    handleOnConfirm,
  } = useCustomerPaymentDetail({
    moveToPathname,
    openAlertModal,
    openAutoCloseModal,
    closeAutoCloseModal,
  });

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] p-2 flex flex-col overflow-y-auto'>
        <div className='w-full min-h-14 h-14 max-h-14 text-lg font-semibold flex items-center'>
          <div>결제 수단 상세 정보</div>
        </div>
        <div className='flex flex-col gap-10 px-4'>
          <div className='w-3/5'>
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
          <div className='w-3/5'>
            <div className='w-full min-h-20 h-20 max-h-20 text-base font-semibold flex items-center'>
              <div>자동 결제 CMS</div>
            </div>
            <ul className=' w-full min-w-fit flex flex-col text-sm border-t-2'>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>은행</div>
                <div className='flex-1 min-w-64'>
                  <BankSelector bankCodeIndex={bankCodeIndex} isDisabled={true} />
                </div>
              </li>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>예금주명</div>
                <div className='flex-1 min-w-64'>
                  <InfoInput value={data.customerName || ''} readOnly />
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
        btn2={{ label: '결제 수단 삭제', event: checkDeleteContent }}
        back={{ label: '목록으로', event: checkMoveList }}
      />

      <AlertModal
        isOpen={alertModalState.isOpen}
        onClose={closeAlertModal}
        onConfirm={handleOnConfirm}
        type={alertModalState.type}
        title={alertModalState.title}
        message={alertModalState.message}
      />

      <AutoCloseModal
        isOpen={autoCloseModalState.isOpen}
        onClose={scuccessCloseAutoCloseModal}
        title={autoCloseModalState.title}
        message={autoCloseModalState.message}
        duration={1500}
      />
    </div>
  );
};

export default DetailComponent;
