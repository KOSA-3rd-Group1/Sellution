import FooterComponent from '@/client/layout/partials/FooterComponent';
import { InfoInput } from '@/client/layout/common/Input';
import AlertModal from '@/client/layout/common/modal/AlertModal';
import AutoCloseModal from '@/client/layout/common/modal/AutoCloseModal';
import { useMove } from '@/client/business/common/useMove';
import { useModal } from '@/client/business/common/useModal';
import { useCustomerAdd } from '@/client/business/customer/useCustomerAdd';

const AddComponent = () => {
  const { moveToPathname, moveToDefaultPath } = useMove();
  const {
    alertModalState,
    autoCloseModalState,
    openAlertModal,
    closeAlertModal,
    openAutoCloseModal,
    closeAutoCloseModal,
  } = useModal();
  const { data, handleChangeInputValue, moveList, handleSaveData, scuccessCloseAutoCloseModal } =
    useCustomerAdd({
      moveToPathname,
      moveToDefaultPath,
      openAlertModal,
      openAutoCloseModal,
      closeAutoCloseModal,
    });
  console.log(data);

  const handleConfirm = () => {
    console.log('작업을 계속 수행합니다.');
  };

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] p-2 flex flex-col overflow-y-auto'>
        <div className='w-1/2'>
          <div className='w-full h-20 text-lg font-semibold flex items-center'>
            <div>기본정보</div>
          </div>
          <ul className='w-full min-w-fit min-h-fit h-full flex flex-col text-sm border-t-2'>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>회원명</div>
              <div className='flex-1 min-w-64'>
                <InfoInput
                  value={data.name || ''}
                  onChange={(e) => handleChangeInputValue('name', e.target.value)}
                  placeholder='회원 이름을 입력하세요.'
                />
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>휴대폰 번호</div>
              <div className='flex-1 min-w-64'>
                <InfoInput
                  value={data.phoneNumber || ''}
                  onChange={(e) => handleChangeInputValue('phoneNumber', e.target.value)}
                  placeholder='“-” 없이 숫자만 입력하세요.'
                  maxlength={11}
                />
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>회원 아이디</div>
              <div className='flex-1 min-w-64'>
                <InfoInput placeholder='자동생성' readOnly />
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>가입일</div>
              <div className='flex-1 min-w-64'>
                <InfoInput placeholder={data.createdAt} readOnly />
              </div>
            </li>
          </ul>
        </div>
      </section>
      <FooterComponent
        btn1={{ label: '취소', event: moveList }}
        btn2={{
          label: '회원 등록',
          event: () =>
            openAlertModal('warning', '주의', '이 작업은 취소할 수 없습니다. 계속하시겠습니까?'),
        }}
      />

      <AlertModal
        isOpen={alertModalState.isOpen}
        onClose={closeAlertModal}
        onConfirm={handleSaveData}
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

export default AddComponent;
