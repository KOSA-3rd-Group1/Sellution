import Select from 'react-select';
import FooterComponent from '@/client/layout/partials/FooterComponent';
import { InfoInput, InfoInputRight } from '@/client/layout/common/Input';
import AlertModal from '@/client/layout/common/modal/AlertModal';
import AutoCloseModal from '@/client/layout/common/modal/AutoCloseModal';
import { useMove } from '@/client/business/common/useMove';
import { useModal } from '@/client/business/common/useModal';
import { useEventAdd } from '@/client/business/event/useEventAdd';

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
    selectTargetCustomerType,
    selectedTargetCustomerType,
    handleChangeInputValue,
    handleChangeSelectedTargetCustomerType,
    checkMoveList,
    checkSaveContent,
    scuccessCloseAutoCloseModal,
    handleOnConfirm,
  } = useEventAdd({
    moveToPathname,
    openAlertModal,
    openAutoCloseModal,
    closeAutoCloseModal,
  });

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] p-2 flex flex-col overflow-y-auto'>
        <div className='w-3/5'>
          <div className='w-full h-20 text-lg font-semibold flex items-center'>
            <div>기본정보</div>
          </div>
          <ul className='w-full min-w-fit min-h-fit h-full flex flex-col text-sm border-t-2'>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>쿠폰 이름</div>
              <div className='flex-1 min-w-96'>
                <InfoInput
                  value={data.couponName || ''}
                  onChange={(e) => handleChangeInputValue('couponName', e.target.value)}
                  placeholder='쿠폰명을 입력하세요'
                />
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>적용 회원</div>
              <div className='flex-1 min-w-96'>
                <Select
                  isSearchable={false}
                  className='selectItem indent-4'
                  classNamePrefix='select'
                  onChange={handleChangeSelectedTargetCustomerType}
                  options={selectTargetCustomerType}
                  placeholder='회원 선택'
                  value={selectedTargetCustomerType}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 5,
                    colors: {
                      ...theme.colors,
                      neutral10: '#FCE8DB',
                      neutral80: '#F37021',
                      primary25: '#FFF8F4',
                      primary: '#F37021',
                    },
                  })}
                />
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>{'할인율(%)'}</div>
              <div className='flex-1 min-w-96'>
                <div className='flex items-center gap-2 text-right'>
                  <InfoInputRight
                    value={data.couponDiscountRate || ''}
                    onChange={(e) => handleChangeInputValue('couponDiscountRate', e.target.value)}
                    placeholder='할인율을 입력해주세요.'
                    maxLength={2}
                  />
                  <div className='text-base font-normal'>%</div>
                </div>
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>{'수량'}</div>
              <div className='flex-1 min-w-96'>
                <div className='flex items-center gap-2 text-right'>
                  <InfoInputRight
                    value={data.totalQuantity || ''}
                    onChange={(e) => handleChangeInputValue('totalQuantity', e.target.value)}
                    placeholder='수량을 입력해주세요.'
                    maxLength={15}
                  />
                  <div className='text-base font-normal'>개</div>
                </div>
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>이벤트 적용 기간</div>
              <div className='flex-1 min-w-96'>
                <div className='flex items-center gap-2'>
                  <InfoInput
                    type='date'
                    value={data.eventStartDate || ''}
                    onChange={(e) => handleChangeInputValue('eventStartDate', e.target.value)}
                    placeholder='시작일을 선택하세요.'
                  />
                  <div className='text-lg font-bold'>~</div>
                  <InfoInput
                    type='date'
                    value={data.eventEndDate || ''}
                    onChange={(e) => handleChangeInputValue('eventEndDate', e.target.value)}
                    placeholder='종료일을 선택하세요.'
                  />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <FooterComponent
        btn1={{ label: '취소', event: checkMoveList }}
        btn2={{ label: '이벤트 등록', event: checkSaveContent }}
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
