import React from 'react';
import { useState, useCallback } from 'react';
import { EditIcon } from '@/client/utility/assets/Icons.jsx';
import FooterComponent from '@/client/layout/partials/FooterComponent';
import ImageUploader2 from '@/client/layout/common/ImageUploader2';
import useProductAdd from '@/client/business/product/useProductAdd';
import AlertModal from '@/client/layout/common/modal/AlertModal';
import RadioButtonGroup from '@/client/layout/common/RadioButtonGroup';

const AddComponent = () => {
  const {
    productInfo,
    images,
    categories,
    isCategoryDropdownOpen,
    isDiscountApplied,
    DisplayStatus,
    DeliveryType,
    handleInputChange,
    handleCategorySelect,
    handleImageChange,
    handleUploadSuccess,
    handleBeforeRemove,
    handleEditImage,
    moveList,
    registerProduct,
    setIsCategoryDropdownOpen,
    formatPrice,
    parsePrice,
    calculateDiscountedPrice,
    getTodayDate,
    MAX_VALUE,
  } = useProductAdd();

  const [alertModal, setAlertModal] = useState({ isOpen: false, type: '', title: '', message: '' });

  const openAlertModal = useCallback((type, title, message) => {
    setAlertModal({ isOpen: true, type, title, message });
  }, []);

  const closeAlertModal = useCallback(() => {
    setAlertModal({ isOpen: false, type: '', title: '', message: '' });
  }, []);

  const handleRegisterProduct = useCallback(() => {
    if (!validateProductInfo()) {
      openAlertModal('error', '입력 오류', '모든 필수 정보를 입력해주세요.');
      return;
    }
    openAlertModal('warning', '상품 등록 확인', '상품을 등록하시겠습니까?');
  }, [openAlertModal, productInfo, images]);

  // const resetComponent = useCallback(() => {
  //   window.location.reload();
  // }, []);

  const validateProductInfo = () => {
    const requiredFields = [
      'name',
      'categoryName',
      'productInformation',
      'cost',
      'deliveryType',
      'stock',
    ];

    for (const field of requiredFields) {
      if (!productInfo[field]) {
        return false;
      }
    }

    if (!images.thumbnail || images.product.length === 0 || images.detail.length === 0) {
      return false;
    }

    if (productInfo.isDiscount === DisplayStatus.VISIBLE) {
      if (
        !productInfo.discountRate ||
        !productInfo.discountStartDate ||
        !productInfo.discountEndDate
      ) {
        return false;
      }
    }

    return true;
  };

  const handleRadioChange = (name, value) => {
    handleInputChange({ target: { name, value } });
  };

  const handleAlertConfirm = useCallback(async () => {
    if (alertModal.type === 'warning') {
      try {
        await registerProduct();
        openAlertModal('success', '상품 등록 완료', '상품이 성공적으로 등록되었습니다.');
      } catch (error) {
        openAlertModal('error', '상품 등록 실패', '상품 등록 중 오류가 발생했습니다.');
      }
    } else if (alertModal.type === 'success') {
      closeAlertModal();
      moveList();
    } else {
      closeAlertModal();
    }
  }, [alertModal.type, registerProduct, openAlertModal, closeAlertModal, moveList]);

  return (
    <div className='relative w-full h-full flex flex-col'>
      <section className='flex-grow overflow-y-auto pb-[58px]'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* 상품 정보 */}
          <div className='p-4 rounded bg-white shadow-md'>
            <h2 className='text-xl font-semibold mb-4'>상품 정보</h2>
            <hr className='border-t-2 border-gray-300 mb-4' />
            <div className='space-y-6'>
              {/* 상품명 */}
              <div className='flex items-center'>
                <label className='w-1/4 text-sm font-medium'>상품명</label>
                <div className='flex-1 ml-32'>
                  <input
                    type='text'
                    name='name'
                    onChange={handleInputChange}
                    className='w-full border p-2 rounded-md'
                    placeholder='상품명을 입력해주세요'
                  />
                </div>
              </div>
              <hr className='border-gray-200' />
              {/* 카테고리 */}
              <div className='flex items-center'>
                <label className='w-1/4 text-sm font-medium'>카테고리</label>
                <div className='flex-1 ml-32 relative'>
                  <div
                    className='w-full border p-2 rounded-md flex justify-between items-center cursor-pointer'
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  >
                    <span>{productInfo.categoryName || '카테고리 선택'}</span>
                    <EditIcon className='h-5 w-5 text-gray-400' />
                  </div>
                  {isCategoryDropdownOpen && (
                    <div className='absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <div
                            key={category.categoryId}
                            className='p-2 hover:bg-gray-100 cursor-pointer'
                            onClick={() => handleCategorySelect(category.name, category.categoryId)}
                          >
                            {category.name}
                          </div>
                        ))
                      ) : (
                        <div className='p-2 text-gray-500'>카테고리가 없습니다.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <hr className='border-gray-200' />
              {/* 상품 설명 */}
              <div className='flex'>
                <label className='w-1/4 text-sm font-medium pt-2'>상품 설명 문구</label>
                <div className='flex-1 ml-32'>
                  <textarea
                    name='productInformation'
                    onChange={handleInputChange}
                    className='w-full border p-2 rounded-md h-24'
                    placeholder='최대 50자 입력 가능'
                  />
                </div>
              </div>
              <hr className='border-gray-200' />
              {/* 상품 상세 이미지 */}
              <div className='flex flex-col space-y-2'>
                <label className='text-sm font-medium'>상품 설명 이미지</label>
                <div className='w-full'>
                  <ImageUploader2
                    inputId={'file-upload-detail'}
                    onUploadSuccess={handleUploadSuccess}
                    onBeforeRemove={handleBeforeRemove}
                    onEditImage={handleEditImage}
                    onDataChange={handleImageChange('detail')}
                    isMultiImage={true}
                    maxImageCount={5}
                    containerHeight={'min-h-[120px]'}
                    previewSize={'w-28 h-28'}
                    multiple
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 상품 이미지 */}
          <div className='p-4 rounded bg-white shadow-md'>
            <h2 className='text-xl font-semibold mb-4'>상품 이미지</h2>
            <hr className='border-t-2 border-gray-300 mb-4' />
            <div className='space-y-6'>
              {/* 썸네일 이미지 */}
              <div>
                <h3 className='text-sm font-medium mb-2'>상품 대표 이미지</h3>
                <ImageUploader2
                  inputId={'file-upload-thumbnail'}
                  onUploadSuccess={handleUploadSuccess}
                  onBeforeRemove={handleBeforeRemove}
                  onEditImage={handleEditImage}
                  onDataChange={handleImageChange('thumbnail')}
                  isMultiImage={false}
                  maxImageCount={1}
                  containerHeight={'h-30'}
                  previewSize={'w-28 h-28'}
                />
              </div>
              <hr />
              {/* 상품 이미지 */}
              <div>
                <h3 className='text-sm font-medium mb-2'>상품 이미지</h3>
                <ImageUploader2
                  inputId={'product-images'}
                  onUploadSuccess={handleUploadSuccess}
                  onBeforeRemove={handleBeforeRemove}
                  onEditImage={handleEditImage}
                  onDataChange={handleImageChange('product')}
                  isMultiImage={true}
                  maxImageCount={5}
                  containerHeight={'h-30'}
                  previewSize={'w-28 h-28'}
                  multiple
                />
              </div>
            </div>
          </div>

          {/* 가격 정보 */}
          <div className='p-4 rounded bg-white shadow-md'>
            <h2 className='text-xl font-semibold mb-4'>금액 정보</h2>
            <hr className='border-t-2 border-gray-300 mb-4' />
            <div className='space-y-6'>
              {/* 가격 */}
              <div className='flex items-center'>
                <label className='w-1/4 text-sm font-medium'>금액</label>
                <div className='flex-1 flex items-center justify-end ml-4'>
                  <input
                    type='text'
                    name='cost'
                    value={productInfo.cost}
                    onChange={handleInputChange}
                    className='w-full max-w-xs border p-2 rounded-md text-right'
                    placeholder='금액을 입력해주세요.'
                  />
                  <span className='ml-2'>원</span>
                </div>
              </div>
              <hr className='border-gray-200' />
              <div className='flex items-center'>
                <label className='w-1/4 text-sm font-medium'>할인 적용 여부</label>
                <RadioButtonGroup
                  className='flex-1 flex items-center justify-end space-x-4 ml-4'
                  data={productInfo}
                  options={[
                    { selectData: DisplayStatus.VISIBLE, label: '적용' },
                    { selectData: DisplayStatus.INVISIBLE, label: '미적용' },
                  ]}
                  name='isDiscount'
                  onChange={handleRadioChange}
                />
              </div>
              <hr className='border-gray-200' />
              {/* 할인 기간 설정 */}
              <div className='flex items-center'>
                <label className='w-1/4 text-sm font-medium'>기간 설정</label>
                <div className='flex-1 flex items-center justify-end space-x-2 ml-4'>
                  <input
                    type='date'
                    name='discountStartDate'
                    value={productInfo.discountStartDate}
                    onChange={handleInputChange}
                    className='border p-2 rounded-md'
                    disabled={!isDiscountApplied}
                    min={getTodayDate()}
                  />
                  <span>-</span>
                  <input
                    type='date'
                    name='discountEndDate'
                    value={productInfo.discountEndDate}
                    onChange={handleInputChange}
                    className='border p-2 rounded-md'
                    disabled={!isDiscountApplied}
                    min={productInfo.discountStartDate || getTodayDate()}
                  />
                </div>
              </div>
              <hr className='border-gray-200' />
              {/* 할인율 */}
              <div className='flex items-center'>
                <label className='w-1/4 text-sm font-medium'>할인율</label>
                <div className='flex-1 flex items-center justify-end ml-4'>
                  <input
                    type='text'
                    name='discountRate'
                    value={productInfo.discountRate}
                    onChange={handleInputChange}
                    className='w-full max-w-xs border p-2 rounded-md text-right'
                    placeholder='할인율을 입력해주세요.'
                    disabled={!isDiscountApplied}
                  />
                  <span className='ml-2'>%</span>
                </div>
              </div>
              <hr className='border-gray-200' />
              {/* 할인 후 적용 금액 */}
              <div className='flex items-center'>
                <label className='w-1/4 text-sm font-medium'>할인 후 적용 금액</label>
                <div className='flex-1 flex justify-end ml-4'>
                  <span>
                    {productInfo.isDiscount === DisplayStatus.VISIBLE
                      ? `${formatPrice(calculateDiscountedPrice(parsePrice(productInfo.cost), productInfo.discountRate))} 원`
                      : '- 원'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 판매 정보 */}
          <div className='p-4 rounded bg-white shadow-md'>
            <h2 className='text-xl font-semibold mb-4'>판매 정보</h2>
            <hr className='border-t-2 border-gray-300 mb-4' />
            <div className='space-y-6'>
              {/* 배송 가능 유형 */}
              <div className='flex items-center'>
                <label className='w-1/4 text-sm font-medium'>배송 가능 유형</label>
                <RadioButtonGroup
                  className='flex-1 flex items-center space-x-4 justify-end'
                  data={productInfo}
                  options={[
                    { selectData: DeliveryType.ONETIME, label: '단건 배송' },
                    { selectData: DeliveryType.SUBSCRIPTION, label: '정기 배송' },
                    { selectData: DeliveryType.BOTH, label: '단건 + 정기 배송' },
                  ]}
                  name='deliveryType'
                  onChange={handleRadioChange}
                />
              </div>
              <hr className='border-gray-200' />
              {/* 재고 */}
              <div className='flex items-center'>
                <label className='w-1/4 text-sm font-medium'>재고</label>
                <div className='flex-1 flex items-center justify-end ml-4'>
                  <input
                    type='text'
                    name='stock'
                    value={productInfo.stock}
                    onChange={handleInputChange}
                    className='w-full max-w-xs border p-2 rounded-md text-right'
                    placeholder='상품 재고를 입력해주세요.'
                  />
                  <span className='ml-2'>건</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterComponent
        btn1={{ label: '취소', event: moveList }}
        btn2={{ label: '상품 등록', event: handleRegisterProduct }}
      />

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlertModal}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        onConfirm={handleAlertConfirm}
      />
    </div>
  );
};

export default AddComponent;
