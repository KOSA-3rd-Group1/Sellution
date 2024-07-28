import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { EditIcon } from '@/client/utility/assets/Icons.jsx';
import FooterComponent from '@/client/layout/partials/FooterComponent';
import ImageUploader2 from '@/client/layout/common/ImageUploader2';

const DetailComponent = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // URL에서 fromPage 파라미터를 가져옵니다.
  const searchParams = new URLSearchParams(location.search);
  const fromPage = searchParams.get('fromPage') || '1';

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productDetailImages, setProductDetailImages] = useState([]);
  const [productDetailImageNames, setProductDetailImageNames] = useState([]);
  const [selectedThumbnailImage, setSelectedThumbnailImage] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const detailImageInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const DisplayStatus = { VISIBLE: 'Y', INVISIBLE: 'N' };
  const DeliveryType = { ONETIME: 'ONETIME', SUBSCRIPTION: 'SUBSCRIPTION', BOTH: 'BOTH' };

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

    if (['stock', 'cost', 'discountRate'].includes(name)) {
      parsedValue = value === '' ? 0 : parseInt(value, 10);
    }

    if (name === 'isDiscount') {
      setIsDiscountApplied(value === DisplayStatus.VISIBLE);
      parsedValue = value === 'Y' ? DisplayStatus.VISIBLE : DisplayStatus.INVISIBLE;
    }

    if (name === 'deliveryType') {
      parsedValue = Object.values(DeliveryType).includes(value) ? value : '';
    }

    setProductInfo((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const deleteProduct = async () => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/products/${productId}`);
        alert('상품이 성공적으로 삭제되었습니다.');
        navigate('/product');
      } catch (error) {
        console.error('상품 삭제 중 오류 발생:', error);
        alert('상품 삭제에 실패했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const updateProduct = async () => {
    try {
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

      formData.append(
        'product',
        new Blob([JSON.stringify(jsonData)], { type: 'application/json' }),
      );

      if (selectedThumbnailImage) {
        formData.append('thumbnailImage', dataURItoBlob(selectedThumbnailImage), 'thumbnail.jpg');
      }

      productImages.forEach((image, index) => {
        if (image) {
          formData.append('listImages', dataURItoBlob(image), `list_${index}.jpg`);
        }
      });

      productDetailImages.forEach((image, index) => {
        formData.append('detailImages', dataURItoBlob(image), `detail_${index}.jpg`);
      });

      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/products/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('상품 정보가 성공적으로 업데이트되었습니다.');
      navigate(`/product?page=${fromPage}`);
    } catch (error) {
      console.error('상품 업데이트 중 오류 발생:', error);
      alert('상품 정보 업데이트에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories?size=100`);
        setCategories(Array.isArray(response.data.content) ? response.data.content : []);
      } catch (error) {
        console.error('There was an error fetching the categories!', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryName, categoryId) => {
    setProductInfo((prev) => ({
      ...prev,
      categoryName,
      categoryId,
    }));
    setIsCategoryDropdownOpen(false);
  };

  const handleThumbnailImageChange = (images) => setSelectedThumbnailImage(images[0]);

  const handleProductImagesChange = (images) => setProductImages(images);

  const handleDetailImagesChange = (images) => {
    setProductDetailImages(images);
    setProductDetailImageNames(images.map((_, index) => `상품 설명 이미지 ${index + 1}`));
  };

  const handleUploadSuccess = (newImages) => console.log('Uploaded images:', newImages);

  const handleBeforeRemove = (image, index) => window.confirm(`이미지를 제거하시겠습니까?`);

  const handleEditImage = (updatedImage, index) => window.confirm(`이미지를 변경하시겠습니까?`);

  const moveList = () => {
    navigate(`/product?page=${fromPage}`);
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/products/${productId}`,
        );
        const product = response.data;

        setProductInfo({
          name: product.name,
          categoryName: product.categoryName,
          productInformation: product.productInformation,
          cost: product.cost,
          isDiscount: product.isDiscount,
          discountRate: product.discountRate,
          discountedPrice: product.discountedPrice,
          discountStartDate: product.discountStartDate
            ? product.discountStartDate.split('T')[0]
            : '',
          discountEndDate: product.discountEndDate ? product.discountEndDate.split('T')[0] : '',
          deliveryType: product.deliveryType,
          stock: product.stock,
          isVisible: product.isVisible,
        });

        setProductDetailImages(
          product.detailImages.map((url, index) => ({
            id: `detail-${index}`,
            preview: url,
            file: null,
          })),
        );
        setSelectedThumbnailImage(
          product.thumbnailImage
            ? [{ id: 'thumbnail', preview: product.thumbnailImage, file: null }]
            : null,
        );
        setProductImages(
          product.listImages.map((url, index) => ({
            id: `list-${index}`,
            preview: url,
            file: null,
          })),
        );

        setIsDiscountApplied(product.isDiscount === DisplayStatus.VISIBLE);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching product data:', err);
        setError('상품 정보를 불러오는 데 실패했습니다.');
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  useEffect(() => {
    if (productInfo.isDiscount === 'Y') {
      const discountedPrice =
        productInfo.cost - (productInfo.cost * productInfo.discountRate) / 100;
      setProductInfo((prev) => ({ ...prev, discountedPrice }));
    }
  }, [productInfo.cost, productInfo.discountRate, productInfo.isDiscount]);

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className='relative w-full h-full flex flex-col'>
      <div className='flex-grow overflow-y-auto pb-[58px]'>
        <section className='p-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='p-4 rounded bg-white shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>상품 정보</h2>
              <hr className='border-t-2 border-gray-300 mb-4' />
              <div className='space-y-6'>
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
                    initialImages={productDetailImages}
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
                  <div className='flex-1 ml-4'>
                    <input
                      type='text'
                      name='cost'
                      value={productInfo.cost}
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
                    <label className='flex items-center ml-4'>
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
                <div className='flex items-center'>
                  <label className='w-1/4 text-sm font-medium'>기간 설정</label>
                  <div className='flex-1 flex items-center space-x-2 ml-4'>
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
                <div className='flex items-center'>
                  <label className='w-1/4 text-sm font-medium'>할인율</label>
                  <div className='flex-1 flex items-center ml-4'>
                    <input
                      type='text'
                      name='discountRate'
                      value={productInfo.discountRate}
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
                  <div className='flex-1 ml-4'>
                    <span>
                      {productInfo.isDiscount === DisplayStatus.VISIBLE
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
                <div className='flex items-center'>
                  <label className='w-1/4 text-sm font-medium'>재고</label>
                  <div className='flex-1 flex items-center ml-4'>
                    <input
                      type='text'
                      name='stock'
                      value={productInfo.stock}
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
      </div>
      <FooterComponent
        btn1={{ label: '취소', event: deleteProduct }}
        btn2={{ label: '변경 사항 저장', event: updateProduct }}
        back={{ label: '목록으로', event: moveList }}
      />
    </div>
  );
};

export default DetailComponent;
