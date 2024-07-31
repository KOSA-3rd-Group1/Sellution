import FooterComponent from '@/client/layout/partials/FooterComponent';
import { InfoInput } from '@/client/layout/common/Input';
import { DownloadBtn } from '@/client/layout/common/Button';
import RadioButtonGroup from '@/client/layout/common/RadioButtonGroup';
import DropdownModal from '@/client/layout/common/modal/DropdownModal';
import AlertModal from '@/client/layout/common/modal/AlertModal';
import { useDropdownModal } from '@/client/business/common/useDropdownModal';
import { useModal } from '@/client/business/common/useModal';
import { useShopManagementUrlSetting } from '@/client/business/shopManagement/useShopManagementUrlSetting';
import { LinkIcon, DownloadIcon } from '@/client/utility/assets/Icons';

const UrlSettingComponent = () => {
  const { isModalOpen, modalPosition, buttonRef, handleCopy } = useDropdownModal();
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
    handleChangeInputNameValue,
    checkResetContent,
    checkSaveContent,
    handleOnConfirm,
    handleDownload,
  } = useShopManagementUrlSetting({
    openAlertModal,
    openAutoCloseModal,
    closeAutoCloseModal,
  });

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] p-2 flex flex-col overflow-y-auto'>
        <div className='flex flex-col gap-10 px-4'>
          <div className='w-3/5'>
            <div className='w-full min-h-20 h-20 max-h-20 text-base font-semibold flex items-center'>
              <div>쇼핑몰 URL 설정</div>
            </div>
            <ul className=' w-full min-w-fit flex flex-col text-sm border-t-2'>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>사업체명</div>
                <div className='flex-1 min-w-64 text-xs'>
                  <InfoInput
                    value={data.name || ''}
                    onChange={(e) => handleChangeInputNameValue('name', e.target.value)}
                    placeholder='사업체명을 입력하세요.'
                  />
                </div>
              </li>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>쇼핑몰 URL</div>
                <div className='flex-1 min-w-64 text-xs flex items-center gap-2'>
                  <InfoInput value={data?.shopUrl || ''} readOnly />
                  <button
                    ref={buttonRef}
                    onClick={() => handleCopy(data.shopUrl)}
                    className='w-9 h-9 bg-brandOrange text-white p-1 rounded-md'
                    title='링크복사'
                  >
                    <LinkIcon className='w-full h-full' />
                  </button>
                </div>
              </li>
              <li className='pl-4 h-44 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>쇼핑몰 QR 코드</div>
                <div className='flex-1 flex flex-col items-end justify-center min-w-64'>
                  <div className='w-fit min-w-64 h-full px-auto flex flex-row justify-center items-center border border-gray-400 border-dashed rounded-lg'>
                    <div className='w-32 h-32'>
                      <img className='w-full h-full object-contain' src={data?.qrCodeUrl || ''} />
                    </div>
                    <div className='h-32 min-w-28 pb-4 flex flex-col justify-end items-start'>
                      <DownloadBtn
                        Icon={DownloadIcon}
                        label={'다운로드'}
                        onClick={() => handleDownload(data?.qrCodeUrl)}
                      />
                    </div>
                  </div>
                </div>
              </li>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>쇼핑몰 공개 여부</div>
                <div className='flex-1 min-w-64'>
                  <RadioButtonGroup
                    className='w-full flex justify-start items-center gap-6 px-4'
                    data={data}
                    options={[
                      { label: '공개', selectData: 'Y' },
                      { label: '비공개', selectData: 'N' },
                    ]}
                    name='isShopVisible'
                    onChange={handleChangeInputValue}
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <FooterComponent
        btn1={{ label: '취소', event: checkResetContent }}
        btn2={{ label: '변경사항 적용', event: checkSaveContent }}
      />

      {isModalOpen && <DropdownModal modalPosition={modalPosition} />}

      <AlertModal
        isOpen={alertModalState.isOpen}
        onClose={closeAlertModal}
        onConfirm={handleOnConfirm}
        type={alertModalState.type}
        title={alertModalState.title}
        message={alertModalState.message}
      />
    </div>
  );
};

export default UrlSettingComponent;
