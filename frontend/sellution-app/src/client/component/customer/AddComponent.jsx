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
  const {
    data,
    handleChangeInputValue,
    checkMoveList,
    checkSaveContent,
    scuccessCloseAutoCloseModal,
    handleOnConfirm,
  } = useCustomerAdd({
    moveToPathname,
    moveToDefaultPath,
    openAlertModal,
    openAutoCloseModal,
    closeAutoCloseModal,
  });
  console.log(data);

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] p-2 flex flex-col overflow-y-auto'>
        <div className='w-3/5'>
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
                  placeholder='휴대폰 번호를 입력하세요.'
                  maxlength={15}
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
        btn1={{ label: '취소', event: checkMoveList }}
        btn2={{ label: '회원 등록', event: checkSaveContent }}
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

export default AddComponent;
