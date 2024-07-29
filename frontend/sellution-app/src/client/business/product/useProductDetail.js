import { useState, useEffect } from 'react';
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
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/products/${productId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        alert('상품이 성공적으로 삭제되었습니다.');
        navigate('/product');
      } catch (error) {
        console.error('상품 삭제 중 오류 발생:', error);
        alert('상품 삭제에 실패했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const dataURItoBlob = (dataURI) => {
    if (!dataURI || typeof dataURI !== 'string' || !dataURI.startsWith('data:')) {
      console.error('Invalid data URI:', dataURI);
      return null;
    }

    const splitDataURI = dataURI.split(',');
    const byteString = atob(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
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

      alert('상품 정보가 성공적으로 업데이트되었습니다.');
      navigate(`/product?page=${fromPage}`);
    } catch (error) {
      console.error('상품 업데이트 중 오류 발생:', error);
      alert('상품 정보 업데이트에 실패했습니다. 다시 시도해 주세요.');
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

    fetchProductData();
  }, [productId]);

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
  };
};

export default useProductDetail;
