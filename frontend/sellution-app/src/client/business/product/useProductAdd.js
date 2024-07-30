import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

    // 카테고리가 선택되지 않았다면 관련 필드를 제거
    if (!jsonData.categoryName || jsonData.categoryName === '') {
      delete jsonData.categoryName;
      delete jsonData.categoryId;
    }

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

  return {
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
  };
};

export default useProductAdd;
