import React from 'react';
import { useState, useCallback } from 'react';
import { EditIcon } from '@/client/utility/assets/Icons.jsx';
import FooterComponent from '@/client/layout/partials/FooterComponent';
import ImageUploader2 from '@/client/layout/common/ImageUploader2';
import useProductAdd from '@/client/business/product/useProductAdd';
import AlertModal from '@/client/layout/common/modal/AlertModal';

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
  } = useProductAdd();

  const [alertModal, setAlertModal] = useState({ isOpen: false, type: '', title: '', message: '' });

  const openAlertModal = useCallback((type, title, message) => {
    setAlertModal({ isOpen: true, type, title, message });
  }, []);

  const closeAlertModal = useCallback(() => {
    setAlertModal({ isOpen: false, type: '', title: '', message: '' });
  }, []);

  const handleRegisterProduct = useCallback(() => {
    openAlertModal('warning', '상품 등록 확인', '상품을 등록하시겠습니까?');
  }, [openAlertModal]);

  const resetComponent = useCallback(() => {
    // Reset all state here
    // This is a placeholder - you need to implement the actual reset logic
    window.location.reload();
  }, []);

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
      resetComponent();
    } else {
      closeAlertModal();
    }
  }, [alertModal.type, registerProduct, openAlertModal, closeAlertModal, resetComponent]);

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
                <div className='flex-1 flex items-center justify-end space-x-4 ml-4'>
                  <label className='flex items-center'>
                    <input
                      type='radio'
                      name='isDiscount'
                      value={DisplayStatus.VISIBLE}
                      checked={productInfo.isDiscount === DisplayStatus.VISIBLE}
                      onChange={handleInputChange}
                      className='mr-2'
                    />
                    <span>적용</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='radio'
                      name='isDiscount'
                      value={DisplayStatus.INVISIBLE}
                      checked={productInfo.isDiscount === DisplayStatus.INVISIBLE}
                      onChange={handleInputChange}
                      className='mr-2'
                    />
                    <span>미적용</span>
                  </label>
                </div>
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
                  />
                  <span>-</span>
                  <input
                    type='date'
                    name='discountEndDate'
                    value={productInfo.discountEndDate}
                    onChange={handleInputChange}
                    className='border p-2 rounded-md'
                    disabled={!isDiscountApplied}
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
                      ? formatPrice(
                          productInfo.cost - (productInfo.cost * productInfo.discountRate) / 100,
                        )
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
                <div className='flex-1 flex items-center space-x-4 justify-end'>
                  <label className='flex items-center ml-4'>
                    <input
                      type='radio'
                      name='deliveryType'
                      value={DeliveryType.ONETIME}
                      checked={productInfo.deliveryType === DeliveryType.ONETIME}
                      onChange={handleInputChange}
                      className='mr-2'
                    />
                    <span>단건 배송</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='radio'
                      name='deliveryType'
                      value={DeliveryType.SUBSCRIPTION}
                      checked={productInfo.deliveryType === DeliveryType.SUBSCRIPTION}
                      onChange={handleInputChange}
                      className='mr-2'
                    />
                    <span>정기 배송</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='radio'
                      name='deliveryType'
                      value={DeliveryType.BOTH}
                      checked={productInfo.deliveryType === DeliveryType.BOTH}
                      onChange={handleInputChange}
                      className='mr-2'
                    />
                    <span>단건 + 정기 배송</span>
                  </label>
                </div>
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
        onClose={alertModal.type === 'success' ? resetComponent : closeAlertModal}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        onConfirm={handleAlertConfirm}
      />
    </div>
  );
};

export default AddComponent;
