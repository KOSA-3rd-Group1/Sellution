import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { generateShortFileName2 } from '@/client/utility/functions/formatterFunction';

const useProductAdd = () => {
  const navigate = useNavigate();

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

  const MAX_VALUE = 1000000000;

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toLocaleString('ko-KR');
    }
    return '';
  };

  const parsePrice = (priceString) => {
    if (typeof priceString === 'number') {
      return priceString;
    }
    if (typeof priceString !== 'string') {
      return 0;
    }
    return parseInt(priceString.replace(/[^\d]/g, ''), 10) || 0;
  };

  const calculateDiscountedPrice = (cost, discountRate) => {
    const parsedCost = parsePrice(cost);
    const discountedPrice = parsedCost - (parsedCost * discountRate) / 100;
    return Math.round(discountedPrice);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [images, setImages] = useState({
    thumbnail: null,
    product: [],
    detail: [],
  });

  const [categories, setCategories] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    const shopCompanyStorage = localStorage.getItem('userInfo');
    if (shopCompanyStorage) {
      const { state } = JSON.parse(shopCompanyStorage);
      if (state && state.companyId) {
        setCompanyId(state.companyId);
      }
    }
  }, []);

  const fetchCategories = async () => {
    if (!companyId) return;
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`, {
        params: { companyId: companyId, size: 100 },
      });
      setCategories(Array.isArray(response.data.content) ? response.data.content : []);
    } catch (error) {
      console.error('There was an error fetching the categories!', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchCategories();
    }
  }, [companyId]);

  useEffect(() => {
    if (productInfo.isDiscount === DisplayStatus.VISIBLE) {
      const discountedPrice =
        productInfo.cost - (productInfo.cost * productInfo.discountRate) / 100;
      setProductInfo((prev) => ({ ...prev, discountedPrice }));
    }
  }, [productInfo.cost, productInfo.discountRate, productInfo.isDiscount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    if (name === 'cost') {
      const numericValue = parsePrice(value);
      parsedValue = isNaN(numericValue) ? '' : Math.min(MAX_VALUE, numericValue);
      parsedValue = formatPrice(parsedValue);
    } else if (name === 'stock') {
      const numericValue = parseInt(value.replace(/[^\d]/g, ''), 10);
      parsedValue = isNaN(numericValue) ? '' : Math.min(MAX_VALUE, numericValue).toString();
    } else if (name === 'discountRate') {
      parsedValue = value === '' ? 0 : Math.min(100, Math.max(0, parseInt(value, 10)));
    }

    if (name === 'isDiscount') {
      const isDiscountApplied = value === DisplayStatus.VISIBLE;
      setIsDiscountApplied(isDiscountApplied);
      parsedValue = isDiscountApplied ? DisplayStatus.VISIBLE : DisplayStatus.INVISIBLE;

      if (!isDiscountApplied) {
        setProductInfo((prev) => ({
          ...prev,
          isDiscount: DisplayStatus.INVISIBLE,
          discountRate: 0,
          discountStartDate: '',
          discountEndDate: '',
        }));
        return;
      }
    }

    if (name === 'deliveryType') {
      parsedValue = Object.values(DeliveryType).includes(value) ? value : '';
    }

    setProductInfo((prev) => {
      const updatedInfo = { ...prev, [name]: parsedValue };
      if (name === 'cost' || name === 'discountRate') {
        const cost = parsePrice(updatedInfo.cost);
        updatedInfo.discountedPrice = calculateDiscountedPrice(cost, updatedInfo.discountRate);
      }
      return updatedInfo;
    });
  };

  const handleCategorySelect = (categoryName, categoryId) => {
    setProductInfo((prev) => ({ ...prev, categoryName, categoryId }));
    setIsCategoryDropdownOpen(false);
  };

  const convertImageUrlToFileAndBlob = useCallback(async (imageUrl) => {
    try {
      const proxyUrl = `/s3-bucket${imageUrl}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const fileName = imageUrl.split('/').pop() || 'image.png';
      const newImage = {
        file: new File([blob], fileName, { type: blob.type }),
        preview: URL.createObjectURL(blob),
        id: Date.now() + Math.random(),
      };
      return newImage;
    } catch (error) {
      console.error('Error converting image:', error);
      return null;
    }
  }, []);

  const handleImageChange = (type) => async (newImages) => {
    if (type === 'thumbnail') {
      // 단일 이미지 처리
      if (newImages && newImages.length > 0) {
        const image = newImages[0];
        const shortFileName = generateShortFileName2(type, 0, image.file);
        const newFile = new File([image.file], shortFileName, { type: image.file.type });
        setImages((prev) => ({ ...prev, [type]: { ...image, file: newFile } }));
      } else {
        setImages((prev) => ({ ...prev, [type]: null }));
      }
    } else {
      // 여러 이미지 처리 (product, detail)
      const processedImages = await Promise.all(
        newImages.map(async (image, index) => {
          if (image.file instanceof File) {
            const shortFileName = generateShortFileName2(type, index, image.file);
            const newFile = new File([image.file], shortFileName, { type: image.file.type });
            return { ...image, file: newFile };
          }
          return image;
        }),
      );
      setImages((prev) => ({ ...prev, [type]: processedImages }));
    }
  };

  const handleUploadSuccess = (newImages) => {
    console.log('업로드된 이미지:', newImages);
  };

  const handleBeforeRemove = () => window.confirm('이미지를 제거하시겠습니까?');

  const handleEditImage = () => window.confirm('이미지를 변경하시겠습니까?');

  // const getLastPageNumber = async () => {
  //   try {
  //     const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`, {
  //       params: {
  //         companyId: companyId,
  //         size: 10, // 페이지당 상품 수, API에 맞게 조정하세요
  //         page: 0, // 첫 페이지 요청
  //       },
  //     });

  //     const totalPages = response.data.totalPages || 1;
  //     return totalPages - 1; // 페이지 번호가 0부터 시작한다고 가정
  //   } catch (error) {
  //     console.error('마지막 페이지 번호를 가져오는데 실패했습니다:', error);
  //     return 0; // 에러 발생 시 첫 페이지로 이동
  //   }
  // };

  const moveList = async () => {
    //const lastPage = await getLastPageNumber();
    navigate(`/product`);
  };

  const registerProduct = async () => {
    if (!companyId) {
      console.error('Company ID를 찾을 수 없습니다');
      return;
    }

    const formData = new FormData();

    const jsonData = {
      companyId: companyId,
      ...productInfo,
      stock: Number(productInfo.stock), // stock을 숫자로 변환
      cost: parsePrice(productInfo.cost), // cost를 숫자로 변환
      discountStartDate: productInfo.discountStartDate
        ? `${productInfo.discountStartDate}T00:00:00`
        : null,
      discountEndDate: productInfo.discountEndDate
        ? `${productInfo.discountEndDate}T23:59:59`
        : null,
    };

    // 카테고리가 선택되지 않았다면 관련 필드를 제거
    if (!jsonData.categoryName || jsonData.categoryName === '') {
      delete jsonData.categoryName;
      delete jsonData.categoryId;
    }

    // 서버로 보내는 데이터 콘솔에 출력
    console.log('서버로 보내는 JSON 데이터:', JSON.stringify(jsonData, null, 2));

    formData.append('product', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));

    // thumbnail 이미지 처리
    if (images.thumbnail && images.thumbnail.file) {
      formData.append('thumbnailImage', images.thumbnail.file, images.thumbnail.file.name);
    }

    // product 이미지들 처리
    images.product.forEach((image) => {
      if (image && image.file) {
        formData.append('listImages', image.file, image.file.name);
      }
    });

    // detail 이미지들 처리
    images.detail.forEach((image) => {
      if (image && image.file) {
        formData.append('detailImages', image.file, image.file.name);
      }
    });

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        console.log('상품이 성공적으로 등록되었습니다');
        moveList();
      } else {
        console.error('상품 등록에 실패했습니다');
        moveList();
        throw new Error('상품 등록 실패');
      }
    } catch (error) {
      console.error('오류:', error);
      throw error;
    }
  };

  return {
    productInfo,
    images,
    handleImageChange,
    convertImageUrlToFileAndBlob,
    categories,
    isCategoryDropdownOpen,
    isDiscountApplied,
    DisplayStatus,
    DeliveryType,
    handleInputChange,
    handleCategorySelect,
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
  };
};

export default useProductAdd;
