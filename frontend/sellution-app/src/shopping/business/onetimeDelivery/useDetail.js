import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useCompanyInfoStore from '@/shopping/store/stores/useCompanyInfoStore';
import useOrderListStore from './../../store/stores/useOrderListStore';
import useOnetimeCartStore from '../../store/stores/useOnetimeCartStore';
import useAuthStore from '@/shopping/store/stores/useAuthStore';
import useUserInfoStore from '@/shopping/store/stores/useUserInfoStore';

const useDetail = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const navigate = useNavigate();
  const clientName = useCompanyInfoStore((state) => state.name);
  const customerId = useUserInfoStore((state) => state.id);
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

  const { onetimeCart, updateOnetimeCart } = useOnetimeCartStore();
  const [isDetailPageModalVisible, setIsDetailPageModalVisible] = useState(false);

  const addToOnetimeCart = () => {
    if (accessToken === null || accessToken === '') {
      navigate(`/shopping/${clientName}/login`, {
        state: { from: location.pathname },
      });
    }
    //stock대신 quantity를 가진 newItem 객체 만들어서, 장바구니에 넣기
    else if (itemCountToAdd > 0) {
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
      updateOnetimeCart(newItem);
      console.log('단건배송 장바구니 목록: ', onetimeCart);
      setItemCountToAdd(0); //장바구니에 넣어준 다음에 수량 0으로 다시 변경 >> 장바구니 버튼 누르면 0으로 초기화 되는 것
      setIsDetailPageModalVisible(true);
    }
  };

  const handleDirectOrder = () => {
    if (accessToken === null || accessToken === '') {
      navigate(`/shopping/${clientName}/login`, {
        state: { from: location.pathname },
      });
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
      updateOrderListForDirectOrder(newItem);
      setItemCountToAdd(0);
      navigate(`/shopping/${clientName}/onetime/order/${customerId}`);
    }
  };

  const moveToOnetimeList = () => {
    navigate(`/shopping/${clientName}/onetime`);
  };
  const moveToOnetimeCartPage = () => {
    navigate(`/shopping/${clientName}/onetime/cart`);
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
    addToOnetimeCart,
    isDetailPageModalVisible,
    moveToOnetimeList,
    moveToOnetimeCartPage,
  };
};
export default useDetail;
