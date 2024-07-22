import React, { useState, useRef, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { EditIcon, TrashIcon } from '@/client/utility/assets/Icons.jsx';
import FooterComponent from '@/client/layout/partials/FooterComponent';

const DetailComponent = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // 상품 설명 이미지(detailImages)
  const [productDetailImages, setProductDetailImages] = useState([]);

  // 상품 설명 이미지 파일 이름
  const [productDetailImageNames, setProductDetailImageNames] = useState([]);

  // 상품 대표 이미지, 썸네일 이미지(thumbnailImage)
  const [selectedThumbnailImage, setSelectedThumbnailImage] = useState(null);

  // 상품 이미지들(listImages)
  const [productImages, setProductImages] = useState(Array(5).fill(null));

  // 상품 이미지들의 인덱스 저장
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // 할인 적용 여부
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);

  // 파일 입력 필드를 참조
  const detailImageInputRef = useRef(null);
  // const productImageInputRef = useRef(null);

  const DisplayStatus = {
    VISIBLE: 'Y',
    INVISIBLE: 'N',
  };

  const DeliveryType = {
    ONETIME: 'ONETIME',
    SUBSCRIPTION: 'SUBSCRIPTION',
    BOTH: 'BOTH',
  };

  // 초기 상태 설정
  const [productInfo, setProductInfo] = useState({
    name: '', // 상품명
    categoryName: '', // 카테고리
    productInformation: '', // 상품 설명 문구
    cost: 0, // 가격
    isDiscount: DisplayStatus.INVISIBLE, // 할인 적용 여부
    discountRate: 0, // 할인율
    discountedPrice: 0, // 할인된 가격
    discountStartDate: '', // 할인 시작일
    discountEndDate: '', // 할인 종료일
    deliveryType: '', // 배송 타입
    stock: 0, // 재고
    isVisible: DisplayStatus.VISIBLE,
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/products/${productId}`)
      .then((response) => {
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
        setProductDetailImages(product.detailImages);
        setSelectedThumbnailImage(product.thumbnailImage);
        setProductImages(product.listImages);
      })
      .catch((error) => {
        console.error('There was an error fetching the product details!', error);
      });

    //카테고리 목록 가져오기
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/categories`)
      .then((response) => {
        if (response.data && Array.isArray(response.data.content)) {
          setCategories(response.data.content);
        } else {
          console.error('Unexpected response format for categories');
          setCategories([]);
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the categories!', error);
        setCategories([]);
      });
  }, [productId]);

  const updateProduct = () => {
    const formData = new FormData();

    // JSON 데이터 추가
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

    // 이미지 파일 추가
    if (selectedThumbnailImage && isValidDataURI(selectedThumbnailImage)) {
      formData.append('thumbnailImage', dataURItoBlob(selectedThumbnailImage), 'thumbnail.jpg');
    }

    productImages.forEach((image, index) => {
      if (image && isValidDataURI(image)) {
        formData.append('listImages', dataURItoBlob(image), `list_${index}.jpg`);
      }
    });

    productDetailImages.forEach((image, index) => {
      if (isValidDataURI(image)) {
        formData.append('detailImages', dataURItoBlob(image), `detail_${index}.jpg`);
      }
    });

    fetch(`${import.meta.env.VITE_BACKEND_URL}/products/${productId}`, {
      method: 'PUT',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log('Product updated successfully');
          moveList();
        } else {
          console.error('Failed to update product');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  function isValidDataURI(dataURI) {
    const regex =
      /^\s*data:([a-zA-Z0-9]+\/[a-zA-Z0-9\-\+\.]+)?(;[a-zA-Z\-]+\=[a-zA-Z0-9\-]+)*(;base64)?,([a-zA-Z0-9\/\+\=]+)?\s*$/;
    return regex.test(dataURI);
  }

  function dataURItoBlob(dataURI) {
    if (!isValidDataURI(dataURI)) {
      console.error('Invalid Data URI:', dataURI);
      return new Blob(); // Return an empty Blob if the data URI is invalid
    }

    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    // stock, cost, discountRate는 숫자로 변환
    if (name === 'stock' || name === 'cost' || name === 'discountRate') {
      parsedValue = value === '' ? 0 : parseInt(value, 10);
    }

    // 할인 적용 여부
    if (name === 'isDiscount') {
      setIsDiscountApplied(value === DisplayStatus.VISIBLE);
      parsedValue = value === 'Y' ? DisplayStatus.VISIBLE : DisplayStatus.INVISIBLE;
    }

    // 배송 타입 변환
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

  // 카테고리 드롭다운 클릭 이벤트 핸들러 추가
  const handleCategorySelect = (categoryName, categoryId) => {
    setProductInfo((prev) => ({
      ...prev,
      categoryName,
      categoryId,
    }));
    setIsCategoryDropdownOpen(false);
  };

  const handleDetailImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newImages = [];
      const newImageNames = [];

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newImages.push(event.target.result);
          newImageNames.push(file.name);

          if (newImages.length === files.length) {
            setProductDetailImages((prevImages) => [...prevImages, ...newImages]);
            setProductDetailImageNames((prevNames) => [...prevNames, ...newImageNames]);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setProductDetailImages([]);
      setProductDetailImageNames([]);
    }
  };

  const handleThumbnailImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedThumbnailImage(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setSelectedThumbnailImage(null);
    }
  };

  const handleImagesChange = (e, index) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProductImages((prevImages) => {
          const newImages = [...prevImages];
          newImages[index] = event.target.result;
          return newImages;
        });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSelectImage = (index) => {
    setSelectedImageIndex(index);
  };

  const handleDetailImageButtonClick = () => {
    if (detailImageInputRef.current) {
      detailImageInputRef.current.click();
    }
  };

  const handleRemoveImage = (index) => {
    setProductImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = null;
      return newImages;
    });
    if (selectedImageIndex === index) {
      setSelectedImageIndex(null);
    }
  };

  const moveList = () => {
    navigate('/product');
  };

  const dummyEvent = () => {
    alert('더미 이벤트 발생');
  };

  return (
    <div className='w-full h-full flex flex-col justify-between p-4'>
      <section className='flex-auto p-4'>
        <div className='grid grid-cols-2 gap-4'>
          {/* 상품 정보 */}
          <div className='p-4 rounded'>
            <h2 className='text-xl font-semibold mb-4'>상품 정보</h2>
            <hr className='border-t-2 border-gray-300 mb-4' />
            <div className='space-y-6'>
              <div className='flex items-center'>
                <label className='w-1/4 text-sm font-medium'>상품명</label>
                <div className='flex-1 ml-32'>
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
                            onClick={() => handleCategorySelect(category.name)}
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
                    value={productInfo.productInformation}
                    onChange={handleInputChange}
                    className='w-full border p-2 rounded-md h-24'
                    placeholder='최대 50자 입력 가능'
                  />
                </div>
              </div>
              <hr className='border-gray-200' />
              <div className='flex items-center'>
                <label className='w-1/4 text-sm font-medium'>상품 설명 이미지 파일 (선택)</label>
                <div className='flex-1 ml-32'>
                  <button
                    onClick={handleDetailImageButtonClick}
                    className='border border-orange-500 text-orange-500 px-4 py-2 rounded-md w-full hover:bg-brandOrange hover:text-white'
                  >
                    이미지 업로드
                  </button>
                  <input
                    type='file'
                    ref={detailImageInputRef}
                    onChange={handleDetailImageChange}
                    className='hidden'
                    multiple
                  />
                  {productDetailImageNames.length > 0 && (
                    <div className='mt-2 text-sm text-gray-600'>
                      {productDetailImageNames.join(', ')}
                    </div>
                  )}
                </div>
              </div>
              <hr className='border-gray-200' />
            </div>
          </div>

          {/* 상품 이미지 */}
          <div className='p-4 rounded'>
            <h2 className='text-xl font-semibold mb-4'>상품 이미지</h2>
            <hr className='border-t-2 border-gray-300 mb-4' />
            <div className='space-y-6'>
              <div>
                <h3 className='text-sm font-medium mb-2'>상품 대표 이미지</h3>
                <div className='w-full max-w-md mx-auto mt-6'>
                  <div className='border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center'>
                    <div className='flex flex-col items-center space-y-4'>
                      {selectedThumbnailImage ? (
                        <img
                          src={selectedThumbnailImage}
                          alt='Selected'
                          className='w-32 h-32 object-cover'
                        />
                      ) : (
                        <div className='border p-4 rounded flex flex-col items-center justify-center w-32 h-32 bg-gray-50'>
                          <p className='text-sm text-gray-500'>
                            이미지 업로드 <br />
                            300 * 300
                          </p>
                        </div>
                      )}
                      <input
                        type='file'
                        name='productImage'
                        onChange={handleThumbnailImageChange}
                        className='w-full text-center p-2 cursor-pointer'
                      />
                    </div>
                  </div>
                </div>
              </div>
              <hr className='border-gray-200' />
              <div>
                <h3 className='text-sm font-medium mb-2'>상품 이미지</h3>
                <div className='flex'>
                  <div className='w-4/5 grid grid-cols-5 gap-4'>
                    {productImages.map((image, index) => (
                      <div
                        key={index}
                        className={`border rounded-md p-2 flex items-center justify-center cursor-pointer aspect-square ${selectedImageIndex === index ? 'border-orange-500' : ''}`}
                        onClick={() => handleSelectImage(index)}
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={`Product ${index}`}
                            className='w-full h-full object-cover rounded-md'
                          />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center bg-gray-50 rounded-md'>
                            <p className='text-sm text-gray-500'>이미지 {index + 1}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className='w-1/5 border-2 border-dashed border-gray-300 rounded-md p-4 ml-4 flex flex-col items-center justify-center'>
                    {selectedImageIndex !== null && productImages[selectedImageIndex] ? (
                      <>
                        <img
                          src={productImages[selectedImageIndex]}
                          alt={`Selected ${selectedImageIndex}`}
                          className='w-32 h-32 object-cover mb-2 rounded-md'
                        />
                        <input
                          type='file'
                          onChange={(e) => handleImagesChange(e, selectedImageIndex)}
                          className='mb-2 text-sm'
                        />
                        <div className='flex space-x-2'>
                          <button
                            onClick={() =>
                              handleImagesChange({ target: { files: [] } }, selectedImageIndex)
                            }
                          >
                            <EditIcon className='w-6 h-6 text-gray-600' />
                          </button>
                          <button onClick={() => handleRemoveImage(selectedImageIndex)}>
                            <TrashIcon className='w-6 h-6 text-gray-600' />
                          </button>
                        </div>
                      </>
                    ) : (
                      <input
                        type='file'
                        onChange={(e) =>
                          handleImagesChange(
                            e,
                            selectedImageIndex !== null
                              ? selectedImageIndex
                              : productImages.indexOf(null),
                          )
                        }
                        className='cursor-pointer text-sm'
                      />
                    )}
                  </div>
                </div>
              </div>
              <hr className='border-gray-200' />
            </div>
          </div>

          {/* 금액 정보 */}
          <div className='p-4 rounded'>
            <h2 className='text-xl font-semibold mb-4'>금액 정보</h2>
            <hr className='border-t-2 border-gray-300 mb-4' />
            <div className='space-y-6'>
              <div className='flex items-center'>
                <label className='w-1/4 text-sm font-medium'>금액</label>
                <div className='flex-1 flex items-center ml-32'>
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
                  <label className='flex items-center ml-32'>
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
              <div className='flex items-center '>
                <label className='w-1/4 text-sm font-medium'>기간 설정</label>
                <div className='flex-1 flex items-center space-x-2 ml-32'>
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
                <label className='w-1/4 text-sm font-medium '>할인율</label>
                <div className='flex-1 flex items-center ml-32'>
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
                <div className='flex-1 ml-32'>
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

          {/* 판매 정보 */}
          <div className='p-4 rounded'>
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
                <div className='flex-1 flex items-center ml-20'>
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
      <FooterComponent
        btn1={{ label: '상품 삭제', event: dummyEvent }}
        btn2={{ label: '변경사항 적용', event: updateProduct }}
        back={{ label: '목록으로', event: moveList }}
      />
    </div>
  );
};

export default DetailComponent;
