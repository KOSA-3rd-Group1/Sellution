import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useClientName from '../layout/useClientName';
import useOrderListStore from './../../store/stores/useOrderListStore';

const useDetail = () => {
  const navigate = useNavigate();
  const clientName = useClientName();
  const { updateOrderListForDirectOrder } = useOrderListStore();
  const { onetimeDeliveryId } = useParams();
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

  const handleSlideChange = (index) => {
    setActiveSlide(index + 1); // setActiveSlide는 1부터 시작하는 인덱스를 사용하므로 +1 해줍니다.
    setCurrentImageIndex(index);
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
      navigate(`/shopping/${clientName}/onetime/order`);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('id: ', `${onetimeDeliveryId}`);
        const response = await axios.get(`http://localhost:8080/products/${onetimeDeliveryId}`);
        console.log(response.data);
        setProductToShow(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [onetimeDeliveryId]);

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
    handleDirectOrder,
    handleSlideChange,
  };
};
export default useDetail;
