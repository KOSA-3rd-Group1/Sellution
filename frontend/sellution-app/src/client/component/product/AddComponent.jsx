import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditIcon } from '@/client/utility/assets/Icons.jsx';
import FooterComponent from '@/client/layout/partials/FooterComponent';
import ImageUploader2 from '@/client/layout/common/ImageUploader2';

const AddComponent = () => {
  const navigate = useNavigate();

  // 상수
  const DisplayStatus = { VISIBLE: 'Y', INVISIBLE: 'N' };
  const DeliveryType = { ONETIME: 'ONETIME', SUBSCRIPTION: 'SUBSCRIPTION', BOTH: 'BOTH' };

  // 상태
  const [productInfo, setProductInfo] = useState({
    name: '',
    categoryName: '',
    productInformation: '',
    cost: 0,
    isDiscount: DisplayStatus.INVISIBLE,
    discountRate: 0,
    discountedPrice: 0,
    discountStartDate: '',
    discountEndDate: '',
    deliveryType: '',
    stock: 0,
    isVisible: DisplayStatus.VISIBLE,
  });

  const [images, setImages] = useState({
    thumbnail: null,
    product: [],
    detail: [],
  });

  const [categories, setCategories] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  // 카테고리와 회사 정보 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories?size=100`);
        const data = await response.json();
        if (data && Array.isArray(data.content)) {
          setCategories(data.content);
        } else {
          console.error('카테고리 응답 형식이 예상과 다릅니다');
          setCategories([]);
        }
      } catch (error) {
        console.error('카테고리를 가져오는 중 오류가 발생했습니다!', error);
        setCategories([]);
      }
    };

    const getCompanyInfo = () => {
      const shopCompanyStorage = localStorage.getItem('shop-company-storage');
      if (shopCompanyStorage) {
        const { state } = JSON.parse(shopCompanyStorage);
        if (state && state.companyId) {
          setCompanyId(state.companyId);
        }
      }
    };

    fetchCategories();
    getCompanyInfo();
  }, []);

  // 할인가 계산
  useEffect(() => {
    if (productInfo.isDiscount === DisplayStatus.VISIBLE) {
      const discountedPrice =
        productInfo.cost - (productInfo.cost * productInfo.discountRate) / 100;
      setProductInfo((prev) => ({ ...prev, discountedPrice }));
    }
  }, [productInfo.cost, productInfo.discountRate, productInfo.isDiscount]);

  // 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    if (['stock', 'cost', 'discountRate'].includes(name)) {
      parsedValue = value === '' ? 0 : parseInt(value, 10);
    }

    if (name === 'isDiscount') {
      setIsDiscountApplied(value === DisplayStatus.VISIBLE);
      parsedValue =
        value === DisplayStatus.VISIBLE ? DisplayStatus.VISIBLE : DisplayStatus.INVISIBLE;
    }

    if (name === 'deliveryType') {
      parsedValue = Object.values(DeliveryType).includes(value) ? value : '';
    }

    setProductInfo((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleCategorySelect = (categoryName, categoryId) => {
    setProductInfo((prev) => ({ ...prev, categoryName, categoryId }));
    setIsCategoryDropdownOpen(false);
  };

  const handleImageChange = (type) => (newImages) => {
    setImages((prev) => ({ ...prev, [type]: newImages }));
  };

  const handleUploadSuccess = (newImages) => {
    console.log('업로드된 이미지:', newImages);
  };

  const handleBeforeRemove = () => window.confirm('이미지를 제거하시겠습니까?');

  const handleEditImage = () => window.confirm('이미지를 변경하시겠습니까?');

  const moveList = () => navigate('/product');

  const registerProduct = async () => {
    if (!companyId) {
      console.error('Company ID를 찾을 수 없습니다');
      return;
    }

    const formData = new FormData();

    const jsonData = {
      companyId: companyId,
      ...productInfo,
      discountStartDate: productInfo.discountStartDate
        ? `${productInfo.discountStartDate}T00:00:00`
        : null,
      discountEndDate: productInfo.discountEndDate
        ? `${productInfo.discountEndDate}T23:59:59`
        : null,
    };

    formData.append('product', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));

    if (images.thumbnail && images.thumbnail[0] && images.thumbnail[0].file) {
      formData.append('thumbnailImage', images.thumbnail[0].file, images.thumbnail[0].file.name);
    }

    images.product.forEach((image, index) => {
      if (image && image.file) {
        formData.append('listImages', image.file, image.file.name);
      }
    });

    images.detail.forEach((image, index) => {
      if (image && image.file) {
        formData.append('detailImages', image.file, image.file.name);
      }
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('상품이 성공적으로 등록되었습니다');
        moveList();
      } else {
        console.error('상품 등록에 실패했습니다');
      }
    } catch (error) {
      console.error('오류:', error);
    }
  };

  // 렌더링
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
                  inputId={'file-upload-logo'}
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
                    className='w-full max-w-xs border p-2 rounded-md'
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
                    className='w-full max-w-xs border p-2 rounded-md'
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
                      ? `${productInfo.discountedPrice} 원`
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
                    onChange={handleInputChange}
                    className='w-full max-w-xs border p-2 rounded-md'
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
        btn2={{ label: '상품 등록', event: registerProduct }}
      />
    </div>
  );
};

export default AddComponent;
