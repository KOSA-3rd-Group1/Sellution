import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { generateShortFileName } from '@/client/utility/functions/formatterFunction';

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

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: '',
    title: '',
    message: '',
    onConfirm: null,
  });

  useEffect(() => {
    const shopCompanyStorage = localStorage.getItem('shop-company-storage');
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
      // 숫자와 콤마만 허용
      parsedValue = value.replace(/[^\d,]/g, '');
      // 콤마 제거 후 숫자로 변환
      const numericValue = parseInt(parsedValue.replace(/,/g, ''), 10);
      // 숫자를 다시 콤마가 포함된 문자열로 변환
      parsedValue = isNaN(numericValue) ? '' : formatPrice(numericValue);
    } else if (['stock', 'discountRate'].includes(name)) {
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

  const openAlertModal = (type, title, message, onConfirm = null) => {
    setAlertModal({ isOpen: true, type, title, message, onConfirm });
  };

  const closeAlertModal = () => {
    setAlertModal({ isOpen: false, type: '', title: '', message: '', onConfirm: null });
  };

  const handleAlertConfirm = async () => {
    if (alertModal.onConfirm) {
      await alertModal.onConfirm();
    }
    closeAlertModal();
  };

  const deleteProduct = async () => {
    openAlertModal('warning', '상품 삭제 확인', '정말로 이 상품을 삭제하시겠습니까?', async () => {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/products/${productId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        openAlertModal('success', '상품 삭제 완료', '상품이 성공적으로 삭제되었습니다.', moveList);
      } catch (error) {
        console.error('상품 삭제 중 오류 발생:', error);
        openAlertModal('error', '상품 삭제 실패', '상품 삭제 중 오류가 발생했습니다.');
      }
    });
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

  const handleCategorySelect = (categoryName, categoryId) => {
    setProductInfo((prev) => ({
      ...prev,
      categoryName,
      categoryId,
    }));
    setIsCategoryDropdownOpen(false);
  };

  const handleThumbnailImageChange = (images) => setSelectedThumbnailImage(images);
  const handleProductImagesChange = (images) => {
    console.log('새로운 상품 이미지 설정:', images);
    setProductImages(images);
  };

  const handleDetailImagesChange = (images) => {
    console.log('새로운 상세 이미지 설정:', images);
    setProductDetailImages(images);
    setProductDetailImageNames(images.map((_, index) => `상품 설명 이미지 ${index + 1}`));
  };

  const updateProduct = async () => {
    openAlertModal('warning', '상품 수정 확인', '변경사항을 저장하시겠습니까?', async () => {
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

        // 썸네일 이미지 처리
        if (selectedThumbnailImage.length > 0 && selectedThumbnailImage[0].file) {
          formData.append('thumbnailImage', selectedThumbnailImage[0].file);
        } else if (selectedThumbnailImage.length > 0) {
          jsonData.thumbnailImage = selectedThumbnailImage[0].preview;
        }

        // 상품 이미지 처리
        jsonData.listImages = [];
        productImages.forEach((image, index) => {
          if (image.file) {
            formData.append(`listImages`, image.file);
          } else {
            jsonData.listImages.push(image.preview);
          }
        });

        // 상세 이미지 처리
        jsonData.detailImages = [];
        productDetailImages.forEach((image, index) => {
          if (image.file) {
            formData.append(`detailImages`, image.file);
          } else {
            jsonData.detailImages.push(image.preview);
          }
        });

        formData.append(
          'product',
          new Blob([JSON.stringify(jsonData)], { type: 'application/json' }),
        );

        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/products/${productId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        openAlertModal('success', '상품 수정 완료', '상품이 성공적으로 수정되었습니다.', moveList);
      } catch (error) {
        console.error('상품 업데이트 중 오류 발생:', error);
        openAlertModal('error', '상품 수정 실패', '상품 수정 중 오류가 발생했습니다.');
      }
    });
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

        // 썸네일 이미지 처리
        if (product.thumbnailImage) {
          const newImage = await convertImageUrlToFileAndBlob(product.thumbnailImage);
          setSelectedThumbnailImage(newImage ? [newImage] : []);
        }

        // 상품 이미지 처리
        const productImagesPromises = product.listImages.map(convertImageUrlToFileAndBlob);
        const productImages = await Promise.all(productImagesPromises);
        setProductImages(productImages.filter(Boolean));

        // 상세 이미지 처리
        const detailImagesPromises = product.detailImages.map(convertImageUrlToFileAndBlob);
        const detailImages = await Promise.all(detailImagesPromises);
        setProductDetailImages(detailImages.filter(Boolean));

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching product data:', err);
        setError('상품 정보를 불러오는 데 실패했습니다.');
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [productId, convertImageUrlToFileAndBlob]);

  useEffect(() => {
    if (productInfo.isDiscount === 'Y') {
      const discountedPrice =
        productInfo.cost - (productInfo.cost * productInfo.discountRate) / 100;
      setProductInfo((prev) => ({ ...prev, discountedPrice }));
    }
  }, [productInfo.cost, productInfo.discountRate, productInfo.isDiscount]);

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
    alertModal,
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
    openAlertModal,
    closeAlertModal,
    handleAlertConfirm,
  };
};

export default useProductDetail;
