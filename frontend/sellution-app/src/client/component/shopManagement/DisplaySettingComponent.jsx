import FooterComponent from '@/client/layout/partials/FooterComponent';
import { InfoInput } from '@/client/layout/common/Input';
import ColorPalette from '@/client/layout/common/ColorPalette';
import ShoppingMallPreview from '@/client/layout/shopManagement/ShoppingMallPreview';
import { useModal } from '@/client/business/common/useModal';
import { useShopManagementDisplaySetting } from '@/client/business/shopManagement/useShopManagementDisplaySetting';
import ImageBox from '@/client/layout/common/ImageBox';

const DisplaySettingComponent = () => {
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
    logoImg,
    selectedLogoImg,
    promotionImg,
    selectedPromotionImg,
    themeColor,
    serviceType,
    setLogoImg,
    setSelectedLogoImg,
    setPromotionImg,
    setSelectedPromotionImg,
    handleChangeInputValue,
    handleChangePromotionImg,
    handleChangeLogoImg,
    handleChangeThemeColor,
    handleUploadSuccess,
    handleBeforeRemove,
    handleEditImage,
    handleRestoreData,
    handleSaveData,
  } = useShopManagementDisplaySetting({ openAlertModal, openAutoCloseModal, closeAutoCloseModal });

  return (
    <div className='relative w-full h-full justify-between'>
      <section className='absolute w-full h-[calc(100%-58px)] p-2 flex flex-col overflow-y-auto'>
        <div className='flex gap-10 px-4'>
          <div className='w-1/2 min-w-fit'>
            <div className='w-full min-h-20 h-20 max-h-20 text-base font-semibold flex items-center'>
              <div>쇼핑몰 화면 설정</div>
            </div>
            <ul className=' w-full min-w-fit flex flex-col text-sm border-t-2'>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>회사명</div>
                <div className='flex-1 min-w-64'>
                  <InfoInput
                    value={data.displayName || ''}
                    onChange={(e) => handleChangeInputValue('displayName', e.target.value)}
                    placeholder='판매 사이트에 등록될 회사명을 입력하세요.'
                  />
                </div>
              </li>
              <ImageBox
                TitleTag={<div>로고 이미지 </div>}
                inputId={'file-upload-logo'}
                onUploadSuccess={handleUploadSuccess}
                onBeforeRemove={handleBeforeRemove}
                onEditImage={handleEditImage}
                onDataChange={handleChangeLogoImg}
                isMultiImage={false}
                maxImageCount={1}
                containerHeight={'h-32'}
                previewSize={'w-64 h-16'}
                images={logoImg}
                setImages={setLogoImg}
                selectedImage={selectedLogoImg}
                setSelectedImage={setSelectedLogoImg}
                // multiple
              />
              <ImageBox
                TitleTag={
                  <div className='mb-6'>
                    프로모션 이미지{' '}
                    <span className='pl-2 text-xs text-red-500'>{'(* 1개 이상 입력 필수)'}</span>
                  </div>
                }
                inputId={'file-upload-promotion'}
                onUploadSuccess={handleUploadSuccess}
                onBeforeRemove={handleBeforeRemove}
                onEditImage={handleEditImage}
                onDataChange={handleChangePromotionImg}
                isMultiImage={true}
                maxImageCount={5}
                containerHeight={'h-40'}
                previewSize={'w-28 h-28'}
                images={promotionImg}
                setImages={setPromotionImg}
                selectedImage={selectedPromotionImg}
                setSelectedImage={setSelectedPromotionImg}
                multiple
              />
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>프로모션 문구 제목1</div>
                <div className='flex-1 min-w-64'>
                  <InfoInput
                    value={data.mainPromotion1Title || ''}
                    onChange={(e) => handleChangeInputValue('mainPromotion1Title', e.target.value)}
                    placeholder='최대 50자 입력 가능.'
                  />
                </div>
              </li>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>프로모션 문구 내용1</div>
                <div className='flex-1 min-w-64'>
                  <InfoInput
                    value={data.mainPromotion1Content || ''}
                    onChange={(e) =>
                      handleChangeInputValue('mainPromotion1Content', e.target.value)
                    }
                    placeholder='최대 50자 입력 가능.'
                  />
                </div>
              </li>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>프로모션 문구 제목2</div>
                <div className='flex-1 min-w-64'>
                  <InfoInput
                    value={data.mainPromotion2Title || ''}
                    onChange={(e) => handleChangeInputValue('mainPromotion2Title', e.target.value)}
                    placeholder='최대 50자 입력 가능.'
                  />
                </div>
              </li>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>프로모션 문구 내용2</div>
                <div className='flex-1 min-w-64'>
                  <InfoInput
                    value={data.mainPromotion2Content || ''}
                    onChange={(e) =>
                      handleChangeInputValue('mainPromotion2Content', e.target.value)
                    }
                    placeholder='최대 50자 입력 가능.'
                  />
                </div>
              </li>
              <li className='pl-4 h-16 flex justify-between items-center gap-10 border-b'>
                <div className='flex-1 min-w-32'>포인트 컬러</div>
                <div className='flex-1 min-w-64'>
                  <ColorPalette data={themeColor} onDataChange={handleChangeThemeColor} />
                </div>
              </li>
            </ul>
          </div>
          <div className='w-1/2 min-w-fit px-10 flex justify-center items-center bg-gray-200'>
            <div className='relative min-w-[360px] w-[360px] max-w-[360px] min-h-[740px] h-[740px] max-h-[740px] bg-red-500'>
              <ShoppingMallPreview
                data={data}
                logoImg={logoImg}
                promotionImg={promotionImg}
                themeColor={themeColor}
                serviceType={serviceType}
              />
            </div>
          </div>
        </div>
      </section>
      <FooterComponent
        btn1={{ label: '취소', event: handleRestoreData }}
        btn2={{ label: '변경사항 적용', event: handleSaveData }}
      />
    </div>
  );
};

export default DisplaySettingComponent;
