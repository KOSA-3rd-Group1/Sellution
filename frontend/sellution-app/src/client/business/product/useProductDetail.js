import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

const useProductDetail = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const fromPage = searchParams.get('fromPage') || '1';

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productDetailImages, setProductDetailImages] = useState([]);
  const [productDetailImageNames, setProductDetailImageNames] = useState([]);
  const [selectedThumbnailImage, setSelectedThumbnailImage] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const DisplayStatus = { VISIBLE: 'Y', INVISIBLE: 'N' };
  const DeliveryType = { ONETIME: 'ONETIME', SUBSCRIPTION: 'SUBSCRIPTION', BOTH: 'BOTH' };

  const MAX_VALUE = 1000000000;

  const formatPrice = (price) => {
    return Number(price).toLocaleString('ko-KR');
  };

  const parsePrice = (priceString) => {
    return parseInt(priceString.replace(/[^\d]/g, ''), 10);
  };

  const calculateDiscountedPrice = (cost, discountRate) => {
    const discountedPrice = cost - (cost * discountRate) / 100;
    return Math.round(discountedPrice);
  };

  const [productInfo, setProductInfo] = useState({
    name: '',
    categoryId: 'null',
    categoryName: 'null',
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
        updatedInfo.discountedPrice = calculateDiscountedPrice(
          updatedInfo.cost,
          updatedInfo.discountRate,
        );
      }
      return updatedInfo;
    });
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/products/${productId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return true; // 성공 시 true 반환
    } catch (error) {
      console.error('상품 삭제 중 오류 발생:', error);
      throw error; // 오류 발생 시 에러를 throw
    }
  };

  const updateProduct = async () => {
    try {
      const formData = new FormData();
      const jsonData = {
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

      if (selectedThumbnailImage.length > 0) {
        const thumbnail = selectedThumbnailImage[0];
        if (thumbnail.file) {
          formData.append('thumbnailImage', thumbnail.file, 'thumbnail.jpg');
        } else {
          jsonData.thumbnailImage = thumbnail.preview;
        }
      }

      jsonData.listImages = productImages.map((image) => image.preview);
      productImages.forEach((image, index) => {
        if (image.file) {
          formData.append('listImages', image.file, `list_${index}.jpg`);
        }
      });

      jsonData.detailImages = productDetailImages.map((image) => image.preview);
      productDetailImages.forEach((image, index) => {
        if (image.file) {
          formData.append('detailImages', image.file, `detail_${index}.jpg`);
        }
      });

      formData.set('product', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));

      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/products/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return true; // 성공 시 true 반환
    } catch (error) {
      console.error('상품 업데이트 중 오류 발생:', error);
      throw error; // 오류 발생 시 에러를 throw
    }
  };

  const handleCategorySelect = (categoryName, categoryId) => {
    setProductInfo((prev) => ({
      ...prev,
      categoryName,
      categoryId,
    }));
    setIsCategoryDropdownOpen(false);
  };

  const handleThumbnailImageChange = (images) => setSelectedThumbnailImage(images);
  const handleProductImagesChange = (images) => setProductImages(images);
  const handleDetailImagesChange = (images) => {
    setProductDetailImages(images);
    setProductDetailImageNames(images.map((_, index) => `상품 설명 이미지 ${index + 1}`));
  };

  const handleUploadSuccess = (newImages) => console.log('Uploaded images:', newImages);
  const handleBeforeRemove = (image, index) => window.confirm(`이미지를 제거하시겠습니까?`);
  const handleEditImage = (updatedImage, index) => window.confirm(`이미지를 변경하시겠습니까?`);

  const moveList = useCallback(() => {
    console.log('moveList called');
    navigate(`/product?page=${fromPage}`);
  }, [navigate, fromPage]);

  const fetchProductData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products/${productId}`);
      const product = response.data;

      setProductInfo({
        name: product.name,
        categoryName: product.categoryName,
        productInformation: product.productInformation,
        cost: product.cost,
        isDiscount: product.isDiscount,
        discountRate: product.discountRate,
        discountedPrice: product.discountedPrice,
        discountStartDate: product.discountStartDate ? product.discountStartDate.split('T')[0] : '',
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
          : [],
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

  const refreshProductData = async () => {
    await fetchProductData();
  };

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  useEffect(() => {
    if (productInfo.isDiscount === 'Y') {
      const discountedPrice = Math.round(
        productInfo.cost - (productInfo.cost * productInfo.discountRate) / 100,
      );
      setProductInfo((prev) => ({ ...prev, discountedPrice }));
    } else {
      setProductInfo((prev) => ({ ...prev, discountedPrice: productInfo.cost }));
    }
  }, [productInfo.cost, productInfo.discountRate, productInfo.isDiscount]);

  // const formatPrice = (price) => {
  //   return price.toLocaleString('ko-KR');
  // };

  return {
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
  };
};

export default useProductDetail;
