import React, { useState, useRef, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import { useNavigate } from 'react-router-dom';
import { EditIcon, TrashIcon } from '@/client/utility/assets/Icons.jsx';
import FooterComponent from '@/client/layout/partials/FooterComponent';
import ImageUploader2 from '@/client/layout/common/ImageUploader2';

const AddComponent = () => {
  // 상태 관리
  const [productDetailImages, setProductDetailImages] = useState([]);
  const [productDetailImageNames, setProductDetailImageNames] = useState([]);
  const [selectedThumbnailImage, setSelectedThumbnailImage] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const detailImageInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const DisplayStatus = {
    VISIBLE: 'Y',
    INVISIBLE: 'N',
  };

  const DeliveryType = {
    ONETIME: 'ONETIME',
    SUBSCRIPTION: 'SUBSCRIPTION',
    BOTH: 'BOTH',
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    if (name === 'stock' || name === 'cost' || name === 'discountRate') {
      parsedValue = value === '' ? 0 : parseInt(value, 10);
    }

    if (name === 'isDiscount') {
      setIsDiscountApplied(value === DisplayStatus.VISIBLE);
      parsedValue = value === 'Y' ? DisplayStatus.VISIBLE : DisplayStatus.INVISIBLE;
    }

    if (name === 'deliveryType') {
      switch (value) {
        case DeliveryType.ONETIME:
        case DeliveryType.SUBSCRIPTION:
        case DeliveryType.BOTH:
          parsedValue = value;
          break;
        default:
          parsedValue = '';
      }
    }

    setProductInfo((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/categories?size=100`)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.content)) {
          setCategories(data.content);
        } else {
          console.error('Unexpected response format for categories');
          setCategories([]);
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the categories!', error);
        setCategories([]);
      });
  }, []);

  const handleCategorySelect = (categoryName, categoryId) => {
    setProductInfo((prev) => ({
      ...prev,
      categoryName,
      categoryId,
    }));
    setIsCategoryDropdownOpen(false);
  };

  const handleThumbnailImageChange = (images) => {
    setSelectedThumbnailImage(images[0]);
  };

  const handleProductImagesChange = (images) => {
    setProductImages(images);
  };

  const handleDetailImagesChange = (images) => {
    setProductDetailImages(images);
    setProductDetailImageNames(images.map((_, index) => `상품 설명 이미지 ${index + 1}`));
  };

  const handleChangePromotionImg = (images) => {
    console.log('Current images:', images);
    setPromotionImg(images);
  };

  const handleChangeLogoImg = (images) => {
    console.log('Current images:', images);
    setLogoImg(images);
  };

  const handleChangeThemeColor = (color) => {
    console.log('theme clolr:', color);
    setThemeColor(color);
  };

  const handleUploadSuccess = (newImages) => {
    console.log('Uploaded images:', newImages);
  };

  const handleBeforeRemove = (image, index) => {
    return window.confirm(`이미지를 제거하시겠습니까?`);
  };

  const handleEditImage = (updatedImage, index) => {
    return window.confirm(`이미지를 변경하시겠습니까?`);
  };

  const handleSaveData = () => {
    alert('변경사항 적용');
  };

  const handleRestoreData = () => {};

  const moveList = () => {
    navigate({
      pathname: '/product',
    });
  };

  useEffect(() => {
    if (productInfo.isDiscount === 'Y') {
      const discountedPrice =
        productInfo.cost - (productInfo.cost * productInfo.discountRate) / 100;
      setProductInfo((prev) => ({ ...prev, discountedPrice }));
    }
  }, [productInfo.cost, productInfo.discountRate, productInfo.isDiscount]);

  const registerProduct = async () => {
    const formData = new FormData();

    const jsonData = {
      companyId: 1,
      name: productInfo.name,
      categoryName: productInfo.categoryName,
      productInformation: productInfo.productInformation,
      cost: productInfo.cost,
      isDiscount: productInfo.isDiscount,
      discountStartDate: productInfo.discountStartDate
        ? `${productInfo.discountStartDate}T00:00:00`
        : null,
      discountEndDate: productInfo.discountEndDate
        ? `${productInfo.discountEndDate}T23:59:59`
        : null,
      discountRate: productInfo.discountRate,
      deliveryType: productInfo.deliveryType,
      stock: productInfo.stock,
      isVisible: productInfo.isVisible,
    };

    formData.append('product', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));

    if (selectedThumbnailImage) {
      const thumbnailBlob = await dataURItoBlob(selectedThumbnailImage);
      formData.append('thumbnailImage', thumbnailBlob, 'thumbnail.jpg');
    }

    for (let i = 0; i < productImages.length; i++) {
      if (productImages[i]) {
        const imageBlob = await dataURItoBlob(productImages[i]);
        formData.append('listImages', imageBlob, `list_${i}.jpg`);
      }
    }

    for (let i = 0; i < productDetailImages.length; i++) {
      const imageBlob = await dataURItoBlob(productDetailImages[i]);
      formData.append('detailImages', imageBlob, `detail_${i}.jpg`);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Product registered successfully');
        moveList();
      } else {
        console.error('Failed to register product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  function dataURItoBlob(dataURI) {
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      const byteString = atob(dataURI.split(',')[1]);
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    }

    // URL인 경우 (예: blob:http://...)
    if (dataURI.startsWith('blob:') || dataURI.startsWith('http')) {
      return fetch(dataURI).then((res) => res.blob());
    }

    // 그 외의 경우, 빈 Blob 반환
    console.error('Unhandled dataURI format:', dataURI);
    return new Blob([], { type: 'application/octet-stream' });
  }

  return (
    <div className='relative w-full h-full flex flex-col'>
      <section className='flex-grow overflow-y-auto pb-[58px]'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='p-4 rounded bg-white shadow-md'>
            <h2 className='text-xl font-semibold mb-4'>상품 정보</h2>
            <hr className='border-t-2 border-gray-300 mb-4' />
            <div className='space-y-6'>
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
              <div className='flex flex-col space-y-2'>
                <label className='text-sm font-medium'>상품 설명 이미지</label>
                <div className='w-full'>
                  <ImageUploader2
                    inputId={'file-upload-detail'}
                    onUploadSuccess={handleUploadSuccess}
                    onBeforeRemove={handleBeforeRemove}
                    onEditImage={handleEditImage}
                    onDataChange={handleDetailImagesChange}
                    isMultiImage={true}
                    maxImageCount={5}
                    containerHeight={'min-h-[120px]'}
                    previewSize={'w-28 h-28'}
                    multiple
                  />
                  {productDetailImageNames && (
                    <div className='mt-2 text-sm text-gray-600'>
                      {productDetailImageNames.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

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
                  onDataChange={handleChangeLogoImg}
                  isMultiImage={false}
                  maxImageCount={1}
                  containerHeight={'h-30'}
                  previewSize={'w-28 h-28'}
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
                />
              </div>
            </div>
          </div>
          <div className='p-4 rounded bg-white shadow-md'>
            <h2 className='text-xl font-semibold mb-4'>금액 정보</h2>
            <hr className='border-t-2 border-gray-300 mb-4' />
            <div className='space-y-6'>
              <div className='flex items-center'>
                <label className='w-1/4 text-sm font-medium'>금액</label>
                <div className='flex-1 flex items-center ml-32'>
                  <input
                    type='text'
                    name='cost'
                    onChange={handleInputChange}
                    className='flex-grow border p-2 rounded-md'
                    placeholder='금액을 입력해주세요.'
                  />
                  <span className='ml-2'>원</span>
                </div>
              </div>
              <hr className='border-gray-200' />
              <div className='flex items-center'>
                <label className='w-1/4 text-sm font-medium'>할인 적용 여부</label>
                <div className='flex-1 flex items-center space-x-4'>
                  <label className='flex items-center ml-32'>
                    <input
                      type='radio'
                      name='isDiscount'
                      value={DisplayStatus.VISIBLE}
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
                      onChange={handleInputChange}
                      className='mr-2'
                    />
                    <span>미적용</span>
                  </label>
                </div>
              </div>
              <hr className='border-gray-200' />
              <div className='flex items-center'>
                <label className='w-1/4 text-sm font-medium'>기간 설정</label>
                <div className='flex-1 flex items-center space-x-2 ml-32'>
                  <input
                    type='date'
                    name='discountStartDate'
                    onChange={handleInputChange}
                    className='border p-2 rounded-md'
                    disabled={!isDiscountApplied}
                  />
                  <span>-</span>
                  <input
                    type='date'
                    name='discountEndDate'
                    onChange={handleInputChange}
                    className='border p-2 rounded-md'
                    disabled={!isDiscountApplied}
                  />
                </div>
              </div>
              <hr className='border-gray-200' />
              <div className='flex items-center'>
                <label className='w-1/4 text-sm font-medium'>할인율</label>
                <div className='flex-1 flex items-center ml-32'>
                  <input
                    type='text'
                    name='discountRate'
                    onChange={handleInputChange}
                    className='flex-grow border p-2 rounded-md'
                    placeholder='할인율을 입력해주세요.'
                    disabled={!isDiscountApplied}
                  />
                  <span className='ml-2'>%</span>
                </div>
              </div>
              <hr className='border-gray-200' />
              <div className='flex items-center'>
                <label className='w-1/4 text-sm font-medium'>할인 후 적용 금액</label>
                <div className='flex-1 ml-32'>
                  <span>
                    {productInfo.isDiscount === 'Y'
                      ? `${productInfo.cost - (productInfo.cost * productInfo.discountRate) / 100} 원`
                      : '- 원'}
                  </span>
                </div>
              </div>
              <hr className='border-gray-200' />
            </div>
          </div>

          <div className='p-4 rounded bg-white shadow-md'>
            <h2 className='text-xl font-semibold mb-4'>판매 정보</h2>
            <hr className='border-t-2 border-gray-300 mb-4' />
            <div className='space-y-6'>
              <div className='flex items-center'>
                <label className='w-1/4 text-sm font-medium'>배송 가능 유형</label>
                <div className='flex-1 flex items-center space-x-4'>
                  <label className='flex items-center ml-20'>
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
              <div className='flex items-center'>
                <label className='w-1/4 text-sm font-medium'>재고</label>
                <div className='flex-1 flex items-center ml-20'>
                  <input
                    type='text'
                    name='stock'
                    onChange={handleInputChange}
                    className='flex-grow border p-2 rounded-md'
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
      <FooterComponent
        btn1={{ label: '취소', event: moveList }}
        btn2={{ label: '상품 등록', event: registerProduct }}
      />
    </div>
  );
};

export default AddComponent;
