import React, { useState, useCallback } from 'react';
import { EditIcon } from '@/client/utility/assets/Icons.jsx';
import FooterComponent from '@/client/layout/partials/FooterComponent';
import ImageUploader2 from '@/client/layout/common/ImageUploader2';
import useProductDetail from '@/client/business/product/useProductDetail';
import AlertModal from '@/client/layout/common/modal/AlertModal';
import RadioButtonGroup from '@/client/layout/common/RadioButtonGroup';

const DetailComponent = () => {
  const {
    productInfo,
    productDetailImages,
    productDetailImageNames,
    selectedThumbnailImage,
    productImages,
    isDiscountApplied,
    categories,
    isCategoryDropdownOpen,
    isLoading,
    error,
    handleInputChange,
    deleteProduct,
    updateProduct,
    handleCategorySelect,
    handleThumbnailImageChange,
    handleProductImagesChange,
    handleDetailImagesChange,
    handleUploadSuccess,
    handleBeforeRemove,
    handleEditImage,
    moveList,
    setIsCategoryDropdownOpen,
    DisplayStatus,
    DeliveryType,
    formatPrice,
    parsePrice,
    calculateDiscountedPrice,
    getTodayDate,
    refreshProductData,
    MAX_VALUE,
  } = useProductDetail();

  const [alertModal, setAlertModal] = useState({ isOpen: false, type: '', title: '', message: '' });
  const [isDeleteSuccessful, setIsDeleteSuccessful] = useState(false);

  const openAlertModal = (type, title, message) => {
    setAlertModal({ isOpen: true, type, title, message });
  };

  const closeAlertModal = () => {
    setAlertModal({ isOpen: false, type: '', title: '', message: '' });
  };

  const handleSaveChanges = useCallback(() => {
    openAlertModal(
      'warning',
      '변경 사항 저장',
      '변경 사항을 저장하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    );
  }, [openAlertModal]);

  const handleDeleteProduct = useCallback(() => {
    openAlertModal(
      'warning',
      '상품 삭제',
      '정말로 이 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    );
  }, [openAlertModal]);

  const handleConfirmSave = useCallback(async () => {
    closeAlertModal();
    try {
      await updateProduct();
      await refreshProductData();
      openAlertModal('success', '저장 완료', '변경 사항이 성공적으로 저장되었습니다.');
      moveList();
    } catch (error) {
      openAlertModal('error', '저장 실패', '변경 사항 저장 중 오류가 발생했습니다.');
    }
  }, [closeAlertModal, updateProduct, refreshProductData, openAlertModal]);

  const handleConfirmDelete = useCallback(async () => {
    closeAlertModal();
    try {
      await deleteProduct();
      console.log('Product deleted successfully');
      setIsDeleteSuccessful(true);
      openAlertModal('success', '삭제 완료', '상품이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting product:', error);
      openAlertModal('error', '삭제 실패', '상품 삭제 중 오류가 발생했습니다.');
    }
  }, [closeAlertModal, deleteProduct, openAlertModal, setIsDeleteSuccessful]);

  const handleAlertConfirm = useCallback(() => {
    if (alertModal.type === 'warning') {
      if (alertModal.title === '변경 사항 저장') {
        handleConfirmSave();
      } else if (alertModal.title === '상품 삭제') {
        handleConfirmDelete();
      }
    } else if (alertModal.type === 'success') {
      if (alertModal.title === '삭제 완료') {
        moveList();
      }
    }
    closeAlertModal();
  }, [
    alertModal.type,
    alertModal.title,
    handleConfirmSave,
    handleConfirmDelete,
    closeAlertModal,
    moveList,
  ]);

  const handleRadioChange = (name, value) => {
    handleInputChange({ target: { name, value } });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='relative w-full h-full flex flex-col'>
      <div className='flex-grow overflow-y-auto pb-[58px]'>
        <section className='p-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* 상품 정보 섹션 */}
            <div className='p-4 rounded bg-white shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>상품 정보</h2>
              <hr className='border-t-2 border-gray-300 mb-4' />
              <div className='space-y-6'>
                {/* 상품명 입력 필드 */}
                <div className='flex items-center'>
                  <label className='w-1/4 text-sm font-medium'>상품명</label>
                  <div className='flex-1 ml-4'>
                    <input
                      type='text'
                      name='name'
                      value={productInfo.name}
                      onChange={handleInputChange}
                      className='w-full border p-2 rounded-md'
                      placeholder='상품명을 입력해주세요'
                    />
                  </div>
                </div>
                <hr className='border-gray-200' />
                {/* 카테고리 선택 */}
                <div className='flex items-center'>
                  <label className='w-1/4 text-sm font-medium'>카테고리</label>
                  <div className='flex-1 ml-4 relative'>
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
                              onClick={() =>
                                handleCategorySelect(category.name, category.categoryId)
                              }
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
                {/* 상품 설명 문구 */}
                <div className='flex'>
                  <label className='w-1/4 text-sm font-medium pt-2'>상품 설명 문구</label>
                  <div className='flex-1 ml-4'>
                    <textarea
                      name='productInformation'
                      value={productInfo.productInformation}
                      onChange={handleInputChange}
                      className='w-full border p-2 rounded-md h-24'
                      placeholder='최대 50자 입력 가능'
                    />
                  </div>
                </div>
                <hr className='border-gray-200' />
                {/* 상품 설명 이미지 */}
                <div>
                  <label className='w-1/4 text-sm font-medium pt-2'>상품 설명 이미지</label>
                  <div className='flex items-start'>
                    <div className='flex-1'>
                      <ImageUploader2
                        inputId={'file-upload-detail'}
                        onUploadSuccess={handleUploadSuccess}
                        onBeforeRemove={handleBeforeRemove}
                        onEditImage={handleEditImage}
                        onDataChange={handleDetailImagesChange}
                        isMultiImage={true}
                        maxImageCount={5}
                        containerHeight={'h-30'}
                        previewSize={'w-28 h-28'}
                        multiple
                        initialImages={productDetailImages}
                      />
                      {productDetailImageNames.length > 0 && (
                        <div className='mt-2 text-sm text-gray-600'>
                          {productDetailImageNames.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 상품 이미지 섹션 */}
            <div className='p-4 rounded bg-white shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>상품 이미지</h2>
              <hr className='border-t-2 border-gray-300 mb-4' />
              <div className='space-y-6'>
                <div>
                  <h3 className='text-sm font-medium mb-2'>상품 대표 이미지</h3>
                  <ImageUploader2
                    inputId={'file-upload-logo'}
                    onUploadSuccess={handleUploadSuccess}
                    onBeforeRemove={handleBeforeRemove}
                    onEditImage={handleEditImage}
                    onDataChange={handleThumbnailImageChange}
                    isMultiImage={false}
                    maxImageCount={1}
                    containerHeight={'h-30'}
                    previewSize={'w-28 h-28'}
                    initialImages={selectedThumbnailImage}
                  />
                </div>
                <hr />
                <div>
                  <h3 className='text-sm font-medium mb-2'>상품 이미지</h3>
                  <ImageUploader2
                    inputId={'product-images'}
                    onUploadSuccess={handleUploadSuccess}
                    onBeforeRemove={handleBeforeRemove}
                    onEditImage={handleEditImage}
                    onDataChange={handleProductImagesChange}
                    isMultiImage={true}
                    maxImageCount={5}
                    containerHeight={'h-30'}
                    previewSize={'w-28 h-28'}
                    multiple
                    initialImages={productImages}
                  />
                </div>
              </div>
            </div>

            {/* 금액 정보 섹션 */}
            <div className='p-4 rounded bg-white shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>금액 정보</h2>
              <hr className='border-t-2 border-gray-300 mb-4' />
              <div className='space-y-6'>
                {/* 금액 입력 필드 */}
                <div className='flex items-center'>
                  <label className='w-1/4 text-sm font-medium'>금액</label>
                  <div className='flex-1 ml-4 text-right'>
                    <input
                      type='text'
                      name='cost'
                      value={formatPrice(productInfo.cost)}
                      onChange={handleInputChange}
                      className='flex-grow border p-2 rounded-md text-right'
                      placeholder='금액을 입력해주세요.'
                    />
                    <span className='ml-2'>원</span>
                  </div>
                </div>
                <hr className='border-gray-200' />
                {/* 할인 적용 여부 */}
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
                  <div className='flex-1 flex items-center justify-end space-x-2'>
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
                {/* 할인율 입력 */}
                <div className='flex items-center'>
                  <label className='w-1/4 text-sm font-medium'>할인율</label>
                  <div className='flex-1 ml-4 text-right'>
                    <input
                      type='text'
                      name='discountRate'
                      value={productInfo.discountRate}
                      onChange={handleInputChange}
                      className='flex-grow border p-2 rounded-md text-right'
                      placeholder='할인율을 입력해주세요. '
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
                    <span className='items-right'>
                      {productInfo.isDiscount === DisplayStatus.VISIBLE
                        ? `${formatPrice(calculateDiscountedPrice(productInfo.cost, productInfo.discountRate))} 원`
                        : '- 원'}
                    </span>
                  </div>
                </div>
                <hr className='border-gray-200' />
              </div>
            </div>

            {/* 판매 정보 섹션 */}
            <div className='p-4 rounded bg-white shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>판매 정보</h2>
              <hr className='border-t-2 border-gray-300 mb-4' />
              <div className='space-y-6'>
                {/* 배송 가능 유형 */}
                <div className='flex items-center'>
                  <label className='w-1/4 text-sm font-medium items-center'>배송 가능 유형</label>
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
                {/* 재고 입력 */}
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
                <hr className='border-gray-200' />
              </div>
            </div>
          </div>
        </section>
      </div>
      <FooterComponent
        btn1={{ label: '상품 삭제', event: handleDeleteProduct }}
        btn2={{ label: '변경 사항 저장', event: handleSaveChanges }}
        back={{ label: '목록으로', event: moveList }}
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

export default DetailComponent;
