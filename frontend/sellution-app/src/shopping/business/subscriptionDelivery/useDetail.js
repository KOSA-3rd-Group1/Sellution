import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useClientName from '../layout/useClientName';
import useOrderListStore from '../../store/stores/useOrderListStore';
import useSubscriptionCartStore from '../../store/stores/useSubscriptionCartStore';

const useDetail = () => {
  const navigate = useNavigate();
  const clientName = useClientName();
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
  const addToSubscriptionCart = () => {
    if (itemCountToAdd > 0) {
      const newItem = {
        id: productToShow.productId,
        productId: productToShow.productId,
        quantity: itemCountToAdd,
        name: productToShow.name,
        cost: productToShow.cost,
        discountRate: productToShow.discountRate,
        discountedPrice: productToShow.discountedPrice,
        stock: productToShow.stock,
      };
      updateSubscriptionCart(newItem);
      console.log('정기배송 장바구니 목록: ', subscriptionCart);
      setItemCountToAdd(0);
      //setIsDetailPageModalVisible(true);
      navigate(`/shopping/${clientName}/subscription`);
    }
  };

  const handleDirectOrder = () => {
    if (itemCountToAdd > 0) {
      const newItem = {
        id: productToShow.productId,
        quantity: itemCountToAdd,
        name: productToShow.name,
        cost: productToShow.cost,
        discountRate: productToShow.discountRate,
        discountedPrice: productToShow.discountedPrice,
        stock: productToShow.stock,
      };
      updateOrderListForDirectOrder(newItem);
      setItemCountToAdd(0);
      const customerId = 1;
      navigate(`/shopping/${clientName}/subscription/order/${customerId}`);
    }
  };

  const handleSlideChange = (index) => {
    setActiveSlide(index + 1); // setActiveSlide는 1부터 시작하는 인덱스를 사용하므로 +1 해줍니다.
    setCurrentImageIndex(index);
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
  };
};
export default useDetail;
