import FooterComponent from '@/client/layout/partials/FooterComponent';
import { InfoInput } from '@/client/layout/common/Input';
import RadioButtonGroup from '@/client/layout/common/RadioButtonGroup';
import { useShopManagementUrlSetting } from '@/client/business/shopManagement/useShopManagementUrlSetting';
import { LinkIcon } from '../../utility/assets/Icons';
import { useRef, useState } from 'react';

const UrlSettingComponent = () => {
  const { data, handleChangeInputValue, handleChangeInputNameValue, handleSaveData } =
    useShopManagementUrlSetting();
  console.log(data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);
  //   const handleCopy = (textToCopy) => {
  //     navigator.clipboard
  //       .writeText(textToCopy)
  //       .then(() => {
  //         alert('Text copied to clipboard');
  //       })
  //       .catch((err) => {
  //         console.error('Could not copy text: ', err);
  //       });
  //   };
  const handleCopy = (textToCopy) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          setModalPosition({
            top: rect.bottom + window.scrollY,
            right: window.innerWidth - rect.right,
          });
        }
        setIsModalOpen(true);
        setTimeout(() => setIsModalOpen(false), 1000); // 2초 후 모달 닫기
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  };
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
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>쇼핑몰 QR 코드 *수정 필요*</div>
                <div className='flex-1 min-w-64'>
                  <InfoInput value={data?.qrCode || ''} readOnly />
                </div>
              </li>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>쇼핑몰 공개 여부</div>
                <div className='flex-1 min-w-64'>
                  <RadioButtonGroup
                    className='w-full flex justify-start items-center gap-6 px-4'
                    data={data}
                    options={[
                      { label: '공개', selectData: true },
                      { label: '비공개', selectData: false },
                    ]}
                    name='isShopVisible'
                    onChange={handleChangeInputValue}
                  />
                </div>
              </li>
            </ul>
          </div>
          {/* <div className='w-1/2'>
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
                <div className='flex-1 min-w-32'>계좌번호</div>
                <div className='flex-1 min-w-64'>
                  <InfoInput value={data.accountNumber || ''} readOnly />
                </div>
              </li>
            </ul>
          </div> */}
        </div>
      </section>
      <FooterComponent
        btn1={{ label: '취소', event: handleSaveData }}
        btn2={{ label: '변경사항 적용', event: handleSaveData }}
      />
      {isModalOpen && (
        <div
          className='fixed bg-white p-3 rounded-md shadow-lg z-50 text-sm border border-gray-200'
          style={{
            top: `${modalPosition.top}px`,
            right: `${modalPosition.right}px`,
          }}
        >
          <div className='flex items-center'>
            <svg
              className='w-5 h-5 text-green-500 mr-2'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path d='M5 13l4 4L19 7'></path>
            </svg>
            <p className='text-gray-700 font-medium'>링크가 복사되었습니다.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlSettingComponent;
