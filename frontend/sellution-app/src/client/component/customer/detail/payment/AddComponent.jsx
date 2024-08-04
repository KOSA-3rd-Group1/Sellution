import { InfoInput } from '@/client/layout/common/Input';
import FooterComponent from '@/client/layout/partials/FooterComponent';
import BankSelector from '@/client/layout/common/BankSelector';
import RadioButtonGroup from '@/client/layout/common/RadioButtonGroup';
import AlertModal from '@/client/layout/common/modal/AlertModal';
import AutoCloseModal from '@/client/layout/common/modal/AutoCloseModal';
import LoadingModal from '@/client/layout/common/modal/LodingModal';
import { useMove } from '@/client/business/common/useMove';
import { useModal } from '@/client/business/common/useModal';
import { useCustomerPaymentAdd } from '@/client/business/customer/detail/payment/useCustomerPaymentAdd';

const AddComponent = () => {
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
    isLoading,
    handleChangeInputValue,
    checkMoveList,
    checkSaveContent,
    scuccessCloseAutoCloseModal,
    handleOnConfirm,
  } = useCustomerPaymentAdd({
    moveToPathname,
    openAlertModal,
    openAutoCloseModal,
    closeAutoCloseModal,
  });

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] p-2 flex flex-col overflow-y-auto'>
        <div className='w-full min-h-14 h-14 max-h-14 text-lg font-semibold flex items-center'>
          <div>결제 수단 등록</div>
        </div>
        <div className='flex flex-col gap-10 px-4'>
          <div className='w-1/2'>
            <div className='w-full min-h-20 h-20 max-h-20 text-base font-semibold flex items-center'>
              <div>기본 정보</div>
            </div>
            <ul className=' w-full min-w-fit flex flex-col text-sm border-t-2'>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>결제 수단</div>
                <div className='flex-1 min-w-72'>
                  <RadioButtonGroup
                    className='w-full flex justify-between items-center gap-6 px-4'
                    data={data}
                    options={[{ label: 'CMS', selectData: 'CMS' }]}
                    name='paymentMethod'
                    onChange={handleChangeInputValue}
                  />
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
                <div className='flex-1 min-w-32'>계좌번호</div>
                <div className='flex-1 min-w-72'>
                  <InfoInput
                    value={data.accountNumber || ''}
                    onChange={(e) => handleChangeInputValue('accountNumber', e.target.value)}
                    placeholder='계좌번호를 입력하세요.'
                    maxLength={25}
                  />
                </div>
              </li>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>은행</div>
                <div className='flex-1 min-w-72'>
                  <BankSelector onSelect={handleChangeInputValue} />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <FooterComponent
        btn1={{ label: '취소', event: checkMoveList }}
        btn2={{ label: '결제수단 등록', event: checkSaveContent }}
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

      <LoadingModal isOpen={isLoading} message={'결제수단 등록중...'} />
    </div>
  );
};

export default AddComponent;
