import FooterComponent from '@/client/layout/partials/FooterComponent';
import { InfoInput } from '@/client/layout/common/Input';
import { EventBtn } from '@/client/layout/common/Button';
import RadioButtonGroup from '@/client/layout/common/RadioButtonGroup';
import AlertModal from '@/client/layout/common/modal/AlertModal';
import AutoCloseModal from '@/client/layout/common/modal/AutoCloseModal';
import { useMove } from '@/client/business/common/useMove';
import { useModal } from '@/client/business/common/useModal';
import { useCustomerAddressDetail } from '@/client/business/customer/detail/address/useCustomerAddressDetail';

const DetailComponent = () => {
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
    checkDeleteContent,
    scuccessCloseAutoCloseModal,
    handleOnConfirm,
    handlePostcode,
  } = useCustomerAddressDetail({
    moveToPathname,
    moveToDefaultPath,
    openAlertModal,
    openAutoCloseModal,
    closeAutoCloseModal,
  });

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] py-2 px-4 flex flex-col overflow-y-auto'>
        <div className='w-3/5'>
          <div className='w-full min-h-16 h-16 max-h-16 text-lg font-semibold flex items-center'>
            <div>배송지 상세 정보</div>
          </div>
          <ul className='w-full min-w-fit min-h-fit h-full flex flex-col text-sm border-t-2'>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>수령인</div>
              <div className='flex-1 min-w-64'>
                <InfoInput
                  value={data.name || ''}
                  onChange={(e) => handleChangeInputValue('name', e.target.value)}
                />
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>우편번호</div>
              <div className='flex-1 min-w-64 flex gap-2'>
                <div className='flex-[2]'>
                  <InfoInput
                    value={data.zipcode || ''}
                    onChange={(e) => handleChangeInputValue('zipcode', e.target.value)}
                    placeholder={'우편번호를 검색하세요'}
                    readOnly
                  />
                </div>
                <div className='flex-1 min-w-fit flex justify-end items-center'>
                  <EventBtn label={'우편번호 검색'} onClick={handlePostcode} />
                </div>
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>주소</div>
              <div className='flex-1 min-w-64'>
                <InfoInput value={data.streetAddress || ''} readOnly />
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>상세주소</div>
              <div className='flex-1 min-w-64'>
                <InfoInput
                  value={data.addressDetail || ''}
                  onChange={(e) => handleChangeInputValue('addressDetail', e.target.value)}
                  placeholder={data.zipcode ? '상세 주소를 입력하세요.' : ''}
                  readOnly={!data.zipcode}
                />
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>휴대폰 번호</div>
              <div className='flex-1 min-w-64'>
                <InfoInput
                  value={data.phoneNumber || ''}
                  onChange={(e) => handleChangeInputValue('phoneNumber', e.target.value)}
                  placeholder={'휴대폰 번호를 입력하세요.'}
                  maxLength={15}
                />
              </div>
            </li>
            <li className='pl-4 flex-1 min-h-14 max-h-20 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>배송지명</div>
              <div className='flex-1 min-w-64'>
                <InfoInput
                  value={data.addressName || ''}
                  onChange={(e) => handleChangeInputValue('addressName', e.target.value)}
                />
              </div>
            </li>
            <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
              <div className='flex-1 min-w-32'>기본 배송지 설정</div>
              <div className='flex-1 min-w-64'>
                <RadioButtonGroup
                  className='w-full flex justify-start items-center gap-6 px-4'
                  data={data}
                  options={[
                    { label: '설정', selectData: 'Y' },
                    { label: '미설정', selectData: 'N' },
                  ]}
                  name='isDefaultAddress'
                  onChange={handleChangeInputValue}
                />
              </div>
            </li>
          </ul>
        </div>
      </section>
      <FooterComponent
        btn1={{ label: '배송지 삭제', event: checkDeleteContent }}
        btn2={{ label: '변경사항 적용', event: checkSaveContent }}
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
