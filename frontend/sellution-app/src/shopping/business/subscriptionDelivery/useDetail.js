import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';
import useOrderListStore from '../../store/stores/useOrderListStore';
import useSubscriptionCartStore from '../../store/stores/useSubscriptionCartStore';
import useAuthStore from '@/shopping/store/stores/useAuthStore';
import useUserInfoStore from '@/shopping/store/stores/useUserInfoStore';

const useDetail = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const navigate = useNavigate();
  const clientName = useCompanyInfoStore((state) => state.name);
  const customerId = useUserInfoStore((state) => state.id);
  const { updateOrderListForDirectOrder } = useOrderListStore();
  const { subscriptionDeliveryId } = useParams();
  const [activeSlide, setActiveSlide] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productToShow, setProductToShow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemCountToAdd, setItemCountToAdd] = useState(0);
  const [isDetailOptionVisible, setDetailOptionVisible] = useState(false);

  const toggleDetailOption = () => {
    setDetailOptionVisible(!isDetailOptionVisible);
  };
  const increaseQuantity = () => {
    setItemCountToAdd((prevQuantity) => prevQuantity + 1);
  };
  const decreaseQuantity = () => {
    setItemCountToAdd((prevQuantity) => Math.max(prevQuantity - 1, 0));
  };

  const { subscriptionCart, updateSubscriptionCart } = useSubscriptionCartStore();
  const [isDetailPageModalVisible, setIsDetailPageModalVisible] = useState(false);
  const addToSubscriptionCart = () => {
    if (accessToken === null || accessToken === '') {
      navigate(`/shopping/${clientName}/login`);
    } else if (itemCountToAdd > 0) {
      const newItem = {
        id: productToShow.productId,
        productId: productToShow.productId,
        quantity: itemCountToAdd,
        name: productToShow.name,
        cost: productToShow.cost,
        discountRate: productToShow.discountRate,
        discountedPrice: productToShow.discountedPrice,
        stock: productToShow.stock,
        thumbnailImage: productToShow.thumbnailImage,
      };
      updateSubscriptionCart(newItem);
      console.log('정기배송 장바구니 목록: ', subscriptionCart);
      setItemCountToAdd(0);
      setIsDetailPageModalVisible(true);
      //navigate(`/shopping/${clientName}/subscription`);
    }
  };

  const handleDirectOrder = () => {
    if (accessToken === null || accessToken === '') {
      navigate(`/shopping/${clientName}/login`);
    } else if (itemCountToAdd > 0) {
      const newItem = {
        id: productToShow.productId,
        quantity: itemCountToAdd,
        name: productToShow.name,
        cost: productToShow.cost,
        discountRate: productToShow.discountRate,
        discountedPrice: productToShow.discountedPrice,
        stock: productToShow.stock,
        thumbnailImage: productToShow.thumbnailImage,
      };
      updateOrderListForDirectOrder(newItem);
      setItemCountToAdd(0);
      navigate(`/shopping/${clientName}/subscription/order/${customerId}`);
    }
  };

  const handleSlideChange = (index) => {
    setActiveSlide(index + 1); // setActiveSlide는 1부터 시작하는 인덱스를 사용하므로 +1 해줍니다.
    setCurrentImageIndex(index);
  };

  const moveToSubscriptionList = () => {
    navigate(`/shopping/${clientName}/subscription`);
  };
  const moveToSubscriptionCartPage = () => {
    navigate(`/shopping/${clientName}/subscription/cart`);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('id: ', `${subscriptionDeliveryId}`);
        const response = await axios.get(
          `http://localhost:8080/products/${subscriptionDeliveryId}`,
        );
        console.log(response.data);
        setProductToShow(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [subscriptionDeliveryId]);

  return {
    activeSlide,
    setActiveSlide,
    productToShow,
    isLoading,
    error,
    itemCountToAdd,
    setItemCountToAdd,
    increaseQuantity,
    decreaseQuantity,
    isDetailOptionVisible,
    toggleDetailOption,
    addToSubscriptionCart,
    handleDirectOrder,
    handleSlideChange,
    isDetailPageModalVisible,
    moveToSubscriptionList,
    moveToSubscriptionCartPage,
  };
};
export default useDetail;
